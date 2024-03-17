import * as React from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { connect } from "react-redux";


import { setPageType } from '../../redux/page/page.actions';
import { setUserWallet } from '../../redux/user/user.actions';

import MainLayout from '../../layouts/main-layout.component';
import Loader from "../../components/loader/Loader";



function AddBalance({ token, setPageType, setUserWallet }) {
    const [isFetching, setIsFetching] = React.useState(true);
    const [isInvalid, setIsInvalid] = React.useState(true);
    const [amount, setAmount] = React.useState(0);
    const [walletType, setWalletType] = React.useState(null);
    const [dataArray, setDataArray] = React.useState(null);
    const [timeRange, setTimeRange] = React.useState(720);
    const [chartData, setChartData] = React.useState(null);
    const [totalPlayed, setTotalPlayed] = React.useState(0);
    const [totalWon, setTotalWon] = React.useState(0);
    const [totalLost, setTotalLost] = React.useState(0);
    const [totalMoneyWon, setTotalMoneyWon] = React.useState(0);
    const [totalMoneyLost, setTotalMoneyLost] = React.useState(0);
    const [winRate, setWinRate] = React.useState(0);


    const navigate = useNavigate();


    const { t } = useTranslation(["common"]);

    React.useLayoutEffect(() => {
        setPageType('quiz');
    },[]);

    React.useEffect(() => {
        var url = `${process.env.REACT_APP_URL_LINK}/api/users/gaming-wallet?full=true`;
            // Example POST method implementation:
            console.log(url)
            async function putData(url = '') {
                // Default options are marked with *
                const response = await fetch(url, {
                method: 'GET', // *GET, POST, PUT, DELETE, etc. // include, *same-origin, omit
                headers: {
                'Authorization': 'Bearer ' + token
                // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                mode: 'cors'
            });
            return response.json(); // parses JSON response into native JavaScript objects
            }
            
            setIsFetching(true)
            putData(url)
            .then(data => {
                console.log(data);
                var newArr = []
                Object.keys(data).forEach((key) => {
                    if(key.includes("_w") && data[key] != 0){
                        newArr.push({
                            wallet:data[key],
                            amount:data[`${key.replace("_w","")}_bal`],
                            balanceType:key.replace("_w","")
                        });
                    }
                })
                console.log(newArr);
                setDataArray(newArr);
                if(newArr.length > 0){
                    setWalletType(newArr[0].balanceType);
                }
                

                setIsFetching(false);
                
            }).catch(err => {
                console.log(err);
            });


        
        
        
    },[]);


    const handleAmountChange = (e) => {
        var value = e.target.value;
        setAmount(value);
    }

    const handleWalletChange = (e) => {
        var foundIndex = dataArray.findIndex(el => el.wallet == e.target.value);
        if(foundIndex >= 0){
            setWalletType(dataArray[foundIndex].balanceType);
        }
    }

    const handleSubmit = () => {
        // Example POST method implementation:
        async function postData(url = '', data = {}) {
            // Default options are marked with *
            const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }, // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
            });
            return response.json(); // parses JSON response into native JavaScript objects
        }
        
        postData(`${process.env.REACT_APP_URL_LINK}/api/users/deposite-balance`, { amount:amount, balanceType:walletType.toUpperCase() })
            .then(data => {
                
                console.log(data);
                setUserWallet(data.wallet);
                navigate("/my-wallet");
                // JSON data parsed by `data.json()` call
            })
    }


    React.useEffect(() => {
        if(dataArray){
            var foundIndex = dataArray.findIndex(el => el.balanceType == walletType);
            if(Number(amount) != 0 && Number(dataArray[foundIndex].amount) >= Number(amount)) {
                setIsInvalid(false);
            } else {
                setIsInvalid(true);
            }
        }
        
    },[walletType, amount]);

  return (
      	<MainLayout goBack={true} title={
            <div className="title">
                <h2>{t("add__balance")}</h2>
            </div>
        }>
            <div className="resultsContainer">
                {
                    isFetching && <Loader /> 
                }
                {
                    !isFetching && <div id='contestForm'>
                    
                    {
                        walletType && <div className="form-group">
                        <label htmlFor="exampleFormControlSelect1">{t("select__wallet")}</label>
                        <select className="form-control" id="exampleFormControlSelect1" onChange={handleWalletChange}>

                        {
                            dataArray.map(el => (
                                <option key={el.wallet} value={el.wallet}>{`${el.balanceType.toUpperCase()} ${el.amount}`}</option>
                            ))
                        }
                        </select>
                        </div>
                    }


                    <div className="form-group">
                        <label htmlFor="exampleFormControlInput4">{t("amount")}</label>
                        <input type="number" className="form-control" id="exampleFormControlInput4" name="contestDesc" value={amount} placeholder={t("amount")} autoComplete="off" onChange={handleAmountChange} />
                    </div>
                    <div className="btn__container">
                        <button className="btn__container__item" onClick={() => navigate(-1)}>{t("back")}</button>
                        <button className="btn__container__item" onClick={() => handleSubmit()} disabled={isInvalid}>{t("add__balance")}</button>
                    </div>
                </div>
                }
            </div>
      	</MainLayout>
  );
}

const mapStateToProps = state => ({
    token: state.user.token
})

const mapDispatchToProps = dispatch => ({
    setPageType: (pageType) => dispatch(setPageType(pageType)),
    setUserWallet: (wallet) => dispatch(setUserWallet(wallet))
})
 

export default connect(mapStateToProps, mapDispatchToProps)(AddBalance);
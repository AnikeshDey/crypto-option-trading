import * as React from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { connect } from "react-redux";


import { setPageType } from '../../redux/page/page.actions';
import { setUserWallet } from '../../redux/user/user.actions';

import MainLayout from '../../layouts/main-layout.component';
import Loader from "../../components/loader/Loader";
// import User from "../../components/user/user.component";



function TransferBalance({ token, wallet, setPageType, setUserWallet }) {
    const [isFetching, setIsFetching] = React.useState(true);
    const [isInvalid, setIsInvalid] = React.useState(true);
    const [isSelfInvalid, setIsSelfInvalid] = React.useState(true);
    const [selfAmount, setSelfAmount] = React.useState(0);
    const [amount, setAmount] = React.useState(0);
    const [transferTo, setTransferTo] = React.useState("");
    const [withdrawFrom, setWithdrawFrom] = React.useState(null);
    const [foundUser, setFoundUser] = React.useState(null);
    const [selectedUsers, setSelectedUsers] = React.useState([]);
    const [notFound, setNotFound] = React.useState(false);
    const [tab, setTab] = React.useState("friends");


    const navigate = useNavigate();


    const { t } = useTranslation(["common"]);

    React.useLayoutEffect(() => {
        setPageType('quiz');
    },[]);

    React.useEffect(() => {
        setWithdrawFrom(`cb`);
        setIsFetching(false);        
    },[]);


    const handleTabChange = (e) => {
        var selectedTab = e.target.dataset.tab;
        // alert(selectedTab);
        setTab(selectedTab);
    }

    const handleAmountChange = (e) => {
        var value = e.target.value;
        setAmount(value);
    }

    const handleSelfAmountChange = (e) => {
        var value = e.target.value;
        setSelfAmount(value);
    }

    // const handleWalletChange = (e) => {
    //     var foundIndex = dataArray.findIndex(el => el.wallet == e.target.value);
    //     if(foundIndex >= 0){
    //         setWalletType(dataArray[foundIndex].balanceType);
    //     }
    // }

    const handleWithdrawFromChange = (e) => {
        var value = e.target.value;
        setWithdrawFrom(value);
    }
    const handleTransferToChange = (e) => {
        var value = e.target.value;
        setTransferTo(value);
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
        
        postData(`${process.env.REACT_APP_URL_LINK}/api/users/transfer-balance`, { amount:amount, transferTo:selectedUsers })
            .then(data => {
                
                console.log(data);
                setUserWallet(data.wallet);
                navigate("/my-wallet");
                // JSON data parsed by `data.json()` call
            })
    }

    const handleSelfSubmit = () => {
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
        
        postData(`${process.env.REACT_APP_URL_LINK}/api/users/transfer-self`, { amount:selfAmount })
            .then(data => {
                
                console.log(data);
                setUserWallet(data.wallet);
                navigate("/my-wallet");
                // JSON data parsed by `data.json()` call
            })
    }

    const handleSearch = () => {
        setFoundUser(null);
        // setSelectedUser([])
        // setNotFound(false);
        if(transferTo.trim() != ""){
            // Example POST method implementation:
            async function postData(url = '', data = {}) {
                // Default options are marked with *
                const response = await fetch(url, {
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                } // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                // body data type must match "Content-Type" header
                });
                return response.json(); // parses JSON response into native JavaScript objects
            }
            
            postData(`${process.env.REACT_APP_URL_LINK}/api/users/user-search/${transferTo}`)
                .then(data => {
                    
                    console.log(data);
                    if(data.length > 0){
                        setNotFound(false);
                        setFoundUser(data[0]);
                    } else{
                        setNotFound(true);
                    }
                    // setUserWallet(data.wallet);
                    // navigate("/my-wallet");
                    // JSON data parsed by `data.json()` call
                })
            }
    }


    React.useEffect(() => {
        var total = 0;
        selectedUsers.forEach(el => total += Number(amount));

        if(Number(amount) != 0 && Number(wallet[withdrawFrom]) >= Number(total) && selectedUsers.length > 0){
            setIsInvalid(false);
        } else{
            setIsInvalid(true);
        }
    },[withdrawFrom, amount, transferTo, selectedUsers]);

    React.useEffect(() => {
        if(Number(selfAmount) != 0 && Number(wallet["wb"]) != 0 && Number(wallet["wb"]) >= Number(selfAmount)){
            setIsSelfInvalid(false);
        } else {
            setIsSelfInvalid(true);
        }
    },[selfAmount]);

    React.useEffect(() => {
        if(foundUser){
            if(transferTo != foundUser.username){
                setFoundUser(null);
            }
        }
    }, [transferTo, foundUser]);

    const handleSelectUser = () => {
        var foundIndex = selectedUsers.findIndex((el) => el._id == foundUser._id);
        if(foundIndex < 0 && selectedUsers.length < 10){
            // setSelectedUsers(prev => {return [...prev, {_id:foundUser._id, username:foundUser.username}]});
            var selected = selectedUsers;
            var newSelected = [...selected, {_id:foundUser._id, username:foundUser.username}]
            // console.log(newSelected);
            setSelectedUsers(newSelected);
        }
        setFoundUser(null);
        setNotFound(false);
        setTransferTo("");
        var item = document.getElementById("exampleInputPassword1");
        item.focus();
    }

    const handleCancel = (id) => {
        // console.log(id)
        var foundIndex = selectedUsers.findIndex((el) => el._id == id);
        if(foundIndex >= 0){
            // console.log(foundIndex);
            
            var copy = [...selectedUsers];
            // console.log(copy);
            copy.splice(foundIndex, 1);
            // console.log(copy);
            
            setSelectedUsers(copy);
        }
    }


  return (
      	<MainLayout goBack={true} title={
            <div className="title">
                <h2>{t("transfer__balance")}</h2>
            </div>
        }>
            <div className="resultsContainer">
                <div className="tabsContainer">
                    <button onClick={handleTabChange} className={`tab ${tab === 'friends' ? 'active' : ''}`} data-tab={"friends"}><span>{t("friends")}</span></button>
                    <button onClick={handleTabChange} className={`tab ${tab === 'self' ? 'active' : ''}`} data-tab={"self"}><span>{t("self")}</span></button>
                </div>

                {
                    isFetching && <Loader /> 
                }

                {
                    !isFetching && tab == "friends" && wallet && <div id='contestForm'>
                    
                    
                        <div className="form-group">
                            <label htmlFor="exampleFormControlSelect2">{t("transfer__from")}:</label>
                            <select className="form-control" id="exampleFormControlSelect2" onChange={handleWithdrawFromChange} disabled={true}>
                                <option value={"cb"}>{`${t("deposite__balance")} ${wallet["cb"]}`}</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">{t("transfer__to")}: ({t("max_10_users")})</label>
                            {selectedUsers.length > 0 && <span className="users__selection__container">
                                    {selectedUsers.map(el => (
                                        <span className="users__selection__item" key={el.username} onClick={() => handleCancel(el._id)}>{el.username} <i className="fa fa-xmark" /></span>
                                    ))}
                            </span>}
                            <div className="transfer__search__input__container">
                                <input type="username" className={`form-control transfer__search__input ${notFound == true ? "red-border" : ""}`} id="exampleInputPassword1" placeholder={t("username")} value={transferTo} onChange={handleTransferToChange} />
                                <button className={`transfer__search__btn`} onClick={handleSearch}>
                                    {t("search")}
                                </button>
                            </div>
                            {notFound == true && <small id="emailHelp" className="form-text text-danger">{t("no__user__found")}.</small>}

                            {/* <p>{selectedUser?.username}</p>
                            <p>{transferTo}</p> */}
                            {/*
                                foundUser && <div className="transfer__user" onClick={handleSelectUser}><User 
                                    userData={foundUser}
                                    showFollowButton={false}
                                    anotherClass={"disabled-events"}
                                /></div>
                        */}
                        </div>
                        


                        <div className="form-group">
                            <label htmlFor="exampleFormControlInput4">{t("amount")}</label>
                            <input type="number" className="form-control" id="exampleFormControlInput4" name="contestDesc" value={amount} placeholder={t("amount")} autoComplete="off" onChange={handleAmountChange} />
                        </div>
                        



                        <div className="btn__container">
                            <button className="btn__container__item" onClick={() => navigate(-1)}>{t("back")}</button>
                            <button className="btn__container__item" onClick={() => handleSubmit()} disabled={isInvalid}>{t("transfer__balance")}</button>
                        </div>
                </div>
                }

                {
                    !isFetching && tab == "self" && wallet && <div id='contestForm'> 
                        <div className="form-group">
                            <label htmlFor="exampleFormControlSelect2">{t("transfer__from")}:</label>
                            <select className="form-control" id="exampleFormControlSelect2" onChange={handleWithdrawFromChange} disabled={true}>
                                <option value={"wb"}>{`${t("winning__balance")} ${wallet["wb"]}`}</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="exampleFormControlSelect3">{t("transfer__to")}:</label>
                            <select className="form-control" id="exampleFormControlSelect3" onChange={handleWithdrawFromChange} disabled={true}>
                                <option value={"cb"}>{`${t("deposite__balance")} ${wallet["cb"]}`}</option>
                            </select>
                        </div>


                        <div className="form-group">
                            <label htmlFor="exampleFormControlInput4">{t("amount")}</label>
                            <input type="number" className="form-control" id="exampleFormControlInput4" name="contestDesc" value={selfAmount} placeholder={t("amount")} autoComplete="off" onChange={handleSelfAmountChange} />
                        </div>

                        <div className="btn__container">
                            <button className="btn__container__item" onClick={() => navigate(-1)}>{t("back")}</button>
                            <button className="btn__container__item" onClick={() => handleSelfSubmit()} disabled={isSelfInvalid}>{t("transfer__balance")}</button>
                        </div>
                    </div>
                }
            </div>
      	</MainLayout>
  );
}

const mapStateToProps = state => ({
    token: state.user.token,
    wallet: state.user.wallet
})

const mapDispatchToProps = dispatch => ({
    setPageType: (pageType) => dispatch(setPageType(pageType)),
    setUserWallet: (wallet) => dispatch(setUserWallet(wallet))
})
 

export default connect(mapStateToProps, mapDispatchToProps)(TransferBalance);
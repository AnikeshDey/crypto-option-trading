import React from 'react'
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import Loader from '../../components/loader/Loader';
import MainLayout from '../../layouts/main-layout.component';
import { setPageType } from "../../redux/page/page.actions";

const SingleTransaction = ({ token }) => {

    const [isFetching, setIsFetching] = React.useState(true)
    const [transactionData, setTransactionData] = React.useState(null);


    const { t } = useTranslation(["common"]);

    React.useLayoutEffect(() => {
        setPageType("quiz");
    }, []);

    var id = useParams().id;
    var type = useParams().type;

    React.useEffect(() => {
        if(id && type){
            var url = `${process.env.REACT_APP_URL_LINK}/api/users/single-gaming-transaction/${id}?type=${type}`;
            // Example POST method implementation:
            ////console.log(url)
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
                setTransactionData(data);
                setIsFetching(false);
                
            }).catch(err => {
                //console.log(err)
            });
        }
        
    }, [id, type]);


  return (
    <MainLayout goBack={true} title={
        <div className="title">
            <h2>{t("transaction__details")}</h2>
        </div>
    }>
        {
            isFetching && <Loader />
        }
        {!isFetching && <div className='resultsContainer'>
            <div className='details__overdetails'>
                <p className='details__para__amount'>{t("amount")}</p>
                <div className='details__amount'>{transactionData.amount}  {transactionData.from == "cb" ? t("deposite__balance") : (transactionData.from == "wb" ? t("winning__balance") : transactionData.from)}</div>
                <div className='detail__complete'><i className="fa-solid fa-circle-check" id="ticks"></i>{transactionData.status}</div>
                <p className='details__para'>{t("crypto__para")}</p>
            </div>
            <div className='detailed__info'>
                {Object?.entries(transactionData)?.map(([keys,value],idx)=>(
                    keys === 'from'? 
                        <div className='infos' key={idx}>
                            <span>{t("transfered__from")}</span>
                            <span>{value == "cb" ? t("deposite__balance") : (value == "wb" ? t("winning__balance") : value)}</span>
                        </div>
                    :
                    keys === 'to'? 
                        <div className='infos' key={idx}>
                            <span>{t("transfered__to")}</span>
                            <span>{value == "cb" ? t("deposite__balance") : (value == "wb" ? t("winning__balance") : value)}</span>
                        </div>
                    :
                    keys === 'id'? 
                        <div className='infos' key={idx}>
                            <span>{t("transfer__id")}</span>
                            <span>{value}</span>
                        </div>
                    :
                    keys === 'cT'? 
                        <div className='infos' key={idx}>
                            <span>{t("date")}</span>
                            <span>{new Date(value).toDateString()}</span>
                        </div>
                    :
                    null
                ))}
            </div>
        </div>}
    </MainLayout>
  )
}

const mapStateToProps = state => ({
    token: state.user.token
})

const mapDispatchToProps = dispatch => ({
    setPageType: (pageType) => dispatch(setPageType(pageType))
})

export default connect(mapStateToProps, mapDispatchToProps)(SingleTransaction);
import * as React from "react";
import { useTranslation } from 'react-i18next';
import { connect } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";


import { setPageType } from '../../redux/page/page.actions';

import MainLayout from '../../layouts/main-layout.component';
import Loader from "../../components/loader/Loader";


const Transaction = ({ type, id, name, cT, status, amount }) => {
    const { t } = useTranslation(["common"]);

    return <Link to={`/single-transaction/${id}/${type}`} className="transaction__container">
        <div className="transaction__item left">
            <h1 className="transaction__name">
                {name == "cb" ? t("deposite__balance") : (name == "wb" ? t("winning__balance") : name)}
            </h1>
            <p className="transaction__time">
                {new Date(cT).toDateString()}
            </p>
        </div>
        <div className="transaction__item right">
            <h1 className="transaction__amount">
                {amount}
            </h1>
            <p className="transaction__status">
                {status}
            </p> 
        </div>
    </Link>
}


function MyTransaction({ token, setPageType }) {
    const [isFetching, setIsFetching] = React.useState(true);
    const [transactionData, setTransactionData] = React.useState([]);
    const [tab, setTab] = React.useState("deposite");
    const [page, setPage] = React.useState(1)


    const navigate = useNavigate();

    var type = useParams().type;

    React.useLayoutEffect(() => {
        if(type == "deposite" || type == "withdraw" || type == "transfer"){
            setTab(type);
        } else{
            setTab("deposite");
        }
        
    },[type]);

    const { t } = useTranslation(["common"]);

    React.useLayoutEffect(() => {
        setPageType('quiz');
    },[]);

    const handleTabChange = (e) => {
        var selectedTab = e.target.dataset.tab;
        // alert(selectedTab);
        navigate("/my-transaction/"+selectedTab);
    }

    React.useEffect(() => {
        var url = `${process.env.REACT_APP_URL_LINK}/api/users/my-gaming-transactions?tab=${tab}&page=${page}`;
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
            // console.log(data);
            setTransactionData(prev => {
                return [...prev,...data];
            });
            setIsFetching(false);
            
        }).catch(err => {
            //console.log(err)
        });
    },[tab, page]);

    const handleScroll = (e) => {
        // //console.log("top:",e.target.documentElement.scrollTop);
        // //console.log("window:", window.innerHeight);
        // //console.log("height:",e.target.documentElement.scrollHeight);

        if((e.target.documentElement.scrollTop + window.innerHeight + 1) >= e.target.documentElement.scrollHeight){
            setPage(page + 1);
        }

    }

    React.useEffect(() => {
        setPage(1);
        setTransactionData([]);
    },[tab]);

    React.useEffect(() => {
        window.addEventListener("scroll", handleScroll)

        return () => window.removeEventListener("scroll", handleScroll);
    },[]);

  return (
      	<MainLayout goBack={true} title={
            <div className="title">
                <h2>{t("transaction__history")}</h2>
            </div>
        }>
            <div className="tabsContainer">
                <button onClick={handleTabChange} className={`tab ${tab === 'deposite' ? 'active' : ''}`} data-tab={"deposite"}><span>{t("deposite")}</span></button>
                <button onClick={handleTabChange} className={`tab ${tab === 'withdraw' ? 'active' : ''}`} data-tab={"withdraw"}><span>{t("withdraw")}</span></button>
                <button onClick={handleTabChange} className={`tab ${tab === 'transfer' ? 'active' : ''}`} data-tab={"transfer"}><span>{t("transfer")}</span></button>
            </div>
            <div className="resultsContainer">
                {
                    isFetching && <Loader />
                }

                {
                    !isFetching && transactionData.map(el => (
                        <Transaction 
                            key={el.id}
                            type={tab}
                            id={el.id}
                            name={el.from}
                            cT={el.cT}
                            status={el.status}
                            amount={el.amount}
                        />
                    ))
                }

                {
                    !isFetching && transactionData.length == 0 && <h1>No Transactions Yet.</h1>
                }
            </div>
      	</MainLayout>
  );
}

const mapStateToProps = state => ({
    token: state.user.token
})

const mapDispatchToProps = dispatch => ({
    setPageType: (pageType) => dispatch(setPageType(pageType))
})
 

export default connect(mapStateToProps, mapDispatchToProps)(MyTransaction);
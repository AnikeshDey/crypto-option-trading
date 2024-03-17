import React from "react";
import { useTranslation } from 'react-i18next';
import { connect } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
// import { v4 as uuidv4 } from 'uuid';

import TradingViewWidget from "react-tradingview-widget";


import getCountdown from "../../utils/getCountDown";

import { setPageType } from '../../redux/page/page.actions';

import { filterQuiz, clearSlip, changeQuizOp, setErrorMessage, setErrorValue } from '../../redux/cryptoSlip/cryptoSlip.actions';
import { userLogin, setUserWallet } from '../../redux/user/user.actions';

import MainLayout from '../../layouts/main-layout.component';

import CryptoQuizHeader from '../../components/cryptoQuizHeader/cryptoQuizHeader';
import CryptoPriceHeader from '../../components/CryptoPriceHeader/CryptoPriceHeader';
// import TradingView from '../../components/tradingView/TradingView';
// import CryptoSlip from '../../components/cryptoSlip/cryptoSlip';

import { addQuiz } from "../../utils/addCryptoQuiz";

import "./individualCryptoQuiz.css"

const IndividualCryptoQuiz = ({user, token, wallet, setPageType, quizzes, games, errorMessage, errorValue, useBonus, setErrorMessage, setErrorValue, filterQuiz, changeQuizOp, clearSlip, setUserWallet}) => {

    const [contestData, setContestData] = React.useState(null);
    const [priceData, setPriceData] = React.useState(null);
    const [upData, setUpData] = React.useState(null);
    const [downData, setDownData] = React.useState(null);
    const [eventDate, setEventDate] = React.useState(null);
    const [notFound, setNotFound] = React.useState(false);
    const [tab, setTab] = React.useState('market__up');
    const [isLoading, setLoading] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [isSubmitLoading, setSubmitLoading] = React.useState(false);
    const [entryFee, setEntryFee] = React.useState(null);
    const [game, setGame] = React.useState(null);
    const [canJoin, setCanJoin] = React.useState(false);
    const [showTradingView, setShowTradingView] = React.useState(false);

    const { t } = useTranslation(["common"]);
    const navigate = useNavigate();

    React.useEffect(() => {
        console.log("quizzes:",quizzes)
    }, [quizzes]);


    

    var id = useParams().id;

    React.useLayoutEffect(() => {
        setPageType('crypto');
    },[]);


    React.useEffect(() => {
        
        if(contestData){
            if(contestData.endTime > new Date().getTime()){
                
                var countDown = getCountdown(contestData.endTime);
                setEventDate(countDown);
            } else {
                setEventDate(null);
            }
    
    
            var myInterval = setInterval(() => {
                if(contestData.endTime > new Date().getTime()){
                    var countDown = getCountdown(contestData.endTime);
                    setEventDate(countDown);
                } else {
                    setEventDate(null);
                }
            }, 1000)
        }

        return () => {
            clearInterval(myInterval);
        }
    
    },[contestData]);




    React.useEffect(() => {
        if(user && id){
            var url = `${process.env.REACT_APP_URL_LINK}/api/contests/single/${id}`;
            
                async function getData(url = '') {
                    // Default options are marked with *
                    const response = await fetch(url, {
                    method: 'GET', // *GET, POST, PUT, DELETE, etc.
                    mode: 'cors', // no-cors, *cors, same-origin
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    }
                    // body data type must match "Content-Type" header
                        });
                        return response.json(); // parses JSON response into native JavaScript objects
                }
                setLoading(true);
                getData(url)
                .then(data => {
                    console.log("data:", data);

                    if(data.message){
                        setNotFound(true);
                    } else{
                        setNotFound(false);
                        setContestData(data.contestData);
                        setEntryFee(data.contestData.entryFee);
                        //setPriceData(data.priceData);

                    }
                    
                    setLoading(false);
                }).catch(err => {
                    //console.log(err)
                });
        }
    },[user, token, id])

    React.useEffect(() => {
        if(contestData){
            var foundGame = games.find(el => el.id == contestData.gameId);
            if(foundGame){
                setPriceData(foundGame);
                setGame(foundGame);
            }
        }
        
    },[games, contestData]);

    React.useEffect(() => {
        if(priceData){
            var upArray = [];
            var downArray = [];
            for(var i=1; i < 21; i++){
                var percentageAmount = ((priceData.pR * i) / 100);
                var value = parseFloat(priceData.pR + percentageAmount).toFixed(8);
                var count = decimalCount(value);
                var plus = count > 8 ? parseFloat(value).toFixed(8) : parseFloat(value);
                // console.log(plus);
                upArray.push({
                    id:`${contestData._id}+plus+${i}`,
                    amount:plus
                });
                var minusValue = parseFloat(priceData.pR - percentageAmount).toFixed(8);
                var minusCount = decimalCount(minusValue);
                var minus = minusCount > 8 ? parseFloat(minusValue).toFixed(8) : parseFloat(minusValue);
                downArray.push({
                    id:`${contestData._id}+minus+${i}`,
                    amount:minus
                });
            }

            setUpData(upArray);
            setDownData(downArray);
        }
                
    }, [priceData])

    React.useEffect(() => {
        if(contestData){
            if(new Date().getTime() > contestData.endTime){
                filterQuiz(contestData._id);
            }
        }
                
    }, [contestData, eventDate])


    React.useEffect(() => {
        if(eventDate){
            if(contestData.endTime > new Date().getTime()){
                var distance = new Date().getTime() - contestData.endTime;

                var per = new Date(distance).getMinutes();
                console.log(`${per}%`);
                var fee = contestData.entryFee;
                var newFee = parseFloat(((fee * per) / 100) + fee).toFixed(2);
                setEntryFee(newFee);
            }
        }
    }, [eventDate]);

    React.useEffect(() => {
        if(entryFee && wallet){
            if(wallet.cb > entryFee){
                setCanJoin(true);
            } else {
                setCanJoin(false);
            }
        }
    }, [entryFee, wallet]);


    const handleTabChange = (e) =>{
        var selectedTab = e.target.dataset.tab;
        //console.log(selectedTab);
        setTab(selectedTab);
    }

    const handleOpChange = (e, id) =>{
        var selectedOp = Number(e.target.value);
        //console.log(selectedTab);
        changeQuizOp(id, selectedOp);
    }

    const handleIncr = (id, value) => {
        var stringValue = value.toString();
        //var selectedOp = 0;
        if(stringValue.includes(".")){
            var incrValue = (parseInt(stringValue.split(".")[1]) + 1);
            // console.log(incrValue);
            var selectedOp = parseFloat(`${stringValue.split(".")[0]}.${incrValue}`);
            // console.log(selectedOp);
            changeQuizOp(id, selectedOp);
        } else{
            var selectedOp = parseFloat(stringValue) - 1;
            changeQuizOp(id, selectedOp);
        }
        // console.log(selectedOp)
        // changeQuizOp(id, selectedOp);
    }

    
    const handleDcr = (id, value) => {
        var stringValue = value.toString();
        //var selectedOp = 0;
        if(value > 0){
            if(stringValue.includes(".")){
                var incrValue = (parseInt(stringValue.split(".")[1]) - 1);
                // console.log(incrValue);
                var selectedOp = parseFloat(`${stringValue.split(".")[0]}.${incrValue}`);
                // console.log(selectedOp);
                changeQuizOp(id, selectedOp);
            } else{
                var selectedOp = parseFloat(stringValue) - 1;
                changeQuizOp(id, selectedOp);
            }
        }
        // console.log(selectedOp)
        // changeQuizOp(id, selectedOp);
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

        if(!isSubmitLoading){
            setSubmitLoading(true);
            postData(`${process.env.REACT_APP_URL_LINK}/api/quiz/submit-quiz`, { 
                slip:quizzes.find(b => (b.contestId == contestData._id)),
                entryFee
            }).then(data => {
                setSubmitLoading(false);
                console.log(data);
                setErrorMessage(null)
                setErrorValue(null)
                setIsSuccess(false);
                if(data.message){
                    //setIsSuccess(false);
                    setErrorMessage(data.message);
                    if(data.value >= 0){
                        setErrorValue(data.value);
                    }
                    alert(`${t(data.message)} ${data.value ? data.value : ""}`);
                } else{
                    //PROCEED
                    //login(data.user, data.token);
                    setUserWallet(data.wallet);
                    clearSlip(contestData._id);
                    navigate(`/my-quiz/${contestData._id}`);
                    // setIsSuccess(true);
                }
            }).catch(err => {
                //console.log(err)
            })
        }
    }

    const decimalCount = num => {
        // Convert to String
        const numStr = String(num);
        // String Contains Decimal
        if (numStr.includes('.')) {
           return numStr.split('.')[1].length;
        };
        // String Does Not Contain Decimal
        return 0;
    }

    

    return <MainLayout goBack={true} title={
        <div className="title">
            <h2>{contestData ? contestData.contestName : "Quiz Page"}</h2>
        </div>
      }> 
        {
            notFound && !isLoading && <h1>Not Found</h1>
        }

        {
            !eventDate && contestData && <h3>This contest has already expired.</h3>
        }

        {
            !notFound && !isLoading && eventDate  && <>



                {game && <>
                    <CryptoPriceHeader 
                        id={game.id}
                        title={`${game.nM}${game.tG}`}
                        fullName={game.fnM}
                        price={game.pR}
                        per={game.pRcP}
                        price_change={game.pRc}
                        showChart={showTradingView}
                        handleChart={() => setShowTradingView(prev => !prev)}
                    />
                {showTradingView && <TradingViewWidget colorTheme="dark" width="100%" symbol={`${game.nM.toUpperCase()}${game.tG.toUpperCase()}`}
                    ></TradingViewWidget>}
                    
                    </>
                    
                }
                
                <CryptoQuizHeader 
                    eventType={`${contestData.gameName.toUpperCase()}/${priceData?.tG}`}
                    countDown={eventDate}
                    price={priceData?.pR}
                    change={priceData?.vol}
                    contest={contestData}
                />

                {/* <div className="tabsContainer">
                    <button onClick={handleTabChange} className={`tab ${tab === 'market__up' ? 'active' : ''}`} data-tab={"market__up"}><span>{t("market__up")} &nbsp; {quizzes.findIndex(b => (b.contestId == contestData._id && b.type == "market__up")) >= 0 && <i className="fa fa-circle-check" />}</span></button>
                    <button onClick={handleTabChange} className={`tab ${tab === 'market__down' ? 'active' : ''}`} data-tab={"market__down"}><span>{t("market__down")} &nbsp; {quizzes.findIndex(b => (b.contestId == contestData._id && b.type == "market__down")) >= 0 && <i className="fa fa-circle-check" />}</span></button>
                </div> */}

                {
                    <div className="crypto__quiz__container">
                        <div className="crypto__quiz__wrapper">
                            <div className="crypto__quiz__item title">
                                {t("market__up")}
                            </div>
                            
                            {
                                upData?.map((el,ix) => (
                                    <div key={ix} className={`crypto__quiz__item up ${quizzes.findIndex(b => (b.contestId == contestData._id && b.id == el.id)) >= 0 ? "selected" : ""}`} onClick={() => quizzes.findIndex(b => (b.contestId == contestData._id && b.id == el.id)) < 0 && addQuiz({
                                        id:el.id,
                                        contestId:contestData._id,
                                        gameId:contestData.gameId,
                                        gameName:contestData.gameName,
                                        currency:"USDT",
                                        selectedOp:el.amount,
                                        type:"market__up",
                                        custom:false
                                    }, quizzes)}>
                                        <span>{el.amount} &nbsp; <i className={"fa fa-arrow-up"} /></span>
                                        {quizzes.findIndex(b => (b.contestId == contestData._id && b.id == el.id)) >= 0 && 
                                    <div className="crypto__slip__container">
                                        <div className="crypto__quiz__form__container">
                                            <div className="crypto__quiz__input__container">
                                                <button className="btn btn-sm btn-warning" onClick={() => handleDcr(el.id, quizzes.find(b => (b.contestId == contestData._id && b.id == el.id)).selectedOp)}>-</button>
                                                <input type="number" className="crypto__quiz__input" value={quizzes.find(b => (b.contestId == contestData._id && b.id == el.id)).selectedOp} onChange={(e) => handleOpChange(e, el.id)} />
                                                <button className="btn btn-sm btn-warning" onClick={() => handleIncr(el.id, quizzes.find(b => (b.contestId == contestData._id && b.id == el.id)).selectedOp)}>+</button>
                                            </div>
                                            <div className="crypto__quiz__btn__container">
                                                <button className="btn btn-sm btn-danger cancel" onClick={() => clearSlip(contestData._id)}>Cancel</button>
                                                <button className="btn btn-sm btn-warning" disabled={!canJoin || isSubmitLoading ? true : false} onClick={() => handleSubmit()}>{!isSubmitLoading ? "Place Bet" : "Submitting.."}</button>
                                            </div>
                                            
                                        </div>
                                        <div className="crypto__quiz__form__footer">
                                            <p>{entryFee} will be deducted from your balance of {wallet.cb ? wallet.cb : "0.00"}</p>
                                        </div>
                                    </div>
                                }
                                    </div>
                                    
                                
                                ))
                            }
                        </div>



                        <div className="crypto__quiz__wrapper">
                            <div className="crypto__quiz__item title">
                                {t("market__down")}
                            </div>
                            {
                                downData?.map((el,ix) => (
                                    <div key={ix} className={`crypto__quiz__item down ${quizzes.findIndex(b => (b.contestId == contestData._id && b.id == el.id)) >= 0 ? "selected" : ""}`} onClick={() => quizzes.findIndex(b => (b.contestId == contestData._id && b.id == el.id)) < 0 && addQuiz({
                                        id:el.id,
                                        contestId:contestData._id,
                                        gameId:contestData.gameId,
                                        gameName:contestData.gameName,
                                        currency:"USDT",
                                        selectedOp:el.amount,
                                        type:"market__down",
                                        custom:false
                                    }, quizzes)}>
                                        <span>{el.amount} &nbsp; <i className={"fa fa-arrow-down"} /></span>
                                        {quizzes.findIndex(b => (b.contestId == contestData._id && b.id == el.id)) >= 0 && 
                                    <div className="crypto__slip__container">
                                        <div className="crypto__quiz__form__container">
                                            <div className="crypto__quiz__input__container">
                                                <button className="btn btn-sm btn-warning" onClick={() => handleDcr(el.id, quizzes.find(b => (b.contestId == contestData._id && b.id == el.id)).selectedOp)}>-</button>
                                                <input type="number" className="crypto__quiz__input" value={quizzes.find(b => (b.contestId == contestData._id && b.id == el.id)).selectedOp} onChange={(e) => handleOpChange(e, el.id)} />
                                                <button className="btn btn-sm btn-warning" onClick={() => handleIncr(el.id, quizzes.find(b => (b.contestId == contestData._id && b.id == el.id)).selectedOp)}>+</button>
                                            </div>
                                            <div className="crypto__quiz__btn__container">
                                                <button className="btn btn-sm btn-danger cancel" onClick={() => clearSlip(contestData._id)}>Cancel</button>
                                                <button className="btn btn-sm btn-warning" disabled={!canJoin || isSubmitLoading ? true : false} onClick={() => handleSubmit()}>{!isSubmitLoading ? "Place Bet" : "Submitting.."}</button>
                                            </div>
                                            
                                        </div>
                                        <div className="crypto__quiz__form__footer">
                                            <p>{entryFee} will be deducted from your balance of {wallet.cb ? wallet.cb : "0.00"}</p>
                                        </div>
                                    </div>
                                    }
                                    </div>
                                    
                                    
                                ))
                            }
                        </div>
                    </div>
                }
            </>
        }
        
    </MainLayout>   
}


const mapStateToProps = state => ({
    user: state.user.user,
    token: state.user.token,
    wallet: state.user.wallet,
    quizzes: state.cryptoSlip.quizzes,
    useBonus: state.cryptoSlip.useBonus,
    games: state.cryptoGame.games
})

const mapDispatchToProps = dispatch => ({
    setPageType: (pageType) => dispatch(setPageType(pageType)),
    filterQuiz: (id) => dispatch(filterQuiz(id)),
    changeQuizOp: (id, value) => dispatch(changeQuizOp(id, value)),
    setErrorMessage:(value) => dispatch(setErrorMessage(value)),
    setErrorValue:(value) => dispatch(setErrorValue(value)),
    setUserWallet: (wallet) => dispatch(setUserWallet(wallet)),
    clearSlip: (id) => dispatch(clearSlip(id))
})


export default connect(mapStateToProps, mapDispatchToProps)(IndividualCryptoQuiz);
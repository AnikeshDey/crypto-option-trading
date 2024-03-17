import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FaTrashAlt } from "react-icons/fa";


import { clearSlip, setErrorMessage, setErrorValue, setUseBonus } from '../../redux/contestSlip/contestslip.actions';
import { userLogin, setUserWallet } from '../../redux/user/user.actions';
//import { selectBets, selectBetType, selectUpdateBet, selectTotalStake, selectSingleTotalReturn, selectMultiTotalReturn, selectSystemTotalReturn, selectErrorMessage, selectUseBonus, selectErrorValue } from '../../redux/betslip/betslip.selectors';

//import Bet from '../bet/bet.component';
import SingleQuiz from '../singleQuiz/SingleQuiz';


import '../betslip/BetSlip.css';

//bets, updateBet, betType, totalStake, singleTotalReturn, multiTotalReturn, systemTotalReturn,

const CryptoSlip = (props) =>  { 
    const { t } = useTranslation(["common"]);

    const {
        contest,
        quizzes,
        totalCost,
        user,
        errorMessage,
        errorValue,
        useBonus,
        token,
        setErrorMessage,
        setErrorValue,
        setUseBonus,
        clearSlip,
        login,
        setUserWallet,
        wallet
    } = props;


    const [collapsed, setCollapsed] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [invalid, setInvalid] = useState(false);
    const [formattedData, setFormattedData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [betsLength] = useState(quizzes.length);
    const [isSuccess, setIsSuccess] = useState(false);
    const [contestQuiz, setContestQuiz] = React.useState([])
    const [totalOdds, setTotalOdds] = React.useState(0);

    React.useLayoutEffect(() => {
        var avlQuiz = []
        for(var i=0; i < quizzes.length; i++){
            if(quizzes[i].contestId == contest._id){
                ////console.log("quizes[i].contestId", quizes[i].contestId);
                ////console.log("contest_id", contest._id)
                avlQuiz.push(quizzes[i]);
            }
        }
        setContestQuiz(avlQuiz);
    },[quizzes]);

    
    

    // const handleStakeTypeChange = (e) => {
    //     if(e.target.dataset.type == 'multi' && bets.length > 8){
    //         return;
    //     } else if(e.target.dataset.type == 'system' && bets.length != 3){ 
    //         return;
    //     }
    //     setErrorMessage(null);
    //     setErrorValue(null);
    //     setBetType(e.target.dataset.type) 
    //     calculateTotalReturn();
    // }

    const handleModal = () => {
        clearSlip(contest._id);
        setIsSuccess(false);
    }

    const handleOpen = () => {
        setCollapsed(!collapsed);
        //setIsOpen(!isOpen);
    }

    const handleUpdateBonus = (e) => {
        if(e.target.checked){
            setUseBonus(true);
        } else{
            setUseBonus(false);
        }
    }


    const handleSubmit = () => {
        if(contestQuiz.length == 11){
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

                if(!isLoading){
                    setIsLoading(true);
                    postData(`${process.env.REACT_APP_URL_LINK}/api/betting/submit-quiz`, { 
                        quizes:contestQuiz,
                        useBonus
                    }).then(data => {
                        setIsLoading(false);
                        //console.log(data);
                        setErrorMessage(null)
                        setErrorValue(null)
                        setIsSuccess(false);
                        if(data.message){
                            //setIsSuccess(false);
                            setErrorMessage(data.message);
                            if(data.value >= 0){
                                setErrorValue(data.value);
                            }
                        } else{
                            //PROCEED
                            //login(data.user, data.token);
                            setUserWallet(data.wallet);
                            setIsSuccess(true);
                        }
                    }).catch(err => {
                        //console.log(err)
                    })
            }
        } else{
            setErrorValue(null);
            setErrorMessage("quiz__minimumSelectionErr")
        }
        
    ////console.log("submit")
    
    }

    // React.useEffect(() => {
    //     if(quizzes.length > 1){
    //         if(isOpen == false){
    //             setCollapsed(true);
    //         } else{
    //             setCollapsed(false);
    //         }
            
    //     } else {
    //         if(isOpen == false){
    //             setCollapsed(false);
    //         } else{
    //             setCollapsed(true);
    //         }
    //     }
    // },[quizes, isOpen]);

    // React.useEffect(() => {
    //     setFormattedData({});
    //     for(var i= 0; i < quizes.length; i++){
    //         if(formattedData[quizes[i].categoryId.toString()+quizes[i].gameId.toString()+quizes[i].contestId.toString()]){
    //             setInvalid(true);
    //             setErrorMessage("betslip__multiCategoryErr");
    //             setErrorValue(null)
    //             return;
    //         } else{
    //             setInvalid(false);
    //             setErrorMessage(null);
    //             setErrorValue(null);
    //             formattedData[quizes[i].categoryId.toString()+quizes[i].gameId.toString()+quizes[i].contestId.toString()] = 1;
    //         }
    //     }
    // },[betsLength]);


    React.useEffect(() => {
        if(errorMessage == "betslip__systemSelectionErr" || errorMessage == "betslip__singleSelectionErr" || errorMessage == "betslip__parlaySelectionErr" || errorMessage == "betslip__oddsMatchErr" || errorMessage == "betslip__disabledEvent" || errorMessage == "betslip__disabledCategory" || errorMessage == "betslip__globalMaxBet" || errorMessage == "betslip__globalMinBet" || errorMessage == "betslip__globalMaxWin" || errorMessage == "betslip__globalMinWin" || errorMessage == "betslip__userMaxBet" || errorMessage == "betslip__userMinBet" || errorMessage == "betslip__userMaxWin" || errorMessage == "betslip__couldNotSubmit" || errorMessage == "betslip__exceededUserBonus" || errorMessage == "quiz__minimumSelectionErr" || errorMessage == null){
            setInvalid(false)
        } else{
            setInvalid(true);
        }
    },[errorMessage]);



    // React.useEffect(() => {
    //     if(bets.length < 3){
    //         // setErrorMessage(null);
    //         // setErrorValue(null);
    //         setBetType('single')
    //         setInvalid(false)
    //         calculateTotalReturn();
    //     }
    //     calculateTotalReturn();
    // },[bets]);
   
    // var totalOdds;

    // if(betType == 'single'){
    //     totalOdds = 0;
    //     bets.forEach(bet => {
    //         if( bet.odds != 'suspended'){
    //             totalOdds += bet.odds;
    //         }
    //         ////console.log('Hii');
    //     })
    // } else if(betType == 'multi'){
    //     totalOdds = 1;
    //     bets.forEach(bet => {
    //         if( bet.odds != 'suspended'){
    //             totalOdds *= parseFloat(bet.odds);
    //         }
    //     })
    // } else {
    //     totalOdds = 0;
    // }

    ////console.log(updatedGames)

    // var totalCountedOdds = 0;
    // contestQuiz.forEach(bet => {
    //     if( bet.odds != 'suspended'){
    //         totalCountedOdds += parseFloat(bet.odds);
    //     }
    //     ////console.log('Hii');
    // })


    return <div className='betslip__container'>
        {isSuccess && <div className='betslip__success__container'>
            <div className='betslip__success__text'>
                <h1 className='betslip__success__title'>{t("quiz__successfully__accepted")}</h1>
                <button className='betslip__success__btn' onClick={handleModal}>
                    {t("ok")}
                </button>
            </div>
        </div>}

        <div className='betslip__badge' onClick={handleOpen}>
            <span>{t("quiz__slip")} ({contestQuiz.length})</span>
            
            {collapsed ? <span><i className="fa fa-chevron-up" /></span> : <span><i className="fa fa-chevron-down" /></span>}
        </div>
            
            {collapsed == false && errorMessage && <p className='betslip__errorMessage'>{t(errorMessage)} {errorValue >= 0 && errorValue}</p>}
            <div className='betslip__body__container'>
                    {
                        collapsed == false && <div className="quiz__container__header">
                            <h1 className="quiz__container__header__title">
                                {contestQuiz[0]?.teams}
                            </h1>
                        </div>
                    }

                    {
                        collapsed == false && contestQuiz.map(bet => (
                            <SingleQuiz 
                                key={bet.contestId}
                                id={bet.contestId} 
                                title={bet.gameName} 
                                odds={bet.selectedOp} 
                                category={bet.currency}
                                type={bet.type} 
                            />
                        ))
                    }

                    {
                        !collapsed && <div className='quiz__container__form_wrapper'>
                            <input className='quiz__container__form_input' />
                            <button className='quiz__container__form_btn'>Add</button>
                        </div>
                    }

                    {
                       !collapsed && <div className='quiz__container__footer'>
                            <p className='quiz__container__footer__bal'>{contest.entryFee} {t("will__deduct__from__balance")} {useBonus ? Number(wallet.bo).toFixed(2) : Number(wallet.cb).toFixed(2) }</p>
                            {/* <p className='quiz__container__footer__total'>+{totalCountedOdds.toFixed(0)}</p> */}
                        </div>
                    }
            </div>
            {!collapsed && <div className="betslip__footer">
            {isLoading && <div id="stripes" className="stripes"></div>}
             <button className="betslip__btn__quiz" onClick={handleSubmit}>
                <span className="betslip__btn__saving__text">{t("submit__quiz")}</span>
            </button>
        </div>}

            {!collapsed && <div className='betslip__badge'>
            <div className="form-check">
                {useBonus 
                ? 
                <input className="form-check-input" type="checkbox" value="" id="flexCheckuseBonus" onClick={handleUpdateBonus} defaultChecked />
                :
                <input className="form-check-input" type="checkbox" value="" id="flexCheckuseBonus" onClick={handleUpdateBonus} />
                }
                <label className="form-check-label" htmlFor="flexCheckuseBonus">
                {t("use__bonus")}
                </label>
                </div> 
            </div>}

            
                {!collapsed && <FaTrashAlt className='betslip__trash__icon' onClick={() => clearSlip(contest._id)} />}
    </div> 
}

const mapStateToProps = state => ({
    quizzes: state.cryptoslip.quizzes,
    totalCost: state.cryptoslip.totalCost,
    errorMessage: state.cryptoslip.errorMessage,
    errorValue: state.cryptoslip.errorValue,
    useBonus: state.cryptoslip.useBonus,
    user: state.user.user,
    token: state.user.token,
    wallet: state.user.wallet
});

const mapDispatchToProps = dispatch => ({
    setErrorMessage:(value) => dispatch(setErrorMessage(value)),
    setErrorValue:(value) => dispatch(setErrorValue(value)),
    setUseBonus: (value) => dispatch(setUseBonus(value)),
    clearSlip: (id) => dispatch(clearSlip(id)),
    login: (user, token) => dispatch(userLogin(user, token)),
    setUserWallet: (wallet) => dispatch(setUserWallet(wallet))
})

export default connect(mapStateToProps, mapDispatchToProps)(CryptoSlip); 


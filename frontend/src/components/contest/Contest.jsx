import React from "react";
import { useTranslation } from 'react-i18next';
import { connect } from "react-redux";
import { toast } from "react-toastify";

import getCountdown from "../../utils/getCountDown";

import { useNavigate } from "react-router-dom";

import { userLogin } from "../../redux/user/user.actions";

import Modal from "../modal/Modal";
import WinnerListContainer from "../winnerListSelection/WinnerListSelection";



import "react-toastify/dist/ReactToastify.css";
import './Contest.css';

const Contest = ({ data, myContest, admin, token, wallet, history, cannotSettle, risk }) => {
    const { t } = useTranslation(["common"]);

    const [isModalOpen, setIsModalOpen] = React.useState(false);
	const [isWalletModalOpen, setWalletModalOpen] = React.useState(false);

    const [contestData, setContestData] = React.useState(data);
    const [isValidJoin, setValidJoin] = React.useState(false);
    const [eventDate, setEventDate] = React.useState(null);
    // console.log(data);

    const navigate = useNavigate();


    React.useLayoutEffect(() => {

        if(data.endTime > new Date().getTime()){
            setValidJoin(true);
            var countDown = getCountdown(data.endTime);
            setEventDate(countDown);
        } else {
            setValidJoin(false);
            if(data.settleTime > new Date().getTime()){
                var countDown = getCountdown(data.settleTime);
                setEventDate(countDown);
            } else{
                setEventDate(null);
            }
        }


        var myInterval = setInterval(() => {
            if(data.endTime > new Date().getTime()){
                setValidJoin(true);
                var countDown = getCountdown(data.endTime);
                setEventDate(countDown);
            } else {
                setValidJoin(false);
                if(data.settleTime > new Date().getTime()){
                    var countDown = getCountdown(data.settleTime);
                    setEventDate(countDown);
                } else{
                    setEventDate(null);
                }   
            }
        }, 1000)

        return () => {
            clearInterval(myInterval);
        }
    
    },[data]);


    const handleClick = () => {
		console.log("wallet....", wallet, toast); 
        if(wallet){
			navigate(`/crypto-quiz/${contestData._id}`);
		} else {
			setWalletModalOpen(true);
		}
    }

    const handleCancelContest = () => {
        var url = `${process.env.REACT_APP_URL_LINK}/api/contests/cancel-contest/${data._id}`;
            
            async function getData(url = '') {
                // Default options are marked with *
                const response = await fetch(url, {
                method: 'PUT', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                headers: {
                    'Authorization': 'Bearer ' + token,
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                }
                // body data type must match "Content-Type" header
                    });
                    return response.json(); // parses JSON response into native JavaScript objects
            }
        
            getData(url)
            .then(data => {
                //console.log(data.data);
                setContestData(data.data);
            }).catch(err => {
                //console.log(err)
            });
    }

    const handleMyContestClick = () => {
        if(history){
            var currentMonth = new Date(contestData.createdAt).getMonth();
            var currentYear = new Date(contestData.createdAt).getFullYear();
            navigate(`/history-contest/${contestData._id}/${currentMonth}${currentYear}`);
        } else{
            navigate(`/my-quiz/${data._id}`);
        }
        
    }
    const handleAdminContestClick = () => {
        navigate(`/edit-contest/${data._id}`);
    }

    const handleAdminMyContestClick = () => {
        navigate(`/admin-my-quiz/${data._id}`);
    }

    const handleSettleContest = () => {
        if(contestData){
            var url = `${process.env.REACT_APP_URL_LINK}/api/quiz/contest-final-settlement/${contestData._id}`;
            
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
        
            getData(url)
            .then(data => {
                //console.log(data);
                if(data.message != "Successfully Added User Balance"){
                    alert(data.message);
                    if(data.data){
                        setContestData(data.data);
                    }
                } else{
                    setContestData(data.data);
                }
                //setGame(data);
            }).catch(err => {
                //console.log(err)
            });
        }
        
    }

    const handleRevertSettleContest = () => {
        if(contestData){
            var url = `${process.env.REACT_APP_URL_LINK}/api/quiz/revert-contest-final-settlement/${contestData._id}`;
            
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
        
            getData(url)
            .then(data => {
                //console.log(data);
                if(data.message != "Successfully Added User Balance"){
                    alert(data.message);
                    if(data.data){
                        setContestData(data.data);
                    }
                } else{
                    setContestData(data.data);
                }
                //setGame(data);
            }).catch(err => {
                //console.log(err)
            });
        }
        
    }
	
	const handleRevertCancelContest = () => {
        if(contestData){
            var url = `${process.env.REACT_APP_URL_LINK}/api/contests/revert-cancel-contest/${contestData._id}`;
            
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
        
            getData(url)
            .then(data => {
                //console.log(data);
                if(data.message != "Successfully Added User Balance"){
                    alert(data.message);
                    if(data.data){
                        setContestData(data.data);
                    }
                } else{
                    setContestData(data.data);
                }
                //setGame(data);
            }).catch(err => {
                //console.log(err)
            });
        }
        
    }

    return contestData && <div className="contest__container">
        {isModalOpen && <Modal
            show={isModalOpen} 
            onCancel={() => setIsModalOpen(false)}
            header={"Prize Break Up"}
            footer={<></>}
        >
            <div className="fixed-modal-area quiz-selection">
                <WinnerListContainer title={contestData.winnerSelection} options={risk.winnersList[contestData.winnerSelection]} currentPrize={(contestData.contestPool / contestData.contestSize) * contestData.joined} totalPrize={contestData.contestPool} noSelection={true} />
            </div>
        </Modal>
        }
		{isWalletModalOpen && <Modal
            show={isWalletModalOpen} 
            onCancel={() => setWalletModalOpen(false)}
            header={"Create Wallet"}
            footer={<></>}
        >
            <h3>
				You don't have a wallet. Create a wallet to continue.
			</h3>
			<button className="btn btn-sm btn-primary">
				Create Wallet
			</button>
        </Modal>
        }
        <h2 className="contest__container__title">
            {contestData.contestName}
            <span className={`contest__container__status ${contestData.status}`}>{eventDate ? `${new Date().getTime() > contestData.endTime ? t("locks__in") : t("expires__in")}: ${eventDate}` : contestData.status}</span>
        </h2>
        <div className="contest__container__header">
            <div className="contest__container__prize">
                <h2 className="contest__container__prize__title">{t("prize__pool")}</h2>
                <h2 className="contest__container__prize__value">{Number((contestData.contestPool).toFixed(2)).toLocaleString()}</h2>
                <h2 className="contest__container__prize__current">{t("cur__pool")}: {Number(((contestData.contestPool / contestData.contestSize) * contestData.joined ).toFixed(2)).toLocaleString()}</h2>
            </div>
            <div className="contest__container__fee">
                <h2 className="contest__container__fee__title">{t("entry__fee")}</h2>
                <h2 className="contest__container__fee__value">{ Number((contestData.entryFee).toFixed(2)).toLocaleString()}</h2>
                {!admin ? (myContest ? <button className="contest__container__fee__btn" onClick={handleMyContestClick}>
                    {t("view__details")} <i className="fa fa-arrow-right-long" />
                </button> : <button className="contest__container__fee__btn" onClick={handleClick} disabled={isValidJoin == true ? false : true}>
                    {t("join__now")} <i className="fa fa-arrow-right-long" />
                </button>) : <><button className="contest__container__fee__btn" onClick={handleAdminContestClick}>
                    {t("edit__contest")} <i className="fa fa-arrow-right-long" />
                </button>
                <button className="contest__container__fee__btn" onClick={handleAdminMyContestClick}>
                    {t("view__details")} <i className="fa fa-arrow-right-long" />
                </button>
                {(contestData.status == "active" ? <button className="contest__container__fee__btn" onClick={handleSettleContest} disabled={new Date().getTime() > contestData.settleTime ? false : true}>
                    {t("settle__contest")} <i className="fa fa-arrow-right-long" />
                </button> : (contestData.status == "ended" && <button className="contest__container__fee__btn red" onClick={handleRevertSettleContest}>
                    {t("revert__settle__contest")} <i className="fa fa-arrow-right-long" />
                </button>))}
                {contestData.status == "active" && <button className="contest__container__fee__btn red" onClick={handleCancelContest}>
                    {t("cancel__contest")} <i className="fa fa-arrow-right-long" />
                </button>}
                </>
                }
            </div>
        </div>
        <div className="contest__container__body">
            <div className="contest__container__body__item">
                <h2>{t("joined")}</h2>
                <h3>{contestData.joined}</h3>
            </div>
            <div className="contest__container__body__item">
                <h2>{t("min")}. {t("spot")}</h2>
                <h3>{contestData.winnerSelection > 1 ? contestData.winnerSelection : 2}</h3>
            </div>
            <div className="contest__container__body__item">
                <h2>{t("max")}. {t("spot")}</h2>
                <h3>{contestData.contestSize}</h3>
            </div>
            <div className="contest__container__body__item" onClick={() => setIsModalOpen(true)} style={{cursor:"pointer"}}>
                <h2>{t("prize")}</h2>
                <h3>{t("break__up")}</h3>
            </div>
        </div>
    </div>
}

const mapStateToProps = state => ({
    token: state.user.token,
	wallet: state.user.wallet,
    risk:state.risk.risk
})

const mapDispatchToProps = dispatch => ({
    login: (user,token) => dispatch(userLogin(user,token))
})

export default connect(mapStateToProps, mapDispatchToProps)(Contest);
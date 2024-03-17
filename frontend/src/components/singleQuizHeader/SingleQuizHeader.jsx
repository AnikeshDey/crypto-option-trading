import React from "react";
import { useTranslation } from 'react-i18next';
import { connect } from "react-redux";

import getCountdown from "../../utils/getCountDown";

// import Modal from "../modal/Modal";

function SingleQuizHeader({ game, contest, quizes, myContest, token }) {
    const { t } = useTranslation(["common"]);
    
    const [eventDate, setEventDate] = React.useState(null)
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [contestQuiz, setContestQuiz] = React.useState([]);



    React.useLayoutEffect(() => {
        if(quizes){
            var avlQuiz = []
            for(var i=0; i < quizes.length; i++){
                if(quizes[i].contestId == contest._id){
                    ////console.log("quizes[i].contestId", quizes[i].contestId);
                    ////console.log("contest_id", contest._id)
                    avlQuiz.push(quizes[i]);
                }
            }
            setContestQuiz(avlQuiz);
        }
        
    },[quizes]);


    //React.useLayoutEffect(() => {
    //     if(!myContest){
           
    //                 var eventCountDown = getCountdown(game.gSD);
    //                 setEventDate(eventCountDown);
                
            
    //     } else{
    //         var eventCountDown = getCountdown(contest.gameStartDate);
    //         setEventDate(eventCountDown);
    //     }
    // },[game]);

    React.useLayoutEffect(() => {
        if(!myContest){
            var eventCountDown = getCountdown(game.gSD);
            setEventDate(eventCountDown);
            //console.log("this one 1")
        } else{
            // console.log("This one2")
            // var eventCountDown = getCountdown(contest.endTime);
            // setEventDate(eventCountDown);
            if(contest.endTime > new Date().getTime()){
                var countDown = getCountdown(contest.endTime);
                setEventDate(countDown);
            } else {
                // console.log("settleTime:", contest.settleTime);
                if(contest.settleTime > new Date().getTime()){
                    var countDown = getCountdown(contest.settleTime);
                    //console.log("countDown:", countDown);
                    setEventDate(countDown);
                } else{
                    setEventDate(null);
                }   
            }
        }
        var firstInterval = setInterval(() => {
            if(!myContest){
                var eventCountDown = getCountdown(game.gSD);
                setEventDate(eventCountDown);
            } else{
                if(contest.endTime > new Date().getTime()){
                    var countDown = getCountdown(contest.endTime);
                    setEventDate(countDown);
                } else {
                    if(contest.settleTime > new Date().getTime()){
                        var countDown = getCountdown(contest.settleTime);
                        setEventDate(countDown);
                    } else{
                        setEventDate(null);
                    }   
                }
            }
        }, 1000)
        

        return () => {
            clearInterval(firstInterval);
        }
            
    },[]);

    React.useEffect(() => {
            // async function postData(url = '') {
            //     // Default options are marked with *
            //     const response = await fetch(url, {
            //         method: 'GET', // *GET, POST, PUT, DELETE, etc.
            //         mode: 'cors', // no-cors, *cors, same-origin
            //         headers: {
            //             'Authorization': 'Bearer ' + token,
            //             // 'Content-Type': 'application/x-www-form-urlencoded',
            //         }
            //         // body data type must match "Content-Type" header
            //     });
            //     ////console.log(url);
            //     return response.json(); // parses JSON response into native JavaScript objects
            // }
            // setIsLoading(true);
            // postData(`${process.env.REACT_APP_URL_LINK}/api/events/get-event-result/${myContest ? contest.gameId : game._id}`)
            //     .then(data => {
            //         //console.log(data);
            //         if(!data.message){
            //                 setEvents(data.data ? data.data : []);
            //                 setEventType(data.type);
            //                 setGameScore(data.gameScore);
            //                 setGameType(data.gameType);
                        
            //         }
                    
            //         setIsLoading(false);
            
            //         ////console.log(results)


            //         // setEvents([])
            //         // setEvents(data.events); // JSON data parsed by `data.json()` call
            //     }).catch(err => {
            //         //console.log(err)
            //     });
        
    },[]);


    return <>
    <div className="contest-header__container">
        <div className="contest-header__container__collapse-btn__container">
            <span className={`contest-header__container__collapse-btn ${isCollapsed ? "closed" : ""}`} onClick={() => setIsCollapsed(!isCollapsed)}>
                {isCollapsed && <i className="fa fa-square-plus"  />}
                {!isCollapsed && <i className="fa fa-square-plus" />}
            </span>
            {/* <span className={`contest-header__container__collapse-btn`} onClick={() => setIsModalOpen(true)} >
                <i className="fa fa-square-poll-vertical" />
            </span> */}
        </div>
        
        <h2 className="contest-header__time">
        {
            eventDate ? ((eventDate == "EXPIRED" && contest.status == "active") ? <>{t("play__in__progress")}</> : `${new Date().getTime() > contest.endTime ? t("locks__in") : t("expires__in")}: ${eventDate}` ) : (contest.lockPrice != "null" ? `${t("locked__price")}: ${contest.lockPrice}` : `${t("locked__price")}: N/A`)
        }
        </h2>
        {!isCollapsed && <h2 className="contest-header__league">{
            !myContest ? game.lN : contest.leagueName
        }</h2>}
        {!isCollapsed && <h2 className="contest-header__team">
            
        {  !myContest ? `${
                game.gN.split("v")[0]
            } - ${
                game.gN.split("v")[1]
            }`  : `${contest.gameName?.toUpperCase()} - ${contest.gameCur?.toUpperCase()}`
        }
    
        </h2>}
        {!isCollapsed && <div className="contest__header__picked__container">
            <span className="contest-header__team__picked">
                <h5>{!myContest ?  <>{t("picked")}</> : <>{t("joined")}</>}</h5>
                <h6>{!myContest ? contestQuiz.length : contest.joined}</h6>
            </span>
            <div className="progress">
                <div className="progress-bar" role="progressbar" aria-valuenow={!myContest ? ((contestQuiz.length * 100) / 11).toString() : ((contest.joined * 100) / contest.contestSize).toString()}
                aria-valuemin="0" aria-valuemax="100" style={{width:!myContest ? `${((contestQuiz.length * 100) / 11).toString()}%` : `${((contest.joined * 100) / contest.contestSize).toString()}%`}}>
                   {!myContest ? `${contestQuiz.length}/11` : `${contest.joined}/${contest.contestSize}`}
                </div>
            </div>
            <span className="contest-header__team__picked">
                <h5>{t("total")}</h5>
                <h6>{!myContest ? "11" : contest.contestSize}</h6>
            </span>
        </div>}
        
        <div className="contest-header__info__container">
            <div className="contest-header__info__item">
                <h2>
                    {t("entry")}
                </h2>
                <h3>
                    {Number((contest.entryFee).toFixed(2)).toLocaleString()}
                </h3>
            </div>
            <div className="contest-header__info__item">
                <h2>
                    {t("prize__pool")}
                </h2>
                <h3>
                    {Number((contest.contestPool).toFixed(2)).toLocaleString()}
                </h3>
            </div>
            <div className="contest-header__info__item">
                <h2>
                    {t("max")}. {t("spot")}
                </h2>
                <h3>
                    {contest.contestSize}
                </h3>
            </div>
        </div>
    </div></>
}


function numFormatter(num) {
    if(num > 999 && num < 1000000){
        return (num/1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
    }else if(num > 1000000){
        return (num/1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
    }else if(num <= 999){ 
        return num; // if value < 1000, nothing to do
    }
}


const mapStateToProps = state => ({
    quizes:state.cryptoSlip.quizzes,
    token:state.user.token
})

  
  
export default connect(mapStateToProps)(SingleQuizHeader);

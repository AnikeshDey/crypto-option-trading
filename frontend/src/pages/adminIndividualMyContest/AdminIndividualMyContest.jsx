import React from "react";
import { useTranslation } from 'react-i18next';
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { CSVLink } from "react-csv"; 


import MainLayout from "../../layouts/main-layout.component";

import SingleQuizHeader from "../../components/singleQuizHeader/SingleQuizHeader";
import ContestSlipTableContainer from "../../components/ContestSlipTableContainer/ContestSlipTableContainer";
import WinnerListContainer from "../../components/winnerListSelection/WinnerListSelection";
import Loader from "../../components/loader/Loader";

import getRankData from "../../utils/getRankData";


const headers = [
    {label:"ContestID", key:"contestId"},
    {label:"Username", key:"username"},
    {label:"Quiz1", key:"quiz1"},
    {label:"Quiz2", key:"quiz2"},
    {label:"Quiz3", key:"quiz3"},
    {label:"Quiz4", key:"quiz4"},
    {label:"Quiz5", key:"quiz5"},
    {label:"Quiz6", key:"quiz6"},
    {label:"Quiz7", key:"quiz7"},
    {label:"Quiz8", key:"quiz8"},
    {label:"Quiz9", key:"quiz9"},
    {label:"Quiz10", key:"quiz10"},
    {label:"Quiz11", key:"quiz11"},
]

function AdminInvidualMyContestPage({ token, games, user, risk }){
    const [totalSlipCount, setTotalSlipCount] = React.useState(0);

    const [myContest, setMyContest] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [count, setCount] = React.useState(20);
    const [page, setPage] = React.useState(1);
    const [lockPrice, setLockPrice] = React.useState(null);

    
    const [totalContestSlips, setTotalContestSlips] = React.useState(null);
    const [mySlips, setMySlips] = React.useState(null);
    const [tab, setTab] = React.useState('active');
    const [fullResult, setFullResult] = React.useState(null);
    const [isCsvLoading, setisCsvLoading] = React.useState(true);

    const { t } = useTranslation(["common"]);

    var contestId = useParams().contestId;

    const handleTabChange = (e) =>{
        var selectedTab = e.target.dataset.tab;
        //console.log(selectedTab);
        setTab(selectedTab);
    }

    const handleCount = (e) => {
        //console.log(e.target.value);
        setCount(e.target.value);
    }
    const handlePrev = () => {
        setPage(prev => prev - 1);
    }
    const handleNext = () => {
        setPage(prev => prev + 1);
    }

    React.useEffect(() => {
        var url = `${process.env.REACT_APP_URL_LINK}/api/quiz/my-contest/${contestId}`
        // Example POST method implementation:
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
        setIsLoading(true)
        putData(url)
        .then(data => {
            //console.log(data);
            setIsLoading(false);
            setMyContest(data.data);	
        }).catch(err => {
            //console.log(err)
        });
    },[token]);

    React.useEffect(() => {
        if(myContest){
            if(myContest.lockPrice == "null"){
                var foundGame = games.find(el => el.id == myContest.gameId);
                if(foundGame){
                    setLockPrice(foundGame.pR);
                }
            } else{
                setLockPrice(myContest.lockPrice);
            }
        }
    },[games, myContest]);

    React.useEffect(() => {
        if(myContest && lockPrice){
            var url = `${process.env.REACT_APP_URL_LINK}/api/quiz/contest-slip-result/${contestId}`
            // Example POST method implementation:
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
            
            putData(url)
            .then(data => {
                    console.log(data);
                    var ranked = getRankData(data.betslips, lockPrice);

                    var start = (page -1) * count;

                    var end = (page) * count;

                    var betslips = ranked.slice(start, end);

                    var userbetslips = ranked.filter(el => el.uId == user._id.toString());

                    setTotalContestSlips(betslips);
                    setTotalSlipCount(data.betslips.length);
                    setMySlips(userbetslips);
            }).catch(err => {
                //console.log(err)
            });
        }
        
    },[myContest, lockPrice, page, count]);
    

    // React.useEffect(() => {
    //     if(myContest){
    //         var url = `http://localhost:5000/api/quiz/contest-rk/${contestId}`
    //         // Example POST method implementation:
    //         async function putData(url = '') {
    //             // Default options are marked with *
    //             const response = await fetch(url, {
    //             method: 'GET', // *GET, POST, PUT, DELETE, etc. // include, *same-origin, omit
    //             headers: {
    //             'Authorization': 'Bearer ' + token
    //             // 'Content-Type': 'application/x-www-form-urlencoded',
    //             },
    //             mode: 'cors'
    //         });
    //         return response.json(); // parses JSON response into native JavaScript objects
    //         }
            
    //         putData(url)
    //         .then(data => {
    //             //console.log(data);
    //             //setTotalContestSlips(parseData);
    //             // if(data.length){
    //             //     var parsedData = JSON.parse(data);
    //             //     var totalSlips = [];
    //             //     parsedData.forEach(d => totalSlips.push(JSON.parse(d)))
    //             //     ////console.log(totalSlips);
    //             //     setTotalContestSlips(totalSlips);
    //             // } else{
    //             //     setTotalContestSlips(data);
    //             // }
               
    //             //setMyContest(data.data);	
    //         }).catch(err => //console.log(err));
    //     }
        
    // },[myContest]);
    
    React.useEffect(() => {
        if(myContest){
            var url = `${process.env.REACT_APP_URL_LINK}/api/quiz/full-slip-result/${contestId}/${myContest.contestCode}`
            // Example POST method implementation:
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
            
            putData(url)
            .then(data => {
                    console.log("data",data);
                    if(!data.message){
                        setFullResult(data);
                    } else{
                        alert(data.message)
                    }
                    setisCsvLoading(false);
                    
            }).catch(err => {
                //console.log(err)
            });
        }
        
    },[myContest]);

    

    return <>
        {/* {gameType != "precricket" && <GameScore game={game} gameType={gameType} />} */}
        <MainLayout goBack={true} title={
            <div className="title">
                <h2>{myContest?.contestName}</h2>
            </div>
        }>
            {isLoading && !myContest && <Loader />}
            {myContest && <SingleQuizHeader contest={myContest} myContest={true} />}

            {
            !isLoading && <div className="tabsContainer">
                <button onClick={handleTabChange} className={`tab ${tab === 'active' ? 'active' : ''}`} data-tab={"active"}><span>{t("leaderboard")}</span></button>
                <button onClick={handleTabChange} className={`tab ${tab === 'winner' ? 'active' : ''}`} data-tab={"winner"}><span>{t("prize__break__up")}</span></button>
                <button onClick={handleTabChange} className={`tab ${tab === 'download' ? 'active' : ''}`} data-tab={"download"}><span>{t("download")}</span></button>
            </div>
            }

            {totalContestSlips && mySlips && tab == "active" && <div className="contestslip__table">
                <div className="contestslip__table__container header">
                        <div className="contestslip__table__team header">
                            {t("contestslip__table__team")}
                        </div>
                        <div className="contestslip__table__point header">
                            {t("contestslip__table__point")}
                        </div>
                        <div className="contestslip__table__rk header">
                            {t("contestslip__table__rk")}
                        </div>  
                        <div className="contestslip__table__status header">
                            {t("contestslip__table__status")}
                        </div>  
                </div>

                { 
                    mySlips && mySlips.map(slip => (
                        <ContestSlipTableContainer 
                            key={slip._id}
                            slipId={slip._id} 
                            points={slip.po}
                            rk={slip.rk}
                            status={slip.st}
                            profileImg={slip.uP}
                            username={slip.uN}
                            cc={slip.cc}
                            mySlip={true}
                            isSettled={myContest.isSettled}
                            gId={slip.gId}
                            cId={slip.cId}
                        />
                    ))
                }

                { 
                    totalContestSlips && totalContestSlips.map(slip => (
                        <ContestSlipTableContainer 
                            key={slip._id}
                            slipId={slip._id} 
                            points={slip.po}
                            rk={slip.rk}
                            status={slip.st}
                            profileImg={slip.uP}
                            username={slip.uN}
                            cc={slip.cc}
                            isSettled={myContest.isSettled}
                        />
                    ))
                }


            </div>}
            {totalSlipCount > 0 && tab == "active" && <div className="fragment__footer">
                <div className="fragment__footer__item">
                    <select id="inputState" className="form-control" onChange={handleCount}>
                        <option>20</option>
                        <option>50</option>
                        <option>100</option>
                        <option>200</option>
                    </select>
                </div>
                <div className="fragment__footer__item">
                    <button onClick={handlePrev} disabled={page > 1 ? false : true}>
                        {t("prev")}
                    </button>
                    <button onClick={handleNext} disabled={page < Math.floor(totalSlipCount/count) ? false : true}>
                        {t("next")}
                    </button>
                </div>
                <div className="fragment__footer__item">
                    {totalSlipCount <= count * page ? `${page}/${page}` : `${page}/${Math.floor(totalSlipCount/count)}`}
                </div>
            </div>}

            {
                tab == "winner" && myContest && <WinnerListContainer title={myContest.winnerSelection} options={risk.winnersList[myContest.winnerSelection]} currentPrize={(myContest.contestPool / myContest.contestSize) * myContest.joined} totalPrize={myContest.contestPool} noSelection={true} />
            }

            {
                tab == "download" && myContest && fullResult && <>
                    {
                        isCsvLoading ? 
                        <Loader />
                        :
                        <div className="download__csv__container">
                            <p className="download__csv__title">{t("download__quizzes")}</p>
                            <CSVLink className="download__csv__btn" filename={`${myContest.gameName}-${myContest.contestName}.csv`} headers={headers} data={fullResult}>{t("download__csv")} <i className="fa fa-download" /></CSVLink>
                        </div>
                    }
                    </>
            }

        </MainLayout>
    </>
}

const mapStateToProps = state => ({
    token:state.user.token,
    user:state.user.user,
    risk:state.risk.risk,
    games:state.cryptoGame.games
})

export default connect(mapStateToProps)(AdminInvidualMyContestPage);
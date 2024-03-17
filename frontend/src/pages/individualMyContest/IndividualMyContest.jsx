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

import { useSocket, socket, isSocketConnected } from "../../socket/socket";

import { putNewResult, deleteAllResults } from "../../redux/contestResult/contestResult.actions.js";
import { setPageType } from "../../redux/page/page.actions.js";
import getRankData from "../../utils/getRankData";

const headers = [
    {label:"ContestID", key:"contestId"},
    {label:"Username", key:"username"},
    {label:"Strike Price", key:"point"},
    {label:"Entry Fee", key:"entryFee"},
    {label:"Created At", key:"createdAt"}
]

function InvidualMyContestPage({ token, user, games, risk, results, putNewResult, deleteAllResults, setPageType }){

    useSocket();

    const { t } = useTranslation(["common"]);
    const [totalSlipCount, setTotalSlipCount] = React.useState(0);

    const [myContest, setMyContest] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [count, setCount] = React.useState(20);
    const [page, setPage] = React.useState(1);
    
    const [totalContestSlips, setTotalContestSlips] = React.useState(null);
    const [mySlips, setMySlips] = React.useState(null);
    const [tab, setTab] = React.useState('active');
    const [lockPrice, setLockPrice] = React.useState(null);
    const [fullResult, setFullResult] = React.useState(null);
    const [isCsvLoading, setisCsvLoading] = React.useState(true);
    // const [pageReload, setPageReload] = React.useState(false);

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

    React.useLayoutEffect(() => {
        setPageType("crypto")
    },[]);

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
            console.log("myContest:", data);
            // if(data.data.lockPrice == "null"){
            //     setLockPrice(data.price);
            // } else{
            //     setLockPrice(data.data.lockPrice);
            // }
            setMyContest(data.contestData);
            setIsLoading(false);
        }).catch(err => {
            //console.log(err)
        });
    },[token]);

    React.useEffect(() => {
        if(myContest){
            console.log("myContest:", myContest);
            if(myContest.lockPrice == "null"){
                var foundGame = games.find(el => el.id == myContest.gameId);
                console.log("foundGame:", foundGame);
                if(foundGame){

                    setLockPrice(foundGame.pR);
                }
            } else{
                setLockPrice(myContest.lockPrice);
            }
        }
    },[games, myContest]);

    React.useEffect(() => {
        ////console.log(token)
        if(myContest && lockPrice){

            if(`${myContest._id}` in results && results[`${myContest._id}`].timeout > new Date().getTime()){                
                
                var ranked =  getRankData(results[`${myContest._id}`].result, lockPrice);
                //var parseData = JSON.parse(data.betslips);
                //var mySlips = JSON.parse(data.userbetslips);

                var start = (page -1) * count;

                var end = (page) * count;

                var betslips = ranked.slice(start,end);

                var userbetslips = ranked.filter(el => el.uId == user._id.toString());


                setTotalContestSlips(betslips);
                setTotalSlipCount(ranked.length);
                setMySlips(userbetslips);
                console.log("redux....")
                //setPageReload(false);
            } else {
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
                // console.time("sliptime");
                putData(url)
                .then(data => {
                        console.log("data that came1:", data);

                        var ranked = getRankData(data.betslips, lockPrice);

                        var start = (page -1) * count;

                        var end = (page) * count;

                        var betslips = ranked.slice(start, end);

                        var userbetslips = ranked.filter(el => el.uId == user._id.toString());

                        setTotalContestSlips(betslips);
                        setTotalSlipCount(data.betslips.length);
                        setMySlips(userbetslips);
                        putNewResult(`${myContest._id}`, ranked);
                        
                        console.log("lockPrice1:",lockPrice);

                        // var parseData = data.betslips;
                        // var mySlips = data.userbetslips;
                        //setTotalContestSlips(data.betslips);
                        //setTotalSlipCount(data.totalCount);
                        //setMySlips(data.userbetslips);
                        // console.timeEnd("sliptime");
                        // setPageReload(false);

                        // if(page == 1 && count == 20){
                            // putNewResult(`${myContest._id}`, ranked);
                        // }
        
                }).catch(err => {
                    //console.log(err)
                });
            }
        }
        
    },[myContest, page, count, lockPrice]);


    React.useEffect(() => {
        if(myContest && myContest.lockPrice == "null"){
            var firstInterval = setInterval(() => {
                if(myContest.settleTime <= new Date().getTime() && new Date().getTime() < new Date(myContest.settleTime + (1 * 60 * 60)).getTime()){
                    console.log("myContest.isSettled:",myContest.isSettled);
                    console.log("myContest.settleTime:",myContest.settleTime);
                    console.log("new Date().getTime():",new Date().getTime());
                }
                

                if(myContest.settleTime < new Date().getTime()  && new Date().getTime() < new Date(myContest.settleTime + (1 * 60 * 60)).getTime() && myContest.isSettled == "false"){
                    handleSettleContest();
                }
            }, 1000)    
        }
        return () => {
            clearInterval(firstInterval);
        }
    },[myContest]);

    const handleLockPrice = () => {
        var url = `${process.env.REACT_APP_URL_LINK}/api/contests/set-lock-price/${contestId}`
        // Example POST method implementation:
        async function putData(url = '') {
            // Default options are marked with *
            const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc. // include, *same-origin, omit
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
            console.log("Locking the price");
            console.log("data", data);
            
            deleteAllResults();
            // setMyContest(data);
            if(data.isSettled == "false"){
                handleSettleContest();
            } else {
                setMyContest(data);
            }
            

            // var ranked = getRankData(data.betslips, lockPrice);

            // var start = (page -1) * count;

            // var end = (page) * count;

            // var betslips = ranked.slice(start, end);

            // var userbetslips = ranked.filter(el => el.uId == user._id.toString());

            // setTotalContestSlips(betslips);
            // setTotalSlipCount(data.betslips.length);
            // setMySlips(userbetslips);
            // putNewResult(`${myContest._id}`, ranked);

        }).catch(err => {
            //console.log(err)
        });
    }

    const handleSettleContest = () => {
        if(myContest){
            var url = `${process.env.REACT_APP_URL_LINK}/api/quiz/contest-final-settlement/${contestId}`;
            
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
                console.log(data);
                deleteAllResults();
                if(data.message != "Successfully Added User Balance"){
                    alert(data.message);
                    if(data.data){
                        setMyContest(data.data);
                    }
                } else{
                    setMyContest(data.data);
                }
                //setGame(data);
            }).catch(err => {
                //console.log(err)
            });
        }
        
    }


    const reload = () => {
        console.log("reloading....1");

        console.log(myContest);
        console.log(lockPrice);

        if(myContest && lockPrice){
            console.log("reloading....");
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
                console.log("data that came2:", data);

                var ranked = getRankData(data.betslips, lockPrice);

                var start = (page -1) * count;

                var end = (page) * count;

                var betslips = ranked.slice(start, end);

                var userbetslips = ranked.filter(el => el.uId == user._id.toString());

                setTotalContestSlips(betslips);
                setTotalSlipCount(data.betslips.length);
                setMySlips(userbetslips);
                putNewResult(`${myContest._id}`, ranked);
	
            }).catch(err => {
                //console.log(err)
            });
        }
    }

    React.useEffect(() => {
        console.log("totalSlipCount:", totalSlipCount);
    }, [totalSlipCount]);

    // React.useEffect(() => {
    //     // myContest && //console.log("new Date(new Date().getTime()) > new Date(myContest.gameStartDate):", new Date(new Date().getTime()) > new Date(myContest.gameStartDate))
    //     if(myContest && new Date(new Date().getTime()) > new Date(myContest.gameStartDate) && myContest.status == "active"){
    //         setInterval(() => {
    //             var url = `${process.env.REACT_APP_URL_LINK}/api/quiz/contest-slip-result/${contestId}`
    //             // Example POST method implementation:
    //             async function putData(url = '') {
    //                 // Default options are marked with *
    //                 const response = await fetch(url, {
    //                 method: 'GET', // *GET, POST, PUT, DELETE, etc. // include, *same-origin, omit
    //                 headers: {
    //                 'Authorization': 'Bearer ' + token
    //                 // 'Content-Type': 'application/x-www-form-urlencoded',
    //                 },
    //                 mode: 'cors'
    //             });
    //             return response.json(); // parses JSON response into native JavaScript objects
    //             }
                
    //             putData(url)
    //             .then(data => {
    //                     console.log("data that came3:",{bet:data.betslips, userbet:data.userbetslips});
    //                     //var parseData = JSON.parse(data.betslips);
    //                     //var mySlips = JSON.parse(data.userbetslips);
    //                     setTotalContestSlips(data.betslips);
    //                     setTotalSlipCount(data.totalCount);
    //                     setMySlips(data.userbetslips);
    //                     // setPageReload(false);

    //                     if(page == 1 && count == 20){
    //                         putNewResult(`${myContest._id}__${page}__${count}`, data);
    //                     }
        
    //             }).catch(err => {
    //                 //console.log(err)
    //             });
    //         },60000)
    //     }
    // },[myContest])

    React.useEffect(() => {
        ////console.log(token)
        if(myContest && isSocketConnected){
            socket.emit('join room', `game-${myContest._id}`);
            //console.log(`Joined room contestId-${myContest._id}`)
            socket.off("reload available").on("reload available", (lockPriceData = null) => {
                console.log("lockPrice2:", lockPrice);
                console.log("Reload Page Came..........");
                // setPageReload(true)
                console.log("lockPrice3:", lockPrice);
                if(lockPriceData != null && lockPriceData != "null"){
                    setLockPrice(lockPriceData);
                    console.log("happeing")
                }
                reload();
            })
        }

        return () => {
            socket.off("reload page", () => {});
        }
        
    },[myContest, isSocketConnected, lockPrice]);

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
                    //console.log(data);
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
    

    

    return <>
        {/* {gameType != "precricket" && <GameScore game={game} gameType={gameType} />} */}
        <MainLayout goBack={true} title={
            <div className="title">
                <h2>{myContest?.contestName}</h2>
            </div>
        }>
            {isLoading && !myContest && <Loader />}
            {myContest && <SingleQuizHeader contest={myContest} myContest={true} />}

            {!isLoading && <div className="tabsContainer">
                <button onClick={handleTabChange} className={`tab ${tab === 'active' ? 'active' : ''}`} data-tab={"active"}><span>{t("leaderboard")}</span></button>
                <button onClick={handleTabChange} className={`tab ${tab === 'winner' ? 'active' : ''}`} data-tab={"winner"}><span>{t("prize__break__up")}</span></button>
                <button onClick={handleTabChange} className={`tab ${tab === 'download' ? 'active' : ''}`} data-tab={"download"}><span>{t("download")}</span></button>
            </div>}

            {totalContestSlips && mySlips && tab == "active" && <>
            {/* <div className="contestslip__reload__container">
                <button className="contestslip__reload__button" disabled={pageReload == true ? false : true} onClick={reload}>
                    <i className="fa fa-rotate" /> 
                    {t("reload")}
                </button>
            </div> */}
            <div className="contestslip__table">
                
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
                            gSD={slip.gSD}
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


            </div></>}
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
    results:state.contestResult.results,
    games:state.cryptoGame.games
})

const mapStateToDispatch = dispatch => ({
    putNewResult: (key, result) => dispatch(putNewResult(key,result)),
    deleteAllResults: () => dispatch(deleteAllResults()),
    setPageType: (type) => dispatch(setPageType(type))
})

export default connect(mapStateToProps, mapStateToDispatch)(InvidualMyContestPage);
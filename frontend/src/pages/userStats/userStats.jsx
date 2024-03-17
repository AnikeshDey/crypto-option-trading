import * as React from "react";
import { useTranslation } from 'react-i18next';
import { connect } from "react-redux";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from 'chart.js';


import { setPageType } from '../../redux/page/page.actions';
import { setUserStats } from '../../redux/user/user.actions';

import MainLayout from '../../layouts/main-layout.component';
import Loader from "../../components/loader/Loader";

ChartJS.register(...registerables);


function UserStats({ token, stats, setPageType, setUserStats }) {
    const [isFetching, setIsFetching] = React.useState(true);
    const [timeRange, setTimeRange] = React.useState(720);
    const [chartData, setChartData] = React.useState(null);
    const [lineChartData, setLineChartData] = React.useState(null);
    const [totalPlayed, setTotalPlayed] = React.useState(0);
    const [totalWon, setTotalWon] = React.useState(0);
    const [totalLost, setTotalLost] = React.useState(0);
    const [totalMoneyWon, setTotalMoneyWon] = React.useState(0);
    const [totalMoneyLost, setTotalMoneyLost] = React.useState(0);
    const [winRate, setWinRate] = React.useState(0);


    const { t } = useTranslation(["common"]);

    React.useLayoutEffect(() => {
        setPageType('crypto');
    },[]);

    React.useEffect(() => {

        console.log("new Date().getTime() > stats.exp:",new Date().getTime() > stats.exp);
        console.log("(stats[timeRange.toString()] == null || stats[timeRange.toString()] == undefined):",(stats[timeRange.toString()] == null || stats[timeRange.toString()] == undefined))
        if(!stats || (stats[timeRange.toString()] == null || stats[timeRange.toString()] == undefined) || new Date().getTime() > stats.exp){
            var url = `${process.env.REACT_APP_URL_LINK}/api/users/user-stats?timeRange=${timeRange}`;
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
                setUserStats(timeRange.toString(), data);
                //console.log("Saved in redux");
                setTotalPlayed(data.matchesPlayed);
                setTotalWon(data.matchesWon);
                setTotalLost(data.matchesLost);
                setTotalMoneyWon(data.totalMoneyWon);
                setTotalMoneyLost(data.totalMoneyLost);

                var winRate = data.matchesPlayed > 0 ? Math.floor((data.matchesWon * 100) / data.matchesPlayed) : 0;
                setWinRate(winRate)
                if(Object.keys(data.sportObject).length > 0){
                    var wins = [];
                    var losses = [];
                    Object.keys(data.sportObject).forEach(key => {
                        wins.push(data.sportObject[key].won);
                        losses.push(data.sportObject[key].loss);
                    })

                    const chartData = {
                        labels: Object.keys(data.sportObject),
                        datasets: [{
                        label: 'Wins',
                        data: wins,
                        backgroundColor: [
                            'rgba(43, 122, 11, 0.2)'
                        ],
                        borderColor: [
                            'rgb(43, 122, 11)'
                        ],
                        borderWidth: 1
                        },{
                        label: 'Losses',
                        data: losses,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)'
                        ],
                        borderColor: [
                            'rgb(255, 99, 132)'
                        ],
                        borderWidth: 1
                        }]
                    };

                    const lineChart = {
                        labels: Object.keys(data.sportObject),
                        datasets: [{
                          label: 'Wins',
                          data: data.wins,
                          fill: false,
                          borderColor: 'rgb(43, 122, 11)',
                          tension: 0.1
                        },
                        {
                            label: 'Losses',
                            data: data.losses,
                            fill: false,
                            borderColor: 'rgb(255, 99, 132)',
                            tension: 0.1
                        }]
                    }
                    setLineChartData(lineChart);
                    setChartData(chartData);   
                }
                setIsFetching(false);
                
            }).catch(err => {
                //console.log(err)
            });
        } else {
            var data = stats[timeRange.toString()];
            console.log("Came from Redux");
            console.log(data);
            setTotalPlayed(data.matchesPlayed);
            setTotalWon(data.matchesWon);
            setTotalLost(data.matchesLost);
            setTotalMoneyWon(data.totalMoneyWon);
            setTotalMoneyLost(data.totalMoneyLost);

            var winRate = data.matchesPlayed > 0 ? Math.floor((data.matchesWon * 100) / data.matchesPlayed) : 0;
            setWinRate(winRate)
            if(Object.keys(data.sportObject).length > 0){
                var wins = [];
                var losses = [];
                Object.keys(data.sportObject).forEach(key => {
                    wins.push(data.sportObject[key].won);
                    losses.push(data.sportObject[key].loss);
                })

                const chartData = {
                    labels: Object.keys(data.sportObject),
                    datasets: [{
                    label: 'Wins',
                    data: wins,
                    backgroundColor: [
                        'rgba(43, 122, 11, 0.2)'
                    ],
                    borderColor: [
                        'rgb(43, 122, 11)'
                    ],
                    borderWidth: 1
                    },{
                    label: 'Losses',
                    data: losses,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)'
                    ],
                    borderColor: [
                        'rgb(255, 99, 132)'
                    ],
                    borderWidth: 1
                    }]
                };
                
                const lineChart = {
                    labels:Object.keys(data.sportObject),
                    datasets: [{
                      label: 'Wins',
                      data: data.wins,
                      fill: false,
                      borderColor: 'rgb(43, 122, 11)',
                      tension: 0.1
                    },
                    {
                        label: 'Losses',
                        data: data.losses,
                        fill: false,
                        borderColor: 'rgb(255, 99, 132)',
                        tension: 0.1
                    }]
                }
                //console.log(wins);
                //console.log(losses);
                setLineChartData(lineChart);
                setChartData(chartData);   
            }
            setIsFetching(false);
        }        
        
    },[timeRange]);

    // React.useEffect(() => {
    //     if(labels && wins && losses){
    //         const data = {
    //             labels: labels,
    //             datasets: [{
    //               label: 'Wins',
    //               data: wins,
    //               backgroundColor: [
    //                 'rgba(255, 99, 132, 0.2)'
    //               ],
    //               borderColor: [
    //                 'rgb(255, 99, 132)'
    //               ],
    //               borderWidth: 1
    //             },{
    //               label: 'Losses',
    //               data: losses,
    //               backgroundColor: [
    //                 'rgba(32, 29, 30, 0.2)'
    //               ],
    //               borderColor: [
    //                 'rgb(255, 99, 132)'
    //               ],
    //               borderWidth: 1
    //             }]
    //         };

    //         setChartData(data);
    //     }
        
    // },[labels, wins, losses]);


    const handleChange = (e) => {
        var value = e.target.value;
        setTimeRange(value);
    }
  return (
      	<MainLayout goBack={true} title={
            <div className="title">
                <h2>{t("user__stats")}</h2>
            </div>
        }>
            <div className="resultsContainer">
                <div className="resultsContainer__header">
                        <h2 className="resultsContainer__title"></h2>
                        <div className="resultsContainer__input__container">
                            {/* <div className="resultsContainer__input__item">
                                <label htmlFor="from">{t("from")}:</label>
                                <input type="month" id="from" value={fromDate} onChange={e => setFromDate(e.target.value)}  />
                            </div>
                            <div className="resultsContainer__input__item">
                                <label htmlFor="to">{t("to")}:</label>
                                <input type="month" id="to" value={toDate} onChange={e => setToDate(e.target.value)} />
                            </div> */}

                        <select className="form-control" id="exampleFormControlSelect1" onChange={handleChange}>
                            <option value={720}>This Month</option>
                            <option value={4320}>Last 6 Months</option>
                            <option value={8760}>This Year</option>
                            <option value={0}>All Time</option>
                        </select>

                            
                        </div>
                </div>
                {
                    isFetching && <Loader />
                }

                {
                    !isFetching && <div className="user-stats__container__wrapper"><div className="user-stats__container">
                        <div className="user-stats__item">
                            <h1 className="user-stats__item__count">
                                {totalPlayed}
                            </h1>
                            <h1 className="user-stats__item__para">
                                {t("total__contests")}
                            </h1>                        
                        </div>
                        <div className="user-stats__item">
                            <h1 className="user-stats__item__count">
                                {totalWon}
                            </h1>
                            <h1 className="user-stats__item__para">
                                {t("won__contests")}
                            </h1>                        
                        </div>
                        <div className="user-stats__item">
                            <h1 className="user-stats__item__count">
                                {totalLost}
                            </h1>
                            <h1 className="user-stats__item__para">
                                {t("lost__contests")}
                            </h1>                        
                        </div> 
                    </div>
                    
                        <span className="user-stats__round">
                            <h1 className="user-stats__round__heading">
                                {t("win__rate")}
                            </h1>
                            <h2 className="user-stats__round__per">
                                {winRate} 
                            </h2>
                        </span>
                    
                    <div className="user-stats__container">
                        <div className="user-stats__item">
                            <h1 className="user-stats__item__count">
                                {totalMoneyWon.toFixed(2)}
                            </h1>
                            <h1 className="user-stats__item__para">
                                {t("total__won")}
                            </h1>                        
                        </div>
                        <div className="user-stats__item">
                            <h1 className="user-stats__item__count">
                                {totalMoneyLost.toFixed(2)}
                            </h1>
                            <h1 className="user-stats__item__para">
                                {t("total__lost")}
                            </h1>                        
                        </div>
                    </div>
                    </div>
                }

                {
                    !isFetching && chartData && <Bar data={chartData} />
                }

                {
                    !isFetching && lineChartData && <Line data={lineChartData} />
                }
            </div>
      	</MainLayout>
  );
}

const mapStateToProps = state => ({
    token: state.user.token,
    stats:state.user.stats
})

const mapDispatchToProps = dispatch => ({
    setPageType: (pageType) => dispatch(setPageType(pageType)),
    setUserStats: (key, stats) => dispatch(setUserStats(key, stats))
})
 

export default connect(mapStateToProps, mapDispatchToProps)(UserStats);
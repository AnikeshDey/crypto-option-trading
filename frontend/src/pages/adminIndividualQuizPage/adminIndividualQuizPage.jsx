import React from "react";
import { useTranslation } from 'react-i18next';
import { connect } from "react-redux";

import { putNewRisk } from "../../redux/riskManagement/riskManagement.actions";

import replaceCategoryName from "../../utils/replaceCategoryName";

import Collapse from "../../components/collapse/collapse.component";

import ToggleSwitch from "../../components/ToggleSwitch/ToggleSwitch";




function AdminInvidualQuizPage({ game, risk, token, putNewRisk }){
    const { t } = useTranslation(["common"]);
    const [property, setProperty] = React.useState("");
    const [filteredResults, setfilteredResults] = React.useState(null);
    

    const handletabChange = (event) => {
        var els = document.getElementsByClassName("gamepage__tab__item");
        Array.prototype.forEach.call(els, function(el) {
            // Do stuff here
            el.classList.remove("active")
        });
        event.target.classList.add("active");

        setProperty(event.target.dataset.filter);
        ////console.log(property)
        
    }
    React.useEffect(() => {
        if(game){
            if(game.gT != "precricket"){
                // var isOptionMarket = game.optionMarkets[0] ? true : false;
                // var results = i ? game.optionMarkets : game.Markets;
                var markets = []
                if(!Array.isArray(game.markets)){
                    Object.keys(game.markets).forEach(key => {
                        markets = [...markets, game.markets[key]];
                    })
                }
                var results = Array.isArray(game.markets) ? game.markets : markets;

                var foundFilteredResults = results.filter(market => {
                    
                    return market.name.value.toLowerCase().includes(property)
                    
                });
                ////console.log(foundFilteredResults)
                setfilteredResults(foundFilteredResults);
            } else{

                var markets = []
                if(!Array.isArray(game.markets)){
                    Object.keys(game.markets).forEach(key => {
                        markets = [...markets, game.markets[key]];
                    })
                }
                var results = Array.isArray(game.markets) ? game.markets : markets;

                

                var foundFilteredResults = results.filter(market => {
                    ////console.log(market.market.marketName)
                    return market.market.marketName.toLowerCase().includes(property)
                });
                setfilteredResults(foundFilteredResults);
            }
        }
    },[property]);

    const handleCancelCategory = (id) => {
        //console.log("Clicked");
        var url = `${process.env.REACT_APP_URL_LINK}/api/admin/sports-book/disable-category/${id}`
        // Example POST method implementation:
        async function putData(url = '') {
            // Default options are marked with *
            const response = await fetch(url, {
                method: 'PUT', // *GET, POST, PUT, DELETE, etc. // include, *same-origin, omit
                headers: {
                'Authorization': 'Bearer ' + token
                // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                mode: 'cors'
            });
        return response.json(); // parses JSON response into native JavaScript objects
        }
        ////console.log(status);
        
        //setIsLoading(true)
        //console.log("req sent");
        //console.log(url);
        putData(url)
        .then(data => {
            //console.log("res came");
            //console.log(data);
            //setDisabledEvent(data.newEvent.sT);
            if(data.newRisk){  
                putNewRisk(data.newRisk);
            }
            //setIsLoading(false);
            //setMyContest(data.data);	
        }).catch(err => {
            //console.log(err)
        });
        
    }

    var tabs = null;
    if(game.gT != "precricket"){
        if(game && game.sId == 4){
            tabs = <div className="gamepage__tab__container">
                <div onClick={handletabChange} className="gamepage__tab__item active" data-filter="">
                    {t("all")}
                </div>
                <div onClick={handletabChange} className="gamepage__tab__item" data-filter="way">
                    {t("main")}
                </div>
                <div onClick={handletabChange} className="gamepage__tab__item" data-filter="teams">
                    {t("teams")}
                </div>
                <div onClick={handletabChange} className="gamepage__tab__item" data-filter="score">
                    {t("score")}
                </div>
                <div onClick={handletabChange} className="gamepage__tab__item" data-filter="goals">
                    {t("goals")}
                </div>
                <div onClick={handletabChange} className="gamepage__tab__item" data-filter="corners">
                    {t("corners")}
                </div>
                <div onClick={handletabChange} className="gamepage__tab__item" data-filter="handicap">
                    {t("handicap")}
                </div>
            </div>
         } else if(game && game.sId == 7) {
             tabs = <div className="gamepage__tab__container">
             <div onClick={handletabChange} className="gamepage__tab__item active" data-filter="">
                {t("all")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="way">
                {t("main")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="race">
                {t("race")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="score">
                {t("score")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="quarter">
                {t("quarter")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="totals">
                {t("totals")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="handicap">
                {t("handicap")}
             </div>
         </div>
         } else if(game && game.sId == 56) {
             tabs = <div className="gamepage__tab__container">
             <div onClick={handletabChange} className="gamepage__tab__item active" data-filter="">
                {t("all")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="way">
                {t("main")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="score">
                {t("score")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="points">
             {t("points")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="set">
             {t("set")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="team">
             {t("team")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="handicap">
             {t("handicap")}
             </div>
         </div>
         } else if(game && game.sId == 5) {
             tabs = <div className="gamepage__tab__container">
             <div onClick={handletabChange} className="gamepage__tab__item active" data-filter="">
             {t("all")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="player">
             {t("main")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="race">
             {t("race")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="score">
             {t("score")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="set">
             {t("sets")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="game">
             {t("game")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="handicap">
             {t("handicap")}
             </div>
         </div>
         } else if(game && game.sId == 18) {
             tabs = <div className="gamepage__tab__container">
             <div onClick={handletabChange} className="gamepage__tab__item active" data-filter="">
             {t("all")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="way">
             {t("main")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="score">
             {t("score")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="points">
             {t("points")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="set">
             {t("set")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="team">
             {t("team")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="handicap">
             {t("handicap")}
             </div>
         </div>
         } else if(game && game.sId == 22) {
             tabs = <div className="gamepage__tab__container">
             <div onClick={handletabChange} className="gamepage__tab__item active" data-filter="">
             {t("all")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="way">
             {t("main")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="innings">
             {t("innings")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="over">
             {t("overs")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="run">
             {t("runs")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="score">
             {t("score")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="wicket">
             {t("wickets")}
             </div>
         </div>
         } else if(game && game.sId == 44) {
             tabs= <div className="gamepage__tab__container">
             <div onClick={handletabChange} className="gamepage__tab__item active" data-filter="">
             {t("all")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="winner">
             {t("main")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="score">
             {t("score")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="points">
             {t("points")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="set">
             {t("set")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="handicap">
             {t("handicap")}
             </div>
         </div>
         } else {
             tabs = null;
         }
    } else{
        tabs = <div className="gamepage__tab__container">
             <div onClick={handletabChange} className="gamepage__tab__item active" data-filter="">
             {t("all")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="way">
             {t("main")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="innings">
             {t("innings")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="over">
             {t("overs")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="run">
             {t("runs")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="score">
             {t("score")}
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="wicket">
             {t("wickets")}
             </div>
         </div>
    }
    

    return risk && <>
        {/* {gameType != "precricket" && <GameScore game={game} gameType={gameType} />} */}

        {
            filteredResults && <div className="resultsContainer__header">
                    <h2 className="resultsContainer__title">{t("all__quizzes")}</h2>
            </div>
        }

        {tabs}
        {/* risk.disabledCategory.includes(market.id.toString()) */}
        {
            game.gT != 'precricket'
            ?
            (filteredResults && (
                filteredResults.length > 0 ? (
                    game.isOPM ?
                    filteredResults?.map((market, index) => {
                        return market.status == 'Visible' ? (<Collapse key={market.id} title={replaceCategoryName(market.name.value)} open={index < 4 ? true : false} columnStyle={true}>
                            {<div className="cancel-category-container">
                                {/* <i className="fa fa-xmark" /> */}
                                <h3>{t("enableCategory")}</h3>
                                {
                                    risk.disabledCategory.findIndex(c => c == market.id.toString()) > -1 ?
                                    <ToggleSwitch checked={false} handleChange={() => handleCancelCategory(market.id)}  />
                                    :
                                    <ToggleSwitch checked={true} handleChange={() => handleCancelCategory(market.id)}  />
                                }
                                                         
                            </div>}
                            {
                                market.options.map(option =>{
                                   return <div key={option.name.value} className={`collapse__content__container ${market.options.length < 3 ? "flex-1" : "flex-3" }`}>
                                       <div className="collapse__content__flex header">
                                        {option.name.value}
                                        </div>
                                        <div key={option.name.value} className="collapse__content__flex">
                                            {
                                                market.status == 'Visible'? 
                                                <button className={`betSelectionbtn`}>
                                                    {(option.price.odds * 10).toFixed(0)}
                                                </button>
                                                :
                                                <>{t("suspended")}</>
                                            }
                                        </div>
                                    </div>
                                })
                            }
                            </Collapse>) : null
                        })
                     :
                     filteredResults?.map((market, index) => {
                        return market.visibility == 'Visible' ? (<Collapse key={market.id} title={replaceCategoryName(market.name.value)} open={index < 4 ? true : false} columnStyle={true}>
                            {<div className="cancel-category-container">
                                {/* <i className="fa fa-xmark" /> */}
                                <h3>{t("enableCategory")}</h3>
                                {
                                    risk.disabledCategory.findIndex(c => c == market.id.toString()) > -1 ?
                                    <ToggleSwitch checked={false} handleChange={() => handleCancelCategory(market.id)}  />
                                    :
                                    <ToggleSwitch checked={true} handleChange={() => handleCancelCategory(market.id)}  />
                                }
                                
                            </div>}
                            {
                                market.results.map(option =>{
                                   return <div key={option.name.value} className={`collapse__content__container ${market.results.length < 3 ? "flex-1" : "flex-3" }`}>
                                       <div className="collapse__content__flex header">
                                        {option.name.value}
                                        </div>
                                        <div key={option.name.value} className="collapse__content__flex">
                                            {
                                                market.visibility == 'Visible'? 
                                                <button className={`betSelectionbtn`}>
                                                    {(option.odds * 10).toFixed(0)}
                                                </button>
                                                :
                                                <>{t("suspended")}</>
                                            }
                                        </div>
                                    </div>
                                })
                            }
                        </Collapse>) : null
                    })
                ) : <span className="noResults">{t("no__quiz__found")}</span>
            ))
            :
            (
                filteredResults && (
                    filteredResults.length > 0 ?
                        (filteredResults?.map((market, index) => {
                            return market.marketStatus == 'OPEN' && !Array.isArray(market.runnerDetails[0].runnerOdds) ? (<Collapse key={market.market.marketId} title={replaceCategoryName(market.market.marketName)} open={index < 4 ? true : false} columnStyle={true}>
                                {<div className="cancel-category-container">
                                    {/* <i className="fa fa-xmark" /> */}
                                    <h3>{t("enableCategory")}</h3>
                                    {
                                        risk.disabledCategory.findIndex(c => c == market.market.marketId.toString()) > -1 ?
                                        <ToggleSwitch checked={false} handleChange={() => handleCancelCategory(market.market.marketId)}  />
                                        :
                                        <ToggleSwitch checked={true} handleChange={() => handleCancelCategory(market.market.marketId)}  />
                                    }
                                    
                                    
                                </div>}
                                {
                                    market.runnerDetails.map((option, i) =>{
                                       return <div key={option.selectionId} className={`collapse__content__container ${market.runnerDetails.length < 3 ? "flex-1" : "flex-3" }`}>
                                           <div className="collapse__content__flex header">
                                            {market.market.runners[i]?.runnerName} {market.market.runners[i]?.handicap > 0 ? market.market.runners[i]?.handicap : ''}
                                            </div>
                                            <div className="collapse__content__flex">
                                                {
                                                    market.marketStatus == 'OPEN' && !Array.isArray(option.runnerOdds)? 
                                                    <button className={`betSelectionbtn`}>
                                                        {(option.runnerOdds.decimalDisplayOdds.decimalOdds * 10).toFixed(0)}
                                                    </button>
                                                    :
                                                    <>{t("suspended")}</>
                                                }
                                            </div>
                                        </div>
                                    })
                                }
                                </Collapse>) : null
                            })
                         
                    ) : <span className="noResults">{t("no__quiz__found")}</span>
                )
            )
        }
    </> 
}

const mapStateToProps = state => ({
    quizes: state.contestslip.quizes,
    risk: state.risk.risk,
    token:state.user.token
})

const mapDispatchToProps = dispatch => ({
    putNewRisk:(risk) => dispatch(putNewRisk(risk))
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminInvidualQuizPage);
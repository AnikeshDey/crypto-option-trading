import React from "react";
import { useTranslation } from 'react-i18next';

import { connect } from 'react-redux';

import QuizView from "../quiz-view/QuizView";

function QuizViewList({ results, gameType, risk }){
    const { t } = useTranslation(["common"]);
    const [formattedData, setFormattedData] = React.useState(null);
    const [property, setProperty] = React.useState(null);
    const [hidden, setHidden] = React.useState(true);
    ////console.log(results, gameType);

    React.useEffect(() => {
        if(results){
            if(gameType != "Cricket"){
                //console.log(results);
                let copyGames = {};
                results.filter(r => !risk.disabledEvents.includes(r?._id.toString().replace(':','0'))).sort(function(a, b){
                        return (new Date(a.gSD) - new Date(b.gSD))
                    
                }).forEach(result => {
                    copyGames[result.lN] ? 
                        copyGames[result.lN] = [...copyGames[result.lN], result ] 
                        : 
                        copyGames[result.lN] = [result];
                })
                
                // Object.keys(copyGames).map(key => {
                //     copyGames[key].map(data => {
                //         var marketLength;
                //         if(data.isOPM){
                //             marketLength = data.markets.length;
                //             data.markets.map(market => {
                //                 if(market.status != 'Visible' || risk.disabledCategory.includes(market.id.toString().replace(':','0')) || risk.disabledCategoryName.includes(market.name.value)){
                //                     marketLength = marketLength - 1;
                //                 }
                //             })
                //         } else{
                //             marketLength = data.markets.length;
                //             data.markets.map(market => {
                //                 if(market.visibility != 'Visible' || risk.disabledCategory.includes(market.id.toString().replace(':','0'))){
                //                     marketLength = marketLength - 1;
                //                 }
                //             })
                //         }
                //         if(marketLength < 11){
                //             copyGames[key] = copyGames[key].filter(d => d._id != data._id)
                //         }
                //     })
                //     if(copyGames[key].length < 1){
                //         delete copyGames[key];
                //     }
                // })
                //console.log(copyGames);
                setFormattedData(copyGames);
            } else{
                //console.log(results.filter(r => !risk.disabledEvents.includes(r?._id.toString().replace(':','0'))));
                let copyGames = {};
                results.filter(r => !risk.disabledEvents.includes(r?._id.toString().replace(':','0'))).sort(function(a, b){
                        return (new Date(a.gSD) - new Date(b.gSD))
                }).forEach(result => {
                    copyGames[result.lN] ? 
                        copyGames[result.lN] = [...copyGames[result.lN], result ] 
                        : 
                        copyGames[result.lN] = [result];
                })

                // Object.keys(copyGames).map(key => {
                //     copyGames[key].map(data => {
                //         var marketLength = data.markets.length;
                //         data.markets.map(market => {
                //             for(var i=0; i < market.runnerDetails.length; i++){
                //                 if(Array.isArray(market.runnerDetails[i].runnerOdds) || risk.disabledCategory.includes(market.marketId.toString()) || risk.disabledCategoryName.includes(market.market.marketName)){
                //                     marketLength = marketLength - 1;
                //                     break;
                //                 }
                //             }
                //         })
                //         if(marketLength < 11){
                //             copyGames[key] = copyGames[key].filter(d => d._id != data._id)
                //         }
                //     })
                //     if(copyGames[key].length < 1){
                //         delete copyGames[key];
                //     }
                // })
                //console.log(copyGames);
                setFormattedData(copyGames);
            }
        }   
    },[results, gameType, risk])

    // React.useEffect(() => {
    //     if(results){
    //         if(gameType != "Cricket"){
    //             if(Object.keys(formattedData).length > 0){
    //                 Object.keys(formattedData).map(key => {
    //                     formattedData[key].map(data => {
    //                         var marketLength = data.markets.length;
    //                         data.markets.map(market => {
    //                             for(var i=0; i < market.runnerDetails.length; i++){
    //                                 if(Array.isArray(market.runnerDetails[i].runnerOdds)){
    //                                     marketLength = marketLength - 1;
    //                                     break;
    //                                 }
    //                             }
    //                         })
    //                         if(marketLength < 11){
    //                             formattedData[key].filter(d => d.event.eventId == data.event.eventId)
    //                         }
    //                     })
    //                 })
    //             }
    //         } else{
                
    //         }
    //     }   
    // },[formattedData]);

    React.useEffect(() => {
        setProperty(null);
    }, [gameType]);
    

    return formattedData && results && <>
    {
        (results.length > 0 && Object.keys(formattedData).length > 0) && 
        <>
            <div className="league-name__container">
                {
                    Object.keys(formattedData).length > 6 && hidden 
                    ?
                        Object.keys(formattedData).slice(0,6).map((key,i) => {
                            return  <p key={i+key} className={`league-name__item ${property == key ? "active" : ""}`} onClick={() => setProperty(key)}>
                                {key.length > 15 ? key.slice(0,15) + "..." : key}
                            </p>
                            
                        }) 
                    :
                        Object.keys(formattedData).map((key,i) => {
                            return  <p key={i+key} className={`league-name__item ${property == key ? "active" : ""}`} onClick={() => setProperty(key)}>
                                {key.length > 15 ? key.slice(0,15) + "..." : key}
                            </p>
                            
                        }) 
                }
                <div className="league-name__btn-container">
                    {
                    Object.keys(formattedData).length > 6 && (Object.keys(formattedData).length > 6 && hidden 
                        ?
                        <button className="league-name__show-btn" onClick={() => setHidden(false)}>
                            {t("show__more")} <i className="fa fa-chevron-down" />
                        </button>
                        :
                        <button className="league-name__show-btn" onClick={() => setHidden(true)}>
                        {t("show__less")} <i className="fa fa-chevron-up" />
                        </button>)
                    }
                </div>
                
                </div>
                 
                {
                    property == null && Object.keys(formattedData).map((key,i) => {
                            return <React.Fragment key={key+i}>
                                <div className="sport__header-container">
                                    {/* <i className="fa fa-baseball sport__header__icon"></i> */}
                                    <div className="sport__league">
                                        {key}
                                    </div>
                                    {/* <div className="sport__headers">
                                        <div className="sport__header">
                                            1
                                        </div>
                                        <div className="sport__header">
                                            X
                                        </div>
                                        <div className="sport__header">
                                            2
                                        </div>
                                    </div> */}
                                </div>
                                {
                                    formattedData[key].map((data, i) => {
                                        return <QuizView key={i} 
                                        data={data} gameType={gameType} /> 
                                    }) 
                                }
                            </React.Fragment>
                        })
                }
                {
                    property &&  <React.Fragment>
                            <div className="sport__header-container">
                                {/* <i className="fa fa-baseball sport__header__icon"></i> */}
                                <div className="sport__league">
                                    {property}
                                </div>
                                {/* <div className="sport__headers">
                                    <div className="sport__header">
                                        1
                                    </div>
                                    <div className="sport__header">
                                        X
                                    </div>
                                    <div className="sport__header">
                                        2
                                    </div>
                                </div> */}
                            </div>
                            {
                                formattedData[property].map((data,i) => {
                                    return <QuizView key={i} 
                                    data={data}/> 
                                }) 
                            }
                        </React.Fragment>
                }
        </>
    }
    {
        (results.length == 0 || Object.keys(formattedData).length < 1) && <>
            <span className="noResults">{t("no__game__found__in__category")}</span>
        </>
    }
        
    </>
    // return formattedData && results && Object.keys(formattedData).map(key => {
    //     return <React.Fragment key={key}>
    //         <div className="sport__header-container">
    //             {/* <i className="fa fa-baseball sport__header__icon"></i> */}
    //             <div className="sport__league">
    //                 {key}
    //             </div>
    //             {/* <div className="sport__headers">
    //                 <div className="sport__header">
    //                     1
    //                 </div>
    //                 <div className="sport__header">
    //                     X
    //                 </div>
    //                 <div className="sport__header">
    //                     2
    //                 </div>
    //             </div> */}
    //         </div>
    //         {
    //             gameType != "precricket" ? formattedData[key].map(data => {
    //                 return <Sport key={data.Id} 
    //                 data={data} gameType={gameType} /> 
    //             }) 
    //             : 
    //             formattedData[key].map(data => {
    //                 return <PreCricket key={data.event.eventId} 
    //                 data={data} /> 
    //             })
    //         }
    //     </React.Fragment>
    // })

}

const mapStateToProps = state => ({
    risk: state.risk.risk
})

export default connect(mapStateToProps)(QuizViewList);
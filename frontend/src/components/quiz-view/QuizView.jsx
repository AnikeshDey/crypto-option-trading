import React from "react";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import getCountdown from "../../utils/getCountDown";


function QuizView({ data }) {
    const { t } = useTranslation(["common"]);
    const [eventDate, setEventDate] = React.useState(null);


    React.useLayoutEffect(() => {
        var eventCountDown = getCountdown(data.gSD);
        setEventDate(eventCountDown);
        var myInterval = setInterval(() => {
            var eventCountDown = getCountdown(data.gSD);
            setEventDate(eventCountDown);
        }, 1000)
        


        return () => {
            clearInterval(myInterval);
        }
        ////console.log(data.gN);
            
    },[data]);



    return (
        data && 
         <div className='sport-container'>
            <Link to={`/contest/${data._id}`}>
                <div className='sportContentContainer quiz-view'>
                    <div className="sportContentContainer__teams-container">
                        <div className="sportContentContainer__teams-items">
                                <i className="fa fa-shield" />
                                <p>{ 
                                    data.gN.split("v")[0]
                                }</p>
                        </div>
                        <div className="sportContentContainer__teams-items">
                                <i className="fa fa-shield" />
                                <p>
                                    { 
                                        data.gN.split("v")[1]
                                    }
                                </p>
                        </div>
                    </div>
                    <div className="sportContentContainer__btn-container">
                        <p className="sportContentContainer__btn-time">{
                            eventDate ? eventDate : "N/A"
                        }</p>
                        <button className="sportContentContainer__btn-item">{t("play")}</button>
                    </div>
                </div>
            </Link>
        </div>
        
    )
}


export default QuizView;

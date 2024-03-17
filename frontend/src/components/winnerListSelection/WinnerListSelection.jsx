import React from "react";
import { useTranslation } from 'react-i18next';


import './WinnerListSelection.css';

const WinnerItem = ({ title, value, currentPrize, totalPrize }) => {
    const { t } = useTranslation(["common"]);

    return <div className="winner-item__container">
        <div className="winner-item__single">
            {title}
        </div>
        <div className="winner-item__single">
            {value}%
        </div>
        <div className="winner-item__single">
            {((currentPrize * value)/100).toFixed(2)}
        </div>
        <div className="winner-item__single">
            {((totalPrize * value)/100).toFixed(2)}
        </div>
    </div>
}


//Currently Ongoing Bets
const WinnerListContainer = ({title, options, selectedOption, handleCheck, currentPrize, totalPrize, noSelection}) => {
    
    const { t } = useTranslation(["common"]);

    return <div className="winner-list__container">
        
        <div className="winner-list__header__container">
            <div className="winner-list__title">
                {title} {t("winners")}
            </div>
            {noSelection != true && <div className="winner-list__checkbox">
                <input className="form-check-input" type="checkbox" id="defaultCheck1" onChange={(e) => handleCheck(e,title)} checked={title == selectedOption ? true : false } />
            </div>}
        </div>

        <div className="winner-list__body__container">
            <div className="winner-item__container">
                <div className="winner-item__title">
                    {t("rk")} 
                </div>
                <div className="winner-item__title">
                    {t("percentage")}
                </div>
                <div className="winner-item__title">
                {t("cur__pool")}
                </div>
                <div className="winner-item__title">
                {t("total__pool")}
                </div>
            </div>
            {
                 Object.keys(options).map(t =>{
                    return <WinnerItem key={t} title={t} value={options[t]} currentPrize={parseInt(currentPrize)} totalPrize={parseInt(totalPrize)} />
                })
            }
        </div>
    </div>
}


export default WinnerListContainer;
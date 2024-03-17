import React from "react";
import { useTranslation } from 'react-i18next';

import { ReactComponent as ShowIcon } from '../../assets/showchart.svg';
import { ReactComponent as HideIcon } from '../../assets/hidechart.svg';



import "./CryptoPriceHeader.css";


function CryptoPriceHeader({ id, title, fullName, price, price_change, per, showChart, handleChart }) {
    //console.log(game);
    const { t } = useTranslation(["common"]);

    return <div className="crypto-price-header__container">
        <div className="crypto-price-header__name-container">
            <img className="crypto-price-header__name-img" src={`${process.env.REACT_APP_URL_LINK}/images/coins/small/${id}`} alt={`${fullName}`} />
            <div className="crypto-price-header__name-wrapper">
                <h1 className="crypto-price-header__name-title">{title}</h1>
                <p className="crypto-price-header__name-para">{fullName} / TetherUs</p>
            </div>
        </div>
        <div className="crypto-price-header__price-container">
            <div className="crypto-price-header__price-value">
                <h1>{price}</h1>
            </div>
            <div className="crypto-price-header__price-per">
                <h1 className={Number(price_change) > 0 ? "green" : "red"}>{per}% ({price_change})</h1>
            </div>
        </div>
        <button className="crypto-price-header__chart-btn" onClick={handleChart}>
            {showChart ? <HideIcon /> : <ShowIcon />}        
        </button>
    </div>
}


  
  
export default CryptoPriceHeader;
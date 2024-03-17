import React from "react";
import { useTranslation } from 'react-i18next';
// import { connect } from "react-redux";


import "./cryptoQuizHeader.css";

function CryptoQuizHeader({ contest, eventType, countDown, price, change }) {
    const { t } = useTranslation(["common"]);

    return <><div className="cryptoQuizHeader__container">
        <div className="cryptoQuizHeader__item">
            {eventType}
        </div>
        <div className="cryptoQuizHeader__item time">
            {countDown}
        </div>
        <div className="cryptoQuizHeader__item">
            {price} {`(${parseFloat(change).toFixed(2)})`}
        </div>
    </div>
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
    </>
}

  
  
export default CryptoQuizHeader;

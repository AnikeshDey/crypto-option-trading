import React from "react";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ReactComponent as USDTIcon } from '../../assets/usdt.svg';


import numFormatter from "../../utils/numFormatter";


import "./CryptoView.css";


function CryptoView({ data }) {
    const { t } = useTranslation(["common"]);
    //console.log("data:",data);


    return (
        data && 
         <div className='sport-container'>
            <Link to={`/crypto-contest/${data.id}`}>
                <div className='sportContentContainer quiz-view'>
                    <div className="sportContentContainer__teams-container">
                        <div className="sportContentContainer__teams-items">
                                <img src={`${process.env.REACT_APP_URL_LINK}/images/coins/small/${data.id}`} />
                                <p>
                                    { 
                                        data.nM?.toUpperCase()
                                    }
                                </p>
                        </div>
                        <div className="sportContentContainer__teams-items">
                                <USDTIcon />
                                <p>
                                    {
                                        data.tG?.toUpperCase()
                                    }
                                </p>
                        </div>
                    </div>
                    <div className="sportContentContainer__vol-container">
                        <h2 className="sportContentContainer__vol__text">
                                    Vol
                        </h2>
                        <p className="sportContentContainer__vol__value">
                            {
                                numFormatter(data.vol)
                            }
                        </p>
                    </div>

                    <div className="sportContentContainer__btn-container">
                        <p className={`sportContentContainer__btn-time`}>
                            {data.pR} <span className={Number(data.pRc) > 0 ? "green" : "red"}>({data.pRcP}%)</span>
                        </p>
                        <button className="sportContentContainer__btn-item">{t("play")}</button>
                    </div>
                </div>
            </Link>
        </div> 
    )
}


export default CryptoView;

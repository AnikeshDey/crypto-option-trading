import React from "react";
import { useTranslation } from 'react-i18next';


function ContestHeader({ game, admin }) {
    // console.log(game);
    const { t } = useTranslation(["common"]);

    return <div className="contest-header__container">
        <h2 className="contest-header__league">{
          game.nM
        }</h2>
        <h2 className="contest-header__team">
         { game.tG.toUpperCase() }
        </h2>
        <h2 className={`contest-header__time ${Number(game.pRc) > 0 ? "green" : "red"}`}>
         { game.pR } {game.pRcP && `(${game.pRcP}%)`}
        </h2>
    </div>
}


  
  
export default ContestHeader;

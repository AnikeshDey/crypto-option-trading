import * as React from "react";
import { useTranslation } from 'react-i18next';
import { useParams } from "react-router-dom";
import { connect } from "react-redux";

import { setPageType } from '../../redux/page/page.actions';

import MainLayout from '../../layouts/main-layout.component';
import IndividualCryptoContestPage from '../../pages/individualCryptoContestPage/individualCryptoContest';
import Loader from "../../components/loader/Loader";

// import getCountdown from "../../utils/getCountDown";

import { useSocket } from "../../socket/socket";


function ContestPage({ user, token, games, setPageType }) {
    const { t } = useTranslation(["common"]);
    const [isFetching, setIsFetching] = React.useState(true);
    const [game, setGame] = React.useState(null);
    useSocket();

    const gameId = useParams().id; 

    // const getGame = (gameId) => {
    //     // if (games != null) {
    //     //   var foundGame = games.find(game => game.Id == gameId);
    //     //   if(foundGame != null){
    //     //       return [foundGame, 'game'];
    //     //   } else{
    //           if(pregames != null){
    //               var foundGame = pregames.find(game => game.Id == gameId);
    //               if(foundGame != null){
    //                 return [foundGame, 'pregame'];
    //               } else{
    //                 if(precricketgames != null){
    //                     foundGame = precricketgames.find(game => game.event.eventId == gameId);
    //                     ////console.log()
    //                     if(foundGame != null){
    //                       return [foundGame, 'precricket'];
    //                     } else{
    //                         return [null, null];
    //                     }
    //                 } else{
    //                     return [null, null];
    //                 }
    //               }
    //           } else{
    //               return [null, null];
    //           }
    //       //}
    //     // } else {
    //     //   return [null, null];
    //     // }
    // }

    React.useLayoutEffect(() => {
        setPageType('crypto');
      },[]);


    React.useEffect(() => {
        //console.log("games:",games);
        var foundGame = games.find(el => el.id == gameId);
        if(foundGame){
            setGame(foundGame);
        }
        setIsFetching(false);

    },[gameId, games])

  return (
      	<MainLayout goBack={true} title={
            <div className="title">
                <h2>{t("contests__list")}</h2>
            </div>
          }>
            <div className="resultsContainer">
                {
                    isFetching && <Loader />
                }
                
                {
                    user && !game && !isFetching && <span className="noResults">{t("no__game__found__ended")}</span>
                }
                
                {
                    user && game && <IndividualCryptoContestPage game={game} />
                }
            </div>
      	</MainLayout>
  );
}

const mapStateToProps = state => ({
    user: state.user.user,
    token: state.user.token,
    games:state.cryptoGame.games
})

const mapDispatchToProps = dispatch => ({
    setPageType: (pageType) => dispatch(setPageType(pageType))
})
  
  
export default connect(mapStateToProps, mapDispatchToProps)(ContestPage);
  
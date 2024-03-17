import * as React from "react";
import { useTranslation } from 'react-i18next';
import { useParams } from "react-router-dom";
import { connect } from "react-redux";

import { setPageType } from '../../redux/page/page.actions';

import MainLayout from '../../layouts/main-layout.component';
import AdminIndividualQuizPage from '../adminIndividualQuizPage/adminIndividualQuizPage';
import Loader from "../../components/loader/Loader";

import { useSocket } from "../../socket/socket";


function AdminQuizPage({ user, token, setPageType }) {
    const { t } = useTranslation(["common"]);
    const [isFetching, setIsFetching] = React.useState(true);
    const [game, setGame] = React.useState(null);
    //const [gameType, setGameType] = React.useState(null);
    useSocket();

    const gameId = useParams().gameId;

    React.useLayoutEffect(() => {
        setPageType('quiz');
      },[]);


    React.useEffect(() => {
        ////console.log(pageNumber);
        if(gameId){
            var url = `${process.env.REACT_APP_URL_LINK}/api/events/get-single-event/${gameId}`;
            
            async function getData(url = '') {
                // Default options are marked with *
                const response = await fetch(url, {
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                headers: {
                    'Authorization': 'Bearer ' + token,
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                }
                // body data type must match "Content-Type" header
                    });
                    return response.json(); // parses JSON response into native JavaScript objects
            }
            //setNewPostLoading(true);
            //setIsApiFetching(true)
            getData(url)
            .then(data => {
                //console.log(data);
                setGame(data);
                setIsFetching(false);
            }).catch(err => {
                //console.log(err)
            });
        }

    },[gameId])

  return (
      	<MainLayout goBack={true} title={
            <div className="title">
                <h2>
                    {t("quiz__page")}
                </h2>
            </div>
          }>
            <div className="resultsContainer">
                {
                    // isFetching && ((!game && contest) || (game && !contest) || (!game && !contest)) && <span className="noResults">Fetching Results Please Wait...</span>
                }

                {
                    user && isFetching && <Loader />
                }
                
                {
                    user && !game  && !isFetching && <span className="noResults">{t("no__game__found__ended")}</span>
                }
                
                {
                    user && game && <AdminIndividualQuizPage game={game} />
                }
            </div>
      	</MainLayout>
  );
}

const mapStateToProps = state => ({
    user: state.user.user,
    token: state.user.token
})

const mapDispatchToProps = dispatch => ({
    setPageType: (pageType) => dispatch(setPageType(pageType))
})
  
  
export default connect(mapStateToProps, mapDispatchToProps)(AdminQuizPage);
  
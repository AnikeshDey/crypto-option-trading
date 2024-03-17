import * as React from "react";
import { connect } from "react-redux";

import { useParams, useNavigate } from "react-router-dom";

import { setPageType } from '../../redux/page/page.actions';

import MainLayout from '../../layouts/main-layout.component';
import CryptoView from "../../components/crypto-view/CryptoView";
import Loader from "../../components/loader/Loader";
//import BetSlip from "../../components/betslip/BetSlip";

import { useSocket } from "../../socket/socket";

//"Cricket"

function CryptoOverview({ user, token, games, setPageType }) {
    const [isLoading, setLoading] = React.useState(false);
    const [ notFound, setNotFound ] = React.useState(true);
    

    const navigate = useNavigate();
    
    useSocket();

    React.useLayoutEffect(() => {
        setPageType('crypto');
        //console.log(games);
    },[]);

    // React.useEffect(() => {
    //     if(user){
    //         var url = `${process.env.REACT_APP_URL_LINK}/api/crypto/get-crypto-options`;
            
    //             async function getData(url = '') {
    //                 // Default options are marked with *
    //                 const response = await fetch(url, {
    //                 method: 'GET', // *GET, POST, PUT, DELETE, etc.
    //                 mode: 'cors', // no-cors, *cors, same-origin
    //                 headers: {
    //                     'Authorization': 'Bearer ' + token,
    //                     // 'Content-Type': 'application/x-www-form-urlencoded',
    //                 }
    //                 // body data type must match "Content-Type" header
    //                     });
    //                     return response.json(); // parses JSON response into native JavaScript objects
    //             }
    //             setLoading(true);
    //             getData(url)
    //             .then(data => {
    //                 console.log("data:", data);
    //                 // let copyGames = {};
    //                 // data.forEach(result => {
    //                 //     copyGames[result.sN] ? 
    //                 //         copyGames[result.sN] = [...copyGames[result.sN], result ] 
    //                 //         : 
    //                 //         copyGames[result.sN] = [result];
    //                 // })
    //                 ////console.log(copyGames);
    //                 //copyGames['Cricket'] = cricketgames;
    //                 setData(data);
    //                 setNotFound(false)
    //                 setLoading(false);
    //                 // setFormattedData(copyGames);
    //             }).catch(err => {
    //                 //console.log(err)
    //             });
    //             // let copyGames = {};
    //             // pregames.forEach(result => {
    //             //     copyGames[result.SportName] ? 
    //             //         copyGames[result.SportName] = [...copyGames[result.SportName], result ] 
    //             //         : 
    //             //         copyGames[result.SportName] = [result];
    //             // })
    //             // ////console.log(copyGames);
    //             // copyGames['Cricket'] = cricketgames;
    //             // setNotFound(false)
    //             // setFormattedData(copyGames);
    //             // setSportsData(pregames);
    //     }
    // },[user, token])

  return (
      	<MainLayout>
            <div className="resultsContainer">
                {
                    games.length < 1 && <Loader />
                }

                {
                    user && games && games.map(el => (
                        <CryptoView 
                            key={el.id}
                            data={el}
                        />
                    ))
                }
                {/* {bets.length > 0 && <BetSlip />} */}
                
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
 

export default connect(mapStateToProps, mapDispatchToProps)(CryptoOverview);
import { useEffect, Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from 'axios';
import { connect } from 'react-redux';


import { setNewGames, updateGamePrice } from "./redux/cryptoGame/cryptoGame.actions";

import { putNewRisk } from './redux/riskManagement/riskManagement.actions';
import { setUserWallet, userLogin, userLogout } from './redux/user/user.actions';


import { useSocket, isSocketConnected, socket } from './socket/socket';


const HomePage = lazy(() => import('./pages/home/home.component'));
const IndividualCryptoContestPage = lazy(() => import("./pages/cryptoContest/cryptoContest"));
const IndividualCryptoQuiz = lazy(() => import("./pages/individualCryptoQuiz/individualCryptoQuiz"));
const CryptoOverview = lazy(() => import("./pages/cryptoOverview/cryptoOverview"));
const MyTransaction = lazy(() => import("./pages/myTransaction/myTransaction"));
const ActiveContest = lazy(() => import("./pages/activeContest/ActiveContest"));
const EndedContest = lazy(() => import("./pages/endedContest/EndedContest"));
const UserHistory = lazy(() => import("./pages/userHistory/userHistory"));
const UserStats = lazy(() => import("./pages/userStats/userStats"));
const UserWallet = lazy(() => import("./pages/userWallet/userWallet"));
const AddBalance = lazy(() => import("./pages/addBalance/addBalance"));
const WithdrawBalance = lazy(() => import("./pages/withdrawBalance/withdrawBalance"));
const TransferBalance = lazy(() => import("./pages/transferBalance/transferBalance"));
const EditContest = lazy(() => import("./pages/editContest/EditContest"));
const IndividualMyContest = lazy(() => import("./pages/individualMyContest/IndividualMyContest"));
const AdminIndividualMyContest = lazy(() => import("./pages/adminIndividualMyContest/AdminIndividualMyContest"));
const AdminIndividualContest = lazy(() => import("./pages/adminInvidualContest/AdminIndividualContest"));
const HistoryContestPage = lazy(() => import("./pages/historyContestPage/HistoryContestPage"));
const MyAdmin = lazy(() => import("./pages/myAdmin/MyAdmin"));
const SingleTransaction = lazy(() => import("./pages/singleTransaction/singleTransaction"));
const SettingsPage = lazy(() => import("./pages/SettingsPage/SettingsPage"));


function App({ user, token, games, setNewGames, updateGamePrice, putNewRisk, setUserWallet, userLogin, userLogout }) {


  useSocket();
  
  const queryParameters = new URLSearchParams(window.location.search)
  const un = queryParameters.get("un");
  
  useEffect(() => {
	 if (!un && !user && !token){
		 userLogout()
		 window.location.assign("https://csocial.websiteclubs.com/login");
	 }  else {
		const username = un ? un : user.username;
		const type = un ? true : false;
		  console.log(username);
		  async function postData(url = '') {
			// Default options are marked with *
			const response = await fetch(url, {
			  method: 'POST', // *GET, POST, PUT, DELETE, etc.
			  mode: 'cors', // no-cors, *cors, same-origin
			  headers: {
				'Content-Type': 'application/json',
			  },
				body:JSON.stringify({un:username, type: type})
			  // body data type must match "Content-Type" header
			});
			return response.json(); // parses JSON response into native JavaScript objects
		  }

      /*
		  postData(`https://social.websiteclubs.com/fetch/user`)
			.then(data => {
				
				console.log("user data from backend:", data);
				//window.location.assign("https://csocial.websiteclubs.com/menu");
				if(data && data.token){
					userLogin(data, data.token);
				} else {
					userLogout()
					window.location.assign("https://csocial.websiteclubs.com/login");
				}
				
			  //setUserWallet(data.wallet);

			}).catch(err => {
			  //console.log(err)
			});
      */
	 }
	 
  }, [un]);

  const getData = async () => {
    const res = await axios.get('https://geolocation-db.com/json/')
    //console.log(res.data);
    //alert(res.data)
  }

  useEffect(() => {
    if (user) {
      async function postData(url = '') {
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

      postData(`${process.env.REACT_APP_URL_LINK}/api/users/gaming-wallet`)
        .then(data => {
		      console.log("wallet-data:", data);

          setUserWallet(data.wallet);

        }).catch(err => {
          //console.log(err)
        });
    }
  }, [user, token])

  useEffect(() => {
    ////console.log(token);
    if(user && isSocketConnected){
        socket.off("get risk data").on("get risk data", (data) => {
          if (data != null) {
            //console.log("Risk data came");
            var parsedData = JSON.parse(data);
            console.log(parsedData);
            putNewRisk(parsedData);
          } else {
            //console.log("risk data came but null");
          }
        })
		
		socket.off("user-logout").on("user-logout", (userId) => {
		  console.log("logout req came..............", userId);
		
          if(user.handleUn == userId){
			  userLogout()
			  window.location.assign("https://csocial.websiteclubs.com/login");
		  }
        })
    }

  },[token,user])

  useEffect(() => {
    if (user && isSocketConnected) {
      socket.emit('get crypto data');
      //console.log("cricket data")
      socket.off("get crypto data").on("get crypto data", (data) => {
        //console.log("data came:", data);
        if (data != null) {

          setNewGames(data);
          //console.log("crypto data:", data);

        } else {
          //console.log("came but null");
        }
      })

      socket.off("get latest price").on("get latest price", (data) => {
        console.log("price data came");
        if (data != null) {
          // data.forEach((el) => {
            updateGamePrice(data);
          // })
        } else {
          //console.log("came but null");
        }
      })
    }
  }, [user, token])


  return (
        <Suspense fallback={"Loading..."}>
          <Routes>
            <Route path="/" element={<HomePage />} />
           
            <Route path="/edit-contest/:id" element={user ? <EditContest /> : <Navigate to="/login" replace />} />
            <Route path="/crypto-contest/:id" element={user ? <IndividualCryptoContestPage /> : <Navigate to="/login" replace />} />
            <Route path="/crypto-quiz/:id" element={user ? <IndividualCryptoQuiz /> : <Navigate to="/login" replace />} />
            <Route path="/crypto-overview" element={user ? <CryptoOverview /> : <Navigate to="/login" replace />} />
            <Route path="/my-active-contest" element={user ? <ActiveContest /> : <Navigate to="/login" replace />} />
            <Route path="/my-ended-contest" element={user ? <EndedContest /> : <Navigate to="/login" replace />} />
            <Route path="/my-history-contest" element={user ? <UserHistory /> : <Navigate to="/login" replace />} />
            <Route path="/my-stats" element={user ? <UserStats /> : <Navigate to="/login" replace />} />
            <Route path="/my-wallet" element={user ? <UserWallet /> : <Navigate to="/login" replace />} />
            <Route path="/my-transaction/:type" element={user ? <MyTransaction /> : <Navigate to="/login" replace />} />
            <Route path="/single-transaction/:id/:type" element={user ? <SingleTransaction /> : <Navigate to="/login" replace />} />
            <Route path="/add-balance" element={user ? <AddBalance /> : <Navigate to="/login" replace />} />
            <Route path="/withdraw-balance" element={user ? <WithdrawBalance /> : <Navigate to="/login" replace />} />
            <Route path="/transfer-balance" element={user ? <TransferBalance /> : <Navigate to="/login" replace />} />
            <Route path="/my-quiz/:contestId" element={user ? <IndividualMyContest /> : <Navigate to="/login" replace />} />
            <Route path="/admin-my-quiz/:contestId" element={user ? <AdminIndividualMyContest /> : <Navigate to="/login" replace />} />
            <Route path="/history-contest/:contestId/:setId" element={user ? <HistoryContestPage /> : <Navigate to="/login" replace />} />
            <Route path="/admin-quiz/:id" element={user ? <AdminIndividualContest /> : <Navigate to="/login" replace />} />
            <Route path="/my-admin" element={user ? <MyAdmin /> : <Navigate to="/login" replace />} />
            <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/login" replace />} />
          </Routes>

        </Suspense> 
  );
}

// navigate("/admin-quiz/"+id)

const mapStateToProps = state => ({
  user: state.user.user,
  token: state.user.token,
  games:state.cryptoGame.games
})

const mapDispatchToProps = dispatch => ({
  putNewRisk: (risk) => dispatch(putNewRisk(risk)),
  setUserWallet: (wallet) => dispatch(setUserWallet(wallet)),
  setNewGames: (games) => dispatch(setNewGames(games)),
  updateGamePrice:(id, price, price_change, last) => dispatch(updateGamePrice(id, price, price_change, last)),
  userLogin: (user, token) => dispatch(userLogin(user, token)),
  userLogout: () => dispatch(userLogout())
})


export default connect(mapStateToProps, mapDispatchToProps)(App);

import * as React from "react";
import { useTranslation } from 'react-i18next';
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setPageType } from '../../redux/page/page.actions';


import MainLayout from '../../layouts/main-layout.component';
import Loader from "../../components/loader/Loader";

import { useSocket } from "../../socket/socket";
import { putNewRisk } from '../../redux/riskManagement/riskManagement.actions';

//{`/admin-quiz/${eventId}/${eventDate}`}

const AdminContestView = ({eventName, eventId, eventPrice, eventPriceChange, status, token, putNewRisk }) => {


    const navigate = useNavigate();


    const handleClick = (e) => {
        navigate(`/admin-quiz/${eventId}`)
    }

    return <div className="adminContestView__container" onClick={handleClick}>
        <div id="btn__container">
            {/* <i className="fa fa-pen-to-square edit-btn" id="edit-btn" /> */}
            {/* {!isLoading ? <i className={`fa fa-circle-xmark edit-btn ${disabledEvent == "active" ? "" : (disabledEvent == "cancelled" ? "active" : "") }`} id="disable-btn" /> : <p className="text-small">wait</p>} */}
        </div>
        
        <div className="adminContestView__column">
            <div className="adminContestView__item">
                {eventName}
            </div>
            <div className="adminContestView__item">
                {eventId} 
            </div>
        </div>
        <div className="adminContestView__column">
            <div className="adminContestView__item">
                {eventPrice}
            </div>
            <div className="adminContestView__item">
                ({eventPriceChange})
            </div>
            {/* <div className="adminContestView__item">
                {getCountdown(eventDate)} <br />
                <span>{calcTime(new Date().getTimezoneOffset(),eventDate)}</span>
                <span>{new Date(eventDate).toDateString()}</span>
            </div> */}
        </div>
    </div>
}



function MyAdmin({ token, games, setPageType, putNewRisk }) {
    const { t } = useTranslation(["common"]);
    // const [totalContests, setTotalContests] = React.useState(null);
    // const [isLoading, setLoading] = React.useState(true);
    // const [joinedContests, setJoinedContests] = React.useState(null);
    // const [fData, setFData] = React.useState(null);
    // const [tab, setTab] = React.useState('active');

    // const handleTabChange = (e) =>{
    //     var selectedTab = e.target.dataset.tab;
    //     //console.log(selectedTab);
    //     setTab(selectedTab);
    // }
    
    
    useSocket();

    React.useLayoutEffect(() => {
        setPageType('crypto');
    },[]);

//     React.useEffect(() => {
//         var url = `${process.env.REACT_APP_URL_LINK}/api/crypto/get-crypto-options`;
//         //var url = `http://localhost:5000/api/quiz/active-contest`;
//         // Example POST method implementation:
//         async function putData(url = '') {
//             // Default options are marked with *
//             const response = await fetch(url, {
//             method: 'GET', // *GET, POST, PUT, DELETE, etc. // include, *same-origin, omit
//             headers: {
//             'Authorization': 'Bearer ' + token
//             // 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//             mode: 'cors'
//         });
//         return response.json(); // parses JSON response into native JavaScript objects
//         }
        
//         putData(url)
//         .then(data => {
//             console.log(data);


//             // var totalQuizes = [];

//             // data.data.forEach(contestslip => {
//             //     var foundIndex = totalQuizes.findIndex(t => t._id == contestslip.cId._id);
//             //     if(foundIndex < 0){
//             //         totalQuizes.push(contestslip.cId);
//             //     }
//             // })
//             //setJoinedContests(data.joinedContests);
//             setTotalContests(data);	
//         }).catch(err => {
//             //console.log(err)
//         });
//   },[]);

//   React.useEffect(() => {
//     if(totalContests){
//         // var copyContests = {};

//         //     totalContests.forEach(contestslip => {
//         //         if(contestslip.gameName in copyContests){
//         //             //console.log("already there");
//         //         } else{
//         //             copyContests[contestslip.gameName] = [contestslip];
//         //         }
//         //     })
//         //     setFData(copyContests);

//             var allContests = {};
//             var filteredContests;
//             if(tab == "active"){
//                 filteredContests = totalContests.filter(contest => new Date(contest.gSD) > new Date())
//             } else if(tab == "joined"){
//                 filteredContests = totalContests.filter(contest => (joinedContests.includes(contest._id)))
//             } else{
//                 filteredContests = totalContests.filter(contest => (new Date(contest.gSD) < new Date() && !joinedContests.includes(contest._id)))
//             }

//             filteredContests.forEach(contestslip => {
//                 if(contestslip.sN in allContests){
//                     allContests[contestslip.sN] = [...allContests[contestslip.sN], contestslip]
//                 } else{
//                     allContests[contestslip.sN] = [contestslip];
//                 }
//             })
//             setFData(allContests);
//     }
//   },[totalContests, tab]);

  
    // React.useEffect(() => {
    //     if(games){
    //         setTotalContests([...games]);
    //         // setLoading(false)	
    //     }
    // },[games]);
    


  return (
      	<MainLayout>
            <div className="resultsContainer">
                {
                    (!games || games.length < 1) && <Loader />
                }
                {
                    // totalContests?.length < 1 && <span className="noResults">{t("no__contest__found")}</span>
                }
                {
                    games && games.map(item => {
                        return <AdminContestView 
                            key={item.id}
                            eventName={item.nM}
                            eventId={item.id}
                            eventPrice={item.pR}
                            eventPriceChange={item.vol}
                            token={token}
                            putNewRisk={putNewRisk}
                        />
                    })
                }
                {
                    // newPostLoading && <span className="noResults">Loading more...</span>
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
    setPageType: (pageType) => dispatch(setPageType(pageType)),
    putNewRisk: (risk) => dispatch(putNewRisk(risk))
})
 

export default connect(mapStateToProps, mapDispatchToProps)(MyAdmin);

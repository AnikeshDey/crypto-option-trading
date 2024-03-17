import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Modal from "../modal/Modal";
//import SingleQuiz from "../singleQuiz/SingleQuiz";



const ContestSlipTableContainer = ({ slipId, points, rk, status, profileImg, username, cc, mySlip, token, history, isSettled, gId, cId, gSD }) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [quizzes, setQuizzes] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    // React.useEffect(() => {
        
    //     var url = `${process.env.REACT_APP_URL_LINK}/api/quiz/slip-quizzes/${slipId}?history=${history ? true : false}`;
    //     // Example POST method implementation:
    //     async function putData(url = '') {
    //         // Default options are marked with *
    //         const response = await fetch(url, {
    //         method: 'GET', // *GET, POST, PUT, DELETE, etc. // include, *same-origin, omit
    //         headers: {
    //         'Authorization': 'Bearer ' + token
    //         // 'Content-Type': 'application/x-www-form-urlencoded',
    //         },
    //         mode: 'cors'
    //     });
    //     return response.json(); // parses JSON response into native JavaScript objects
    //     }
    //     setIsLoading(true)
    //     ////console.log("history", url);
    //     putData(url)
    //     .then(data => {
    //         ////console.log(data);
    //         setIsLoading(false);
    //         setQuizzes(data.allQuizzes);	
    //     }).catch(err => {
    //         //console.log(err)
    //     });
    // },[token]);



    return <>
    <div className={`contestslip__table__container ${mySlip ? "mySlip" : ""}`}>
        
        <Link to={`/profile/${username}`} className="contestslip__table__team">
            <img src={`${profileImg}`} alt="User's profile" />
            <h2>{username}(Q{cc})</h2>    
        </Link>
        <div className="contestslip__table__point">
            {parseFloat(points).toFixed(2)}
        </div>
        <div className="contestslip__table__rk">
            {rk}
        </div>  
        {isSettled == "true" ? <div className="contestslip__table__status">
           {Number(status) > 0 && <i className={`fa fa-trophy ${rk == 1 ? "red" : "blue"}`} />} &nbsp; {status}
        </div> : 
        <div className="contestslip__table__status" data-tab="--">
            {"--"}
        </div>
        }
        {
            mySlip && new Date().getTime() < new Date(new Date(gSD).getTime() - ( 5 * 60 * 1000)).getTime() && <Link to={`/quiz/${gId}/${cId}?edit=true&slipId=${slipId}`}>
                <i className="fa fa-pen-to-square"></i>
            </Link>
        }
    </div></>
}


const mapStateToProps = state => ({
    token: state.user.token
})

export default connect(mapStateToProps)(ContestSlipTableContainer);

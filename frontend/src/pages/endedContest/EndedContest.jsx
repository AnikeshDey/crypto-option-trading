import * as React from "react";
import { useTranslation } from 'react-i18next';
import { connect } from "react-redux";

//import { setOddType } from "../../redux/oddType/oddType.actions";
import { setPageType } from '../../redux/page/page.actions';

import MainLayout from '../../layouts/main-layout.component';
import Contest from "../../components/contest/Contest";
import Loader from "../../components/loader/Loader";

import { useSocket } from "../../socket/socket";
import { Link } from "react-router-dom";



function EndedContest({ user, token, setPageType }) {
    const [totalContests, setTotalContests] = React.useState(null);
    const [fData, setFData] = React.useState(null);
    const [pageNumber, setPageNumber] = React.useState(1);
    const { t } = useTranslation(["common"]);
    
    
    useSocket();

    React.useLayoutEffect(() => {
        setPageType('crypto');
    },[]);

    React.useEffect(() => {
        var url = `${process.env.REACT_APP_URL_LINK}/api/quiz/ended-contest?page=${pageNumber}`;
        // Example POST method implementation:
        async function putData(url = '') {
            // Default options are marked with *
            const response = await fetch(url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc. // include, *same-origin, omit
            headers: {
            'Authorization': 'Bearer ' + token
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            mode: 'cors'
        });
        return response.json(); // parses JSON response into native JavaScript objects
        }
        
        putData(url)
        .then(data => {
            if(pageNumber == 1){
                setTotalContests(data.data);
            } else {
                setTotalContests(prev => [...prev,...data.data]);
            }
        }).catch(err => {
            //console.log(err)
        });
  },[]);

  React.useEffect(() => {
    if(totalContests){
        var copyContests = {};

            totalContests.forEach(contestslip => {
                if(contestslip.gameName in copyContests){
                    copyContests[contestslip.gameName] = [...copyContests[contestslip.gameName], contestslip]
                } else{
                    copyContests[contestslip.gameName] = [contestslip];
                }
            })
            setFData(copyContests);
    }
  },[totalContests]);

    const handleScroll = (e) => {
        // //console.log("top:",e.target.documentElement.scrollTop);
        // //console.log("window:", window.innerHeight);
        // //console.log("height:",e.target.documentElement.scrollHeight);

        if((e.target.documentElement.scrollTop + window.innerHeight + 1) >= e.target.documentElement.scrollHeight){
            setPageNumber(pageNumber + 1);
        }

    }   


    React.useEffect(() => {
        window.addEventListener("scroll", handleScroll)

        return () => window.removeEventListener("scroll", handleScroll);
    },[]);
    
    


  return (
      	<MainLayout>
            <div className="resultsContainer">
                <div className="resultsContainer__header">
                        <h2 className="resultsContainer__title">{t("ended__contest__header")}</h2>
                        <Link to={'/my-history-contest'} className="resultsContainer__history__button">
                           <i className="fa fa-clock-rotate-left" /> {t("view__history")}
                        </Link>
                </div>
                {
                    !fData && <Loader />
                }
                {
                    fData && Object.keys(fData).length < 1 && <span className="noResults">{t("no__contest__found")}</span>
                }
                {
                    fData && Object.keys(fData).map(k => {
                        return <div key={k}>
                            <div className="sport__header-container">
                                <div className="sport__league">
                                    {k}
                                </div>
                            </div>
                            {
                                fData[k].map(item => {
                                    return <Contest key={item._id} data={item} myContest={true} />
                                })
                            }
                            
                        </div>
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
    token: state.user.token
})

const mapDispatchToProps = dispatch => ({
    setPageType: (pageType) => dispatch(setPageType(pageType))
})
 

export default connect(mapStateToProps, mapDispatchToProps)(EndedContest);

import React from "react";
import { useTranslation } from 'react-i18next';
import { connect } from "react-redux";
import { useParams } from "react-router-dom";

import WinnerListContainer from "../../components/winnerListSelection/WinnerListSelection";
import Contest from "../../components/contest/Contest";
import MainLayout from "../../layouts/main-layout.component";
import Loader from "../../components/loader/Loader";
import Modal from "../../components/modal/Modal";



function AdminIndividualContestPage({ games, user, token, risk }){
    
    const { t } = useTranslation(["common"]);
    const [isContestFormOpen, setContestFormOpen] = React.useState(false);
    const [nextPage, setNextPage] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isButtonLoading, setIsButtonLoading] = React.useState(false);
    const [contestComm, setContestComm] = React.useState(risk.quizComm ? risk.quizComm : null);
    const [winnersList, setWinnersList] = React.useState(risk.winnersList ? risk.winnersList : null);
    const [contests, setContests] = React.useState(null);
    const [winnerSelection, setWinnerSelection] = React.useState("");
    const [formData, setFormData] = React.useState({
        contestName: "",
        contestDesc: "",
        contestPrize: "",
        contestMemberCount: ""
    });
    const [contestEntryFee, setContestEntryFee] = React.useState(0);
    const [minPrize, setMinPrize] = React.useState(risk.quizMinPool ? risk.quizMinPool : null);
    const [maxPrize, setMaxPrize] = React.useState(risk.quizMaxPool ? risk.quizMaxPool : null);
    const [minMemberCount, setMinMemberCount] = React.useState(risk.quizMinParticipants ? risk.quizMinParticipants : null);
    const [maxMemberCount, setMaxMemberCount] = React.useState(risk.quizMaxParticipants ? risk.quizMaxParticipants : null);
    const [isInvalid, setIsInvalid] = React.useState(true);
    const [searchValue, setSearchValue] = React.useState("");
    const [property, setProperty] = React.useState("joined");
    const [newPostLoading, setNewPostLoading] = React.useState(false);
    const [type, setType] = React.useState(-1);
    const [pageNumber, setPageNumber] = React.useState(1);
    
    const [game, setGame] = React.useState(null)
    const [stats, setStats] = React.useState(null)
    const [tab, setTab] = React.useState('active');
    const [errorMessage, setErrorMessage] = React.useState(null);
	const [isSettleModalOpen, setSettleModalOpen] = React.useState(false);
	
	const [isRevertSettleModalOpen, setRevertSettleModalOpen] = React.useState(false);

    const [timeStamp, setTimeStamp] = React.useState(Object.keys(risk.defaults)[0]);

    React.useEffect(() => {
        setMaxMemberCount(risk.defaults[timeStamp].maxU);
        // console.log("timeStamp:", timeStamp);
    },[timeStamp]);


    var gameId = useParams().id;

    React.useEffect(() => {
        if(games){
            var foundGame = games.find(el => el.id == gameId);
            setGame(foundGame);
        }
    },[gameId, games]);

    const handleTabChange = () =>{
        tab === 'active' ? setTab('ended') : setTab('active');
      }


    const handleInputChange = (e) => {
        setFormData(prevForm => {
            return {
                ...prevForm,
                [e.target.name]:e.target.value 
            }
        })
    }

    const handleNext = () => {
        setContestFormOpen(false);
        setNextPage(true);
    }

    const handleSearchInputChange = (e) => {
        setSearchValue(e.target.value)
    }

    const handleBack = () => {
        if(nextPage){
            
            setNextPage(false);
            setContestFormOpen(true);
        } else{
            setWinnerSelection("");
            setFormData({
                contestName: "",
                contestDesc: "",
                contestPrize: "",
                contestMemberCount: ""
            })


            setContestFormOpen(false)
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
		// Example POST method implementation:
		async function postData(url = '', data = {}) {
			// Default options are marked with *
			const response = await fetch(url, {
				method: 'POST', // *GET, POST, PUT, DELETE, etc. // include, *same-origin, omit
				headers: {
                    'Authorization': 'Bearer ' + token,
					'Content-Type': 'application/json'
					// 'Content-Type': 'application/x-www-form-urlencoded',
				},
				mode: 'cors', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
				body: JSON.stringify(data) // body data type must match "Content-Type" header
			});
			return response.json(); // parses JSON response into native JavaScript objects
		}

        if(!isLoading && !isInvalid && winnerSelection.length > 0){
            setIsLoading(true);
            postData(`${process.env.REACT_APP_URL_LINK}/api/crypto/submit-contest`, { 
                gameName:game.nM,
                gameCur:game.tG,
                contestName: formData.contestName,
                contestDesc: formData.contestDesc,
                contestPrize: formData.contestPrize,
                contestMemberCount: formData.contestMemberCount,
                contestCode: Math.floor(Math.random() * 99999999) + 19000000,
                gameId:game.id,
                timeStamp:timeStamp,
                winnerSelection:winnerSelection,
                contestEntryFee:contestEntryFee
             })
			.then(data => {
                setIsLoading(false);
                setWinnerSelection("");
                setFormData({
                    contestName: "",
                    contestDesc: "",
                    contestPrize: "",
                    contestMemberCount: ""
                })

                setNextPage(false);
                setContestFormOpen(false);

                setContests(prev => [data, ...prev]);

				////console.log("data : ", data);
				
			}).catch(err => {
                //console.log(err)
            });
        }	
    }

    const handleSelection = (e,title) => {
        if(e.target.checked){
            setWinnerSelection(title);
        } else{
            setWinnerSelection("");
        }  
    }

    const handletabChange = (event) => {
        if(property != event.target.dataset.filter){
            var els = document.getElementsByClassName("gamepage__tab__item");
            Array.prototype.forEach.call(els, function(el) {
                // Do stuff here
                el.classList.remove("active")
            });
            event.target.classList.add("active");

            setProperty(event.target.dataset.filter);
            ////console.log(property)
            setType(1);
        } else{
            setType(prev => prev == 1 ? -1 : 1);
        }
    }


    const handleSettleAll = () => {
        if(gameId){
            var url = `${process.env.REACT_APP_URL_LINK}/api/quiz/final-settlement/${gameId}`;
            
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
            setIsButtonLoading(true)
			setSettleModalOpen(false);
            getData(url)
            .then(data => {
                //console.log(data);
                if(data.message != "Successfully Added User Balance"){
                    alert(data.message);
                } else{
                    setStats(prev => ({
                            ...prev,
                            ["isSettled"]:true
                        })
                    )
                    if(data.data){
                        setContests(data.data);
                    } else{
                        setContests([]);
                    }
                    
                }
				
                setIsButtonLoading(false)

                //setGame(data);
            }).catch(err => {
                //console.log(err)
            });
        }
    }

    const handleRevertSettleAll = () => {
        if(gameId){
            var url = `${process.env.REACT_APP_URL_LINK}/api/quiz/revert-final-settlement/${gameId}`;
            
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
            setIsButtonLoading(true)
			setRevertSettleModalOpen(false)
            getData(url)
            .then(data => {
                //console.log(data);
                if(data.message != "Successfully Added User Balance"){
                    alert(data.message);
                } else{
                    setTab("active");
                    setStats(prev => ({
                            ...prev,
                            ["isSettled"]:false
                        })
                    )
                    if(data.data){
                        setContests(data.data);
                    } else{
                        setContests([]);
                    }
                    
                }
                setIsButtonLoading(false)

                //setGame(data);
            }).catch(err => {
                //console.log(err)
            });
        }
    }


    React.useEffect(() => {
        setContests(null);
        if(searchValue.trim().length > 7){
          var url = `${process.env.REACT_APP_URL_LINK}/api/contests/${gameId}/${searchValue}?page=1&tab=${tab}&admin=${true}`;
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
                //console.log(data);
                //console.log(data.data);
                setContests(data.data);	
          }).catch(err => {
            //console.log(err)
        });
        } else{
            var url = `${process.env.REACT_APP_URL_LINK}/api/contests/${gameId}?sortBy=${property}&type=${type}&page=1&tab=${tab}&admin=${true}`;
            
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
        
            getData(url)
            .then(data => {
                setContests(data.data);
            }).catch(err => {
                //console.log(err)
            });
        }
    },[searchValue,property,type, gameId, tab]);


    React.useEffect(() => {
        ////console.log(pageNumber);
        if(user && !isContestFormOpen && !nextPage &&  pageNumber > 1 && contests){
            var url = `${process.env.REACT_APP_URL_LINK}/api/contests/${gameId}?sortBy=${property}&type=${type}&page=${pageNumber}&tab=${tab}&admin=${true}`;
            
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
            setNewPostLoading(true);
            getData(url)
            .then(data => {
                //console.log(data);
                setNewPostLoading(false);
                if(contests){
                    setContests(prev => [...prev, ...data.data]);
                } else{
                    setContests([...data.data])
                }
                
            }).catch(err => {
                //console.log(err)
            });
        }

    },[token,user,pageNumber,gameId, tab])

    React.useEffect(() => {
        if(contestComm){
            if((formData.contestPrize.trim().length > 0 && !isNaN(formData.contestPrize) && formData.contestPrize > 0) && (formData.contestMemberCount.trim().length > 0 && !isNaN(formData.contestMemberCount) && formData.contestMemberCount > 0)){
                   var fee = formData.contestPrize / formData.contestMemberCount;
                   var comm = (fee * contestComm) / 100;
                   var totalFee = parseFloat(fee + comm).toFixed(2);
                   setContestEntryFee(totalFee); 
            } else{
                setContestEntryFee(0);
            }
        }
    },[formData, contestComm]);

    React.useEffect(() => {
        if(formData.contestName.trim().length > 2 && formData.contestPrize.trim().length > 0 && formData.contestMemberCount.trim().length > 0){
            if((parseFloat(formData.contestPrize) >= parseFloat(minPrize) && parseFloat(formData.contestPrize) <= parseFloat(maxPrize)) && (parseFloat(formData.contestMemberCount) >= parseFloat(minMemberCount) && parseFloat(formData.contestMemberCount) <= parseFloat(maxMemberCount))){
                if(parseFloat(formData.contestPrize) >= parseFloat(formData.contestMemberCount)){
                    setIsInvalid(false);
                    setErrorMessage(null);
                } else{
                    setIsInvalid(true);
                    setErrorMessage("create__contest__error");
                }
            } else{
                setIsInvalid(true);
                if(parseFloat(formData.contestPrize) < parseFloat(minPrize)){
                    setErrorMessage(`Total Prize Pool should be more than ${parseFloat(minPrize)}`)
                } else if(parseFloat(formData.contestPrize) > parseFloat(maxPrize)){
                    setErrorMessage(`Total Prize Pool should be less than ${parseFloat(maxPrize)}`)
                } else if((parseFloat(formData.contestMemberCount) < parseFloat(minMemberCount))){
                    setErrorMessage(`Participants Number should be more than ${minMemberCount}`)
                } else if((parseFloat(formData.contestMemberCount) > parseFloat(maxMemberCount))){
                    setErrorMessage(`Participants Number should be less than ${parseFloat(maxMemberCount)}`)
                }
            }
        } else{
            setIsInvalid(true);
            setErrorMessage(null);
        }

    },[formData]);

    var tabs = <div className="gamepage__tab__container">
             <div onClick={handletabChange} className="gamepage__tab__item active" data-filter="joined">
                {
                    property == "joined" && <>
                        <i className={type == 1 ? "fa fa-arrow-down" : "fa fa-arrow-up"} />
                        &nbsp;
                    </>
                }
              {t("all")}
              {
                    property == "joined" && <>
                        &nbsp;
                        <i className={type == 1 ? "fa fa-arrow-down" : "fa fa-arrow-up"} />
                    </>
                }
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="entryFee">
             {
                    property == "entryFee" && <>
                        <i className={type == 1 ? "fa fa-arrow-down" : "fa fa-arrow-up"} />
                        &nbsp;
                    </>
                }
                 {t("entry__fee")}
                 {
                    property == "entryFee" && <>
                        &nbsp;
                        <i className={type == 1 ? "fa fa-arrow-down" : "fa fa-arrow-up"} />
                    </>
                }
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="contestSize">
             {
                    property == "contestSize" && <>
                        <i className={type == 1 ? "fa fa-arrow-down" : "fa fa-arrow-up"} />
                        &nbsp;
                    </>
                }
                 {t("spots")}
                 {
                    property == "contestSize" && <>
                        &nbsp;
                        <i className={type == 1 ? "fa fa-arrow-down" : "fa fa-arrow-up"} />
                        
                    </>
                }
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="contestPool">
                {
                    property == "contestPool" && <>
                        <i className={type == 1 ? "fa fa-arrow-down" : "fa fa-arrow-up"} />
                        &nbsp;
                    </>
                }
                 {t("prize__pool")}
                 {
                    property == "contestPool" && <>
                        &nbsp;
                        <i className={type == 1 ? "fa fa-arrow-down" : "fa fa-arrow-up"} />
                        
                    </>
                }
             </div>
             <div onClick={handletabChange} className="gamepage__tab__item" data-filter="createdAt">
                {
                    property == "createdAt" && <>
                        <i className={type == 1 ? "fa fa-arrow-down" : "fa fa-arrow-up"} />
                        &nbsp;
                    </>
                }
                 {t("by__date")}
                 {
                    property == "createdAt" && <>
                        &nbsp;
                        <i className={type == 1 ? "fa fa-arrow-down" : "fa fa-arrow-up"} />
                    </>
                }
             </div>
         </div>

    


    return <>
        <MainLayout goBack={true} title={
            <div className="title">
                <h2>{t("contests__list")}</h2>
            </div>
          }>
		  {isSettleModalOpen && <Modal 
            show={isSettleModalOpen}
            onCancel={() => setSettleModalOpen(false)}
            header={"Do you want to Settle all Contests?"}
            
            footer={<><button onClick={() => setSettleModalOpen(false)} className="btn btn-lg btn-danger">Close</button>
                <button onClick={handleSettleAll} className="btn btn-lg btn-primary">Settle All</button></>}
        > <h6>Settle all Contests by clicking the settle all button.</h6></Modal>
		}
		{isRevertSettleModalOpen && <Modal 
            show={isRevertSettleModalOpen}
            onCancel={() => setRevertSettleModalOpen(false)}
            header={"Do you want to Revert all Contests?"}
            
            footer={<><button onClick={() => setRevertSettleModalOpen(false)} className="btn btn-lg btn-danger">Close</button>
                <button onClick={handleRevertSettleAll} className="btn btn-lg btn-primary">Revert All</button></>}
        > <h6>Revert all Contests by clicking the settle all button.</h6></Modal>
		}
        {isContestFormOpen && !nextPage && <div id='contestForm'>
            {errorMessage && <div className="alert alert-danger" role="alert">
                {t(errorMessage)}
            </div>}
            <div className="form-group">
                <label htmlFor="exampleFormControlInput1">{t("contest__name")}</label>
                <input type="text" className="form-control" id="exampleFormControlInput1" name="contestName" value={formData.contestName} placeholder={t("type__contest__name")} autoComplete="off" onChange={handleInputChange} />
            </div>
            <div className="form-group">
                <label htmlFor="exampleFormControlInput4">{t("contest__description__optional")}</label>
                <input type="text" className="form-control" id="exampleFormControlInput4" name="contestDesc" value={formData.contestDesc} placeholder={t("type__contest__description")} autoComplete="off" onChange={handleInputChange} />
            </div>
            <div className="form-group">
                <label>Select Time Period</label> <br />
                { <select className="form-control" id="exampleFormControlSelect1" onChange={(e) => setTimeStamp(e.target.value)}>
                    {
                        Object.keys(risk.defaults).map(key => {
                            return <option key={key} value={key}>{key >= 60 ? `${key / 60} hr/s` : `${key} minutes`}</option>
                        })
                    }
                </select> }
            </div>
            <div className="form-group">
                <label htmlFor="exampleFormControlInput2">{t("total__prize__pool")}</label>
                <input type="number" className="form-control" id="exampleFormControlInput2" name="contestPrize" value={formData.contestPrize} placeholder={`${t("min")} ${minPrize ? minPrize : ""} ${t("&")} ${t("max")} ${maxPrize ? maxPrize : ""}`} autoComplete="off" onChange={handleInputChange} />
            </div>
            <div className="form-group">
                <label htmlFor="exampleFormControlInput3">{t("participants__number")}</label>
                <input type="number" className="form-control" id="exampleFormControlInput3" name="contestMemberCount" value={formData.contestMemberCount} placeholder={`${t("min")} ${minMemberCount ? minMemberCount : ""} ${t("&")} ${t("max")} ${maxMemberCount ? maxMemberCount : ""}`} autoComplete="off" onChange={handleInputChange} />
            </div>
            <p className="contestForm__entry__fee">{t("entry__fee")}: {contestEntryFee}</p>
            <div className="btn__container">
                <button className="btn__container__item" onClick={() => handleBack()}>{t("back")}</button>
                <button className="btn__container__item" onClick={() => handleNext()} disabled={isInvalid}>{t("next")}</button>
            </div>
        </div>}

        {!isContestFormOpen && nextPage && <div id='contestForm'>
            {
                winnersList && Object.keys(winnersList).map(k => {
                    if(parseInt(formData.contestMemberCount) >= parseInt(k)){
                        return <WinnerListContainer key={k} title={k} options={winnersList[k]} selectedOption={winnerSelection} handleCheck={handleSelection} currentPrize={0} totalPrize={formData.contestPrize} />
                    } else{
                        return null;
                    }
                    
                })
            }
            <div className="btn__container">
                <button className="btn__container__item" onClick={() => handleBack()} disabled={isLoading ? true : false}>{t("back")}</button>
                <button className="btn__container__item" onClick={(event) => handleSubmit(event)} disabled={(winnerSelection.length < 1 || isLoading) ? true : false}>{t("submit")}</button>
            </div>
        </div>}


        {!isContestFormOpen && !nextPage && <><div className="contest-btn__container">
            <button className="contest-btn" onClick={() => setContestFormOpen(true)}>{t("create__contest")} <i className="fa-solid fa-plus"></i></button>
            <div className="contest-btn__search">
                <div className="searchBarContainer">
                    <i className="fas fa-search"></i>
                    <input id="searchBox" type="text" name="searchBox" placeholder={t("search")} autoComplete="off" onChange={handleSearchInputChange} value={searchValue} />
                </div>    
            </div>
        </div>
        <div className="tabsContainer">
            <button onClick={handleTabChange} className={`tab ${tab === 'active' ? 'active' : ''}`}><span>{t("active")}</span></button>
            <button onClick={handleTabChange} className={`tab ${tab === 'ended' ? 'active' : ''}`}><span>{t("ended")}</span></button>
        </div>
        {tabs}
        <div className="contest__body">
            {
                !contests && <Loader />
            }
            {
                contests && contests.length < 1 && <span className="noResults">{t("no__contest__found")}</span>
            }
            {
                contests && contests.map(contest => {
                    return <Contest key={contest._id} data={contest} admin={true} cannotSettle={stats ? stats.cannotSettle : true} /> //stats ? stats.cannotSettle : true
                })
            }
            {
                newPostLoading && <Loader />
            }
        </div>
        </>}
        </MainLayout>
    </>
}

const mapStateToProps = state => ({
    user: state.user.user,
    token: state.user.token,
    risk: state.risk.risk,
    games:state.cryptoGame.games
})



export default connect(mapStateToProps)(AdminIndividualContestPage);
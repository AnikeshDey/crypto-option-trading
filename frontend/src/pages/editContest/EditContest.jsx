import React from "react";
import { setDefaults, useTranslation } from 'react-i18next';
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import WinnerListContainer from "../../components/winnerListSelection/WinnerListSelection";
import MainLayout from "../../layouts/main-layout.component";


///single/:id



function IndividualContestPage({ user, token, risk }){
    const { t } = useTranslation(["common"]);
    const [nextPage, setNextPage] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [contestComm, setContestComm] = React.useState(risk.quizComm || null);
    const [winnersList, setWinnersList] = React.useState(risk.winnersList || null);
    const [contest, setContest] = React.useState(null);
    const [defaults, setDefaults] = React.useState(risk.defaults || null);
    const [winnerSelection, setWinnerSelection] = React.useState("");
    const [formData, setFormData] = React.useState(null);
    const [contestEntryFee, setContestEntryFee] = React.useState(0);
    const [minPrize, setMinPrize] = React.useState(risk.quizMinPool || 0);
    const [maxPrize, setMaxPrize] = React.useState(risk.quizMaxPool || 0);
    const [minMemberCount, setMinMemberCount] = React.useState(risk.quizMinParticipants || 0);
    const [maxMemberCount, setMaxMemberCount] = React.useState(risk.quizMaxParticipants || 0);
    const [isInvalid, setIsInvalid] = React.useState(true);

    const navigate = useNavigate();
    const contestId = useParams().id;

    const handleInputChange = (e) => {
        setFormData(prevForm => {
            return {
                ...prevForm,
                [e.target.name]:e.target.value 
            }
        })
    }

    const handleNext = () => {
        setNextPage(true);
    }

    const handleBack = () => {
        if(nextPage){
            
            setNextPage(false);
        } else{
            navigate(-1);
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
            postData(`${process.env.REACT_APP_URL_LINK}/api/contests/edit-contest/${contestId}`, { 
                contestName: formData.contestName,
                contestDesc: formData.contestDesc,
                contestPrize: formData.contestPrize,
                contestMemberCount: formData.contestMemberCount,
                winnerSelection:winnerSelection,
                contestEntryFee:contestEntryFee
             })
			.then(data => {
                //console.log(data);
                setIsLoading(false);
                setWinnerSelection(data.data.winnerSelection);
                setFormData({
                    contestName: data.data.contestName,
                    contestDesc: data.data.contestDesc,
                    contestPrize: data.data.contestPool.toString(),
                    contestMemberCount: data.data.contestSize.toString(),
                    contestJoined:data.data.joined
                })

                setNextPage(false);

                //setContests(prev => [data, ...prev]);

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

    React.useEffect(() => {
        ////console.log(nanoid(8));
        if(user && !risk){
            var url = `${process.env.REACT_APP_URL_LINK}/api/users/get-risk-data`;
            
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
                //console.log(data);
                setMinPrize(data.quizMinPool);
                setMaxPrize(data.quizMaxPool);
                setMinMemberCount(data.quizMinParticipants);
                setMaxMemberCount(data.quizMaxParticipants);
                setContestComm(data.quizComm);
                setWinnersList(data.winnersList);
                setDefaults(data.defaults); // JSON data parsed by `data.json()` call
            }).catch(err => {
                //console.log(err)
            });
        }

    },[token,user])

    // const handletabChange = (event) => {
    //     if(property != event.target.dataset.filter){
    //         var els = document.getElementsByClassName("gamepage__tab__item");
    //         Array.prototype.forEach.call(els, function(el) {
    //             // Do stuff here
    //             el.classList.remove("active")
    //         });
    //         event.target.classList.add("active");

    //         setProperty(event.target.dataset.filter);
    //         ////console.log(property)
    //         setType(1);
    //     } else{
    //         setType(prev => prev == 1 ? -1 : 1);
    //     }
    // }

    // const handleScroll = (e) => {
    //     // //console.log("top:",e.target.documentElement.scrollTop);
    //     // //console.log("window:", window.innerHeight);
    //     // //console.log("height:",e.target.documentElement.scrollHeight);

    //     if((e.target.documentElement.scrollTop + window.innerHeight + 1) >= e.target.documentElement.scrollHeight){
    //         setPageNumber(pageNumber + 1);
    //     }

    // }


    // React.useEffect(() => {
    //     window.addEventListener("scroll", handleScroll)

    //     return () => window.removeEventListener("scroll", handleScroll);
    // },[]);

    // React.useLayoutEffect(() => {
    //     if(gameType == "precricket"){
    //         if(game.event){
    //             var eventCountDown = getCountdown(game.event.openDate);
    //             setEventDate(eventCountDown);
    //         }
    //     } else{
    //         if(game.Date){
    //             var eventCountDown = getCountdown(game.Date);
    //             setEventDate(eventCountDown);
    //         }
    //     }
    // },[game]);

    // React.useEffect(() => {
    //     setContests(null);
    //     if(searchValue.trim().length > 7){
    //       var url = `http://localhost:5000/api/contests/${gameType == "precricket" ? game.event?.eventId : game.Id}/${searchValue}?page=1&tab=${"active"}`;
    //       // Example POST method implementation:
    //       async function putData(url = '') {
    //           // Default options are marked with *
    //           const response = await fetch(url, {
    //           method: 'GET', // *GET, POST, PUT, DELETE, etc. // include, *same-origin, omit
    //           headers: {
    //             'Authorization': 'Bearer ' + token
    //             // 'Content-Type': 'application/x-www-form-urlencoded',
    //           },
    //           mode: 'cors'
    //         });
    //         return response.json(); // parses JSON response into native JavaScript objects
    //       }
          
    //       putData(url)
    //         .then(data => {
    //             ////console.log(data);
    //             setContests(data.data);
    //             //setPosts(data)
    //             //textbox.current.focus();
    //             //login(data.user._doc, data.token);	
    //       }).catch(err => //console.log(err));
    //     } else{
    //         var url = `http://localhost:5000/api/contests/${gameType == "precricket" ? game.event?.eventId : game.Id}?sortBy=${property}&type=${type}&page=1&tab=${"active"}`;
            
    //         async function getData(url = '') {
    //             // Default options are marked with *
    //             const response = await fetch(url, {
    //             method: 'GET', // *GET, POST, PUT, DELETE, etc.
    //             mode: 'cors', // no-cors, *cors, same-origin
    //             headers: {
    //                 'Authorization': 'Bearer ' + token,
    //                 // 'Content-Type': 'application/x-www-form-urlencoded',
    //             }
    //             // body data type must match "Content-Type" header
    //                 });
    //                 return response.json(); // parses JSON response into native JavaScript objects
    //         }
        
    //         getData(url)
    //         .then(data => {
    //             ////console.log(data.data);
    //             setContests(data.data);
    //         }).catch(err => //console.log(err));
    //     }
    //   },[searchValue,property,type]);


    React.useEffect(() => {
        ////console.log(nanoid(8));
        if(user){
            var url = `${process.env.REACT_APP_URL_LINK}/api/contests/single/${contestId}`;
            
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
                //console.log("Requested data");
                //console.log(data);
                setWinnerSelection(data.contestData.winnerSelection);
                setFormData({
                    contestName: data.contestData.contestName,
                    contestDesc: data.contestData.contestDesc,
                    contestPrize: data.contestData.contestPool.toString(),
                    contestMemberCount: data.contestData.contestSize.toString(),
                    contestJoined:data.contestData.joined
                })
                //console.log(defaults[data.contestData.timeStamp].maxU)
                setMaxMemberCount(defaults[data.contestData.timeStamp].maxU);
                setContest(data.contestData);
            }).catch(err => {
                //console.log(err)
            });
        }

    },[token,user])

    // React.useEffect(() => {
    //     ////console.log(pageNumber);
    //     if(user && !isContestFormOpen && !nextPage &&  pageNumber > 1 && contests){
    //         var url = `http://localhost:5000/api/contests/${gameType == "precricket" ? game.event?.eventId : game.Id}?sortBy=${property}&type=${type}&page=${pageNumber}&tab=${"active"}`;
            
    //         async function getData(url = '') {
    //             // Default options are marked with *
    //             const response = await fetch(url, {
    //             method: 'GET', // *GET, POST, PUT, DELETE, etc.
    //             mode: 'cors', // no-cors, *cors, same-origin
    //             headers: {
    //                 'Authorization': 'Bearer ' + token,
    //                 // 'Content-Type': 'application/x-www-form-urlencoded',
    //             }
    //             // body data type must match "Content-Type" header
    //                 });
    //                 return response.json(); // parses JSON response into native JavaScript objects
    //         }
    //         setNewPostLoading(true);
    //         getData(url)
    //         .then(data => {
    //             //console.log(data);
    //             setNewPostLoading(false);
    //             setContests(prev => [...prev, ...data.data]);
    //         }).catch(err => //console.log(err));
    //     }

    // },[token,user,pageNumber])

    React.useEffect(() => {
        
        if(contestComm && formData){
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
        // console.log("formData:",formData);
        if(formData && formData.contestName.trim().length > 2 && formData.contestPrize.trim().length > 0 && formData.contestMemberCount.trim().length > 0){
            // console.log("parseFloat(formData.contestPrize) >= parseFloat(minPrize) && parseFloat(formData.contestPrize) <= parseFloat(maxPrize):",parseFloat(formData.contestPrize) >= parseFloat(minPrize) && parseFloat(formData.contestPrize) <= parseFloat(maxPrize))
            // console.log("parseFloat(formData.contestMemberCount) >= parseFloat(minMemberCount) && parseFloat(formData.contestMemberCount) <= parseFloat(maxMemberCount):",(parseFloat(formData.contestMemberCount) >= parseFloat(minMemberCount) && parseFloat(formData.contestMemberCount) <= parseFloat(maxMemberCount)));
            if((parseFloat(formData.contestPrize) >= parseFloat(minPrize) && parseFloat(formData.contestPrize) <= parseFloat(maxPrize)) && (parseFloat(formData.contestMemberCount) >= parseFloat(minMemberCount) && parseFloat(formData.contestMemberCount) <= parseFloat(maxMemberCount))){
            // console.log("true1");
                
                if(parseFloat(formData.contestPrize) >= parseFloat(formData.contestMemberCount)){
            // console.log("true2");

                    setIsInvalid(false);
                } else{
                    setIsInvalid(true);
                }
            } else{
                setIsInvalid(true);
            }
        } else{
            setIsInvalid(true);
        }

    },[formData, minPrize, minMemberCount, maxMemberCount]);

    return <>
    <MainLayout goBack={true} title={
            <div className="title">
                <h2>{t("edit__contest")}</h2>
            </div>
          }>
            
        {!nextPage && contest && <div id='contestForm'>
            <div className="form-group">
                <label htmlFor="exampleFormControlInput1">{t("contest__name")}</label>
                <input type="text" className="form-control" id="exampleFormControlInput1" name="contestName" value={formData.contestName} placeholder={t("type__contest__name")} autoComplete="off" onChange={handleInputChange} />
            </div>
            <div className="form-group">
                <label htmlFor="exampleFormControlInput4">{t("contest__description__optional")}</label>
                <input type="text" className="form-control" id="exampleFormControlInput4" name="contestDesc" value={formData.contestDesc} placeholder={t("type__contest__description")} autoComplete="off" onChange={handleInputChange} />
            </div>
            <div className="form-group">
                <label htmlFor="exampleFormControlInput2">{t("total__prize__pool")}</label>
                <input type="number" className="form-control" id="exampleFormControlInput2" name="contestPrize" value={formData.contestPrize} placeholder={`${t("min")} ${minPrize} ${t("&")} ${t("max")} ${maxPrize}`} autoComplete="off" onChange={handleInputChange} />
            </div>
            <div className="form-group">
                <label htmlFor="exampleFormControlInput3">{t("participants__number")}</label>
                <input type="number" className="form-control" id="exampleFormControlInput3" name="contestMemberCount" value={formData.contestMemberCount} placeholder={`${t("min")} ${minMemberCount} ${t("&")} ${t("max")} ${maxMemberCount}`} autoComplete="off" onChange={handleInputChange} />
            </div>
            <p className="contestForm__entry__fee">{t("entry__fee")}: {contestEntryFee}</p>
            <div className="btn__container">
                <button className="btn__container__item" onClick={() => handleBack()}>{t("back")}</button>
                <button className="btn__container__item" onClick={() => handleNext()} disabled={isInvalid}>{t("next")}</button>
            </div>
        </div>}

        {nextPage && contest && <div id='contestForm'>
            {
                winnersList && Object.keys(winnersList).map(k => {
                    if(parseInt(formData.contestMemberCount) >= parseInt(k)){
                        return <WinnerListContainer key={k} title={k} options={winnersList[k]} selectedOption={winnerSelection} handleCheck={handleSelection} currentPrize={(formData.contestPrize / formData.contestMemberCount) * formData.contestJoined} totalPrize={formData.contestPrize} />
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
    </MainLayout>
    </>
}

const mapStateToProps = state => ({
    user: state.user.user,
    token: state.user.token,
    risk: state.risk.risk
})

export default connect(mapStateToProps)(IndividualContestPage);
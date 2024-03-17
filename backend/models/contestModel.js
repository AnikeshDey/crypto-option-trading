const path = require('path');
//const axios = require('axios');
const { v4: uuidv4 } = require('uuid');  //might consider moving to utils func.
//aeropsike connection
const config = require('../database/config');
const Aerospike = require('aerospike');

const fetch = require("node-fetch");

const aeroClient = config.database.client;
const exp = Aerospike.exp;
const op = Aerospike.operations;


const crypto = require('crypto');


const { MYSQL_WALLET_DATABASE,
MYSQL_CONTEST_DATABASE,
AEROSPIKE_NAMESPACE_DEFAULT,
AEROSPIKE_USER_SET,
AEROSPIKE_USER_WALLET_SET,
SET_USERS,
AEROSPIKE_CONTEST_SET,
AEROSPIKE_SLIP_SET,
AEROSPIKE_QUIZ_SET,
AEROSPIKE_GLOBAL_SET,
AEROSPIKE_COUNTER_SET,
AEROSPIKE_EVENT_SET,
AEROSPIKE_CRYPTO_PRICE_SET, 
AEROSPIKE_TICKERS_SET,
RISK_DATA_KEY } = process.env;





//singleContests
async function singleContest(id) {
    try{
	
		aeroClient.connect();
		
		const key = new Aerospike.Key(AEROSPIKE_NAMESPACE_DEFAULT, AEROSPIKE_CONTEST_SET, id);
		//console.log(id);
		var { bins } = await aeroClient.get(key);
		//console.log(bins);
		return bins;
	} catch(err){
		throw err;
	}
}

//singleContests
async function contestByCode(id,code) {
    return new Promise((resolve, reject) => {

		aeroClient.connect();

        var query = aeroClient.query(AEROSPIKE_NAMESPACE_DEFAULT, AEROSPIKE_CONTEST_SET);
        
        query.where(Aerospike.filter.equal("contestCode", code));
		
        var stream = query.foreach();
		var allContests = [];
		stream.on("data", (rec) => {
			if(rec.bins.gameId == id){
				allContests.push(rec.bins);
			}
			
		});
		
		stream.on("error", (error) => {
			reject(error);
		});
		
		stream.on("end", () => {
			resolve(allContests);
		});
        	
	});
}

//allContests
async function allContests(id, tab, type, admin, page, sortBy, itemsStart, itemsCount, userId){
	return new Promise((resolve, reject) => {

		aeroClient.connect();

        var contests = [];

        var contestQuery = aeroClient.query(AEROSPIKE_NAMESPACE_DEFAULT,AEROSPIKE_CONTEST_SET);

        contestQuery.where(new Aerospike.filter.equal("gameId", id.toString()));

        var contestStream = contestQuery.foreach();

        contestStream.on('data', (record) => {
            if(!admin){
                if(tab == "active"){
                    if(record.bins.endTime > new Date().getTime()){
                        if(record.bins.status == "active"){
                            contests.push(record.bins);
                        }
                    }
                } else{
                    if(record.bins.status != "active" || record.bins.endTime < new Date().getTime()){
                        contests.push(record.bins);
                    }
                }
            } else{
                if(tab == "active"){
                    if(record.bins.status == "active"){
                        contests.push(record.bins);
                    }
                } else{
                    if(record.bins.status != "active"){
                        contests.push(record.bins);
                    }
                }
            }
        });

        contestStream.on('error', (err) => {
            console.log(err);
            reject(err);
        })

        contestStream.on('end', async () => {
            if(tab == "active"){
                if(contests.length < 1){
                    if(page == 1 && !admin){
                        var key = new Aerospike.Key(AEROSPIKE_NAMESPACE_DEFAULT,AEROSPIKE_CRYPTO_PRICE_SET, id);
                        aeroClient.get(key, async (error, record) => {
                            if(error){
                                reject(error);
                            } else{
                                var riskData = await aeroClient.get(new Aerospike.Key(AEROSPIKE_NAMESPACE_DEFAULT,AEROSPIKE_GLOBAL_SET,"cryptoRiskData"));
                                var parsedRiskData = JSON.parse(riskData.bins.data.toString());
                                var contestId = crypto.randomInt(100000000000, 999999999999).toString();;
                                var eventOps = [
                                    Aerospike.operations.incr("cC", 1)
                                ]
                                var contestKey = new Aerospike.Key(AEROSPIKE_NAMESPACE_DEFAULT, AEROSPIKE_CONTEST_SET, contestId);
                                var counterKey = new Aerospike.Key(AEROSPIKE_NAMESPACE_DEFAULT, AEROSPIKE_COUNTER_SET, contestId);
                                var contestBins = {
                                    _id:contestId,
                                    gameId:record.bins.id.toString(),
                                    gameName:record.bins.nM,
                                    gameCur:record.bins.tG,
                                    contestName:"Main Contest",
                                    contestDesc:"",
                                    contestPool:parsedRiskData.quizDefaultPool,
                                    contestSize:parsedRiskData.quizDefaultParticipants,
                                    contestCode:Math.floor(Math.random() * 99999999) + 19000000,
                                    entryFee: Number(((parsedRiskData.quizDefaultPool / parsedRiskData.quizDefaultParticipants) + (((parsedRiskData.quizDefaultPool / parsedRiskData.quizDefaultParticipants) * parsedRiskData.quizComm) / 100)).toFixed(2)),
                                    winnerSelection:3,
                                    contestType:'N/A',
                                    joined:0,
                                    status:"active",
                                    user:userId,
                                    canSettle:false,
                                    isSettled:"false",
                                    lockPrice:"null",
                                    timeStamp:180,
                                    createdAt:new Date(new Date().getTime()).getTime(),
                                    endTime:new Date(new Date().getTime() + (30 * 60 * 1000)).getTime(),
                                    settleTime:(new Date(new Date().getTime() + (30 * 60 * 1000) + (180 * 60 * 1000)).getTime())
                                }

                                var counterBins = {
                                    pk:     1,
                                    users: 0, //total number of registered users
                                    posts: 0, //total number of posts
                                    spAS: 0, //sports Active Slips
                                    spHS: 0, //sports Historical Slips -- basically older than 10 days
                                    spAC:0, //sports Active Contests
                                    spEC:0, //sports Ended Contests -- basically older than 10 days
                                    p2pBS: 0, //peer-to-peer Buy Sell in crypto payment gateway
                                }

                                await aeroClient.operate(key, eventOps);
                                await aeroClient.put(contestKey, contestBins);
                                await aeroClient.put(counterKey, counterBins);
                                //console.log("Added contest in aerospike............");

                                resolve({data: [contestBins]});
                            }
                        })
                    } else{
                        resolve({data: []});
                    }
                } else{
                    var filteredContests = contests.sort(function(a, b){
                        if(type == 1){
                            return a[sortBy] - b[sortBy]
                        } else{
                            return b[sortBy] - a[sortBy]
                        }
                    });

                    resolve({data: filteredContests.slice(itemsStart, itemsCount)});
                }
            } else{
                if(contests.length < 1){
                    resolve({data: []});
                } else{
                    var filteredContests = contests.sort(function(a, b){
                        if(type == 1){
                            return a[sortBy] - b[sortBy]
                        } else{
                            return b[sortBy] - a[sortBy]
                        }
                    });

                    resolve({data: filteredContests.slice(itemsStart, itemsCount)});
                }
            }
        });		
	});
}

//singleContests
async function setLockPrice(id) {
    try{
	
		aeroClient.connect();
		
		var contestKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_CONTEST_SET, id);
        
        let rec = await aeroClient.get(contestKey)
            
        if(rec.bins.lockPrice == "null"){
            console.log("Looking for lockPrice");
            var data = await (await fetch(`${process.env.CRYPTO_SINGLE_PRICE_API_URL}${rec.bins.gameName}`)).json();
            var newContestOps = [Aerospike.operations.write("lockPrice", data[0].current_price)];
            await aeroClient.operate(contestKey, newContestOps);
            return {...rec.bins, ["lockPrice"]:data[0].current_price};
        } else {
            console.log("Not looking for lockPrice");
            return rec.bins;
        }
	} catch(err){
		throw err;
	}
}

//singleContests
async function editContest(id, contestName, contestDesc, contestPrize, contestMemberCount, winnerSelection, contestEntryFee) {
    try{
	
		aeroClient.connect();
		
        var ops = [
            Aerospike.operations.write("contestName",contestName),
            Aerospike.operations.write("contestDesc",contestDesc),
            Aerospike.operations.write("contestPool", Number(contestPrize)),
            Aerospike.operations.write("contestSize",contestMemberCount),
            Aerospike.operations.write("entryFee", Number(contestEntryFee)),
            Aerospike.operations.write("winnerSelection",winnerSelection)
        ];

        var key = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, AEROSPIKE_CONTEST_SET, id);
        
        await aeroClient.operate(key,ops);
        const record = await aeroClient.get(key);

        return {data: record.bins};
	} catch(err){
		throw err;
	}
}

async function cancelContest(id){
	return new Promise(async (resolve, reject) => {

        try{
            aeroClient.connect();

            var contestKey = new Aerospike.Key(AEROSPIKE_NAMESPACE_DEFAULT, AEROSPIKE_CONTEST_SET, id);

            var ops = [
                Aerospike.operations.write("status","cancelled"),
                Aerospike.operations.read("joined"),
                Aerospike.operations.read("_id"),
                Aerospike.operations.read("entryFee"),
                Aerospike.operations.read("status"),
                Aerospike.operations.read("gameId"),
                Aerospike.operations.read("sportId"),
                Aerospike.operations.read("gameType"),
                Aerospike.operations.read("gameName"),
                Aerospike.operations.read("gameStartDate"),
                Aerospike.operations.read("leagueName"),
                Aerospike.operations.read("contestName"),
                Aerospike.operations.read("contestDesc"),
                Aerospike.operations.read("contestPool"),
                Aerospike.operations.read("contestSize"),
                Aerospike.operations.read("contestCode"),
                Aerospike.operations.read("winnerSelection"),
                Aerospike.operations.read("contestType"),
                Aerospike.operations.read("user"),
                Aerospike.operations.read("createdAt")
            ]

            var result = await aeroClient.operate(contestKey, ops);

            if(result.bins.joined && result.bins.joined > 0){

                var query = aeroClient.query(process.env.AEROSPIKE_NAMESPACE_DEFAULT,process.env.AEROSPIKE_SLIP_SET);

                query.where(Aerospike.filter.equal("cId", id));

                query.select("uId","dT", "eF");

                var stream = query.foreach();

                //conn.beginTransaction();

                stream.on("data", async (rec) => {
                    var payType = rec.bins.dT == "conBal" ? "game_cb" : "game_bo";
                    //var updateQuery = `UPDATE ${process.env.MYSQL_WALLET_DATABASE} SET ${payType}=${payType}+${rec.bins.eF} WHERE uid="${rec.bins.uId.toString()}"`
                    //await conn.query(updateQuery);
                    let key = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, AEROSPIKE_USER_WALLET_SET, rec.bins.uId);

                    let ops = [
                        Aerospike.operations.incr(payType, rec.bins.eF)
                    ]

                    await aeroClient.operate(key, ops);
                })

                stream.on("error", async (err) => {
                    //console.log(err);
                    //await conn.rollback()
                    var contestKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT,process.env.AEROSPIKE_CONTEST_SET, id);

                    var ops = [
                        Aerospike.operations.write("status","active")
                    ]

                    await aeroClient.operate(contestKey, ops);
                    reject(err);
                })

                stream.on("end", async () => {
                    //await conn.commit();
                    resolve({data: result.bins});
                });

            } else{
                resolve({data: result.bins});
            }


        } catch(err){
            //console.log(err);
            //await conn.rollback()
            var contestKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT,process.env.AEROSPIKE_CONTEST_SET, id);

            var ops = [
                Aerospike.operations.write("status","active")
            ]

            await aeroClient.operate(contestKey, ops);
            reject(err);
        }        	
	});
}

async function revertCancelContest(id){
	return new Promise(async (resolve, reject) => {

        try{
            aeroClient.connect();

            var contestKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT,process.env.AEROSPIKE_CONTEST_SET, id);

            var ops = [
                Aerospike.operations.write("status","active"),
                Aerospike.operations.read("joined"),
                Aerospike.operations.read("_id"),
                Aerospike.operations.read("entryFee"),
                Aerospike.operations.read("status"),
                Aerospike.operations.read("gameId"),
                Aerospike.operations.read("sportId"),
                Aerospike.operations.read("gameType"),
                Aerospike.operations.read("gameName"),
                Aerospike.operations.read("gameStartDate"),
                Aerospike.operations.read("leagueName"),
                Aerospike.operations.read("contestName"),
                Aerospike.operations.read("contestDesc"),
                Aerospike.operations.read("contestPool"),
                Aerospike.operations.read("contestSize"),
                Aerospike.operations.read("contestCode"),
                Aerospike.operations.read("winnerSelection"),
                Aerospike.operations.read("contestType"),
                Aerospike.operations.read("user"),
                Aerospike.operations.read("createdAt")
            ]

            var result = await aeroClient.operate(contestKey, ops);

            if(result.bins.joined && result.bins.joined > 0){

                var query = aeroClient.query(process.env.AEROSPIKE_NAMESPACE_DEFAULT,process.env.AEROSPIKE_SLIP_SET);

                query.where(Aerospike.filter.equal("cId", id));

                query.select("uId","dT", "eF");

                var stream = query.foreach();

                conn.beginTransaction();

                stream.on("data", async (rec) => {
                    var payType = rec.bins.dT == "conBal" ? "game_cb" : "game_bo";

                    let key = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, AEROSPIKE_USER_WALLET_SET, rec.bins.uId);

                    let ops = [
                        Aerospike.operations.incr(payType, -1 * rec.bins.eF)
                    ]

                    await aeroClient.operate(key, ops);
                })

                stream.on("error", async (err) => {
                    //console.log(err);
                    await conn.rollback()
                    var contestKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT,process.env.AEROSPIKE_CONTEST_SET, id);

                    var ops = [
                        Aerospike.operations.write("status","cancelled")
                    ]

                    await aeroClient.operate(contestKey, ops);
                    res.sendStatus(400);
                })

                stream.on("end", async () => {
                    await conn.commit();
                    resolve({data: result.bins});
                });

            } else{
                resolve({data: result.bins});
            }


        } catch(err){
            //console.log(err);
            await conn.rollback()
            var contestKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT,process.env.AEROSPIKE_CONTEST_SET, id);

            var ops = [
                Aerospike.operations.write("status","cancelled")
            ]

            await aeroClient.operate(contestKey, ops);
            reject(err);
        }      	
	});
}

//singleContests
async function submitContest(gameName, contestName, contestDesc, contestPrize, contestCode, contestMemberCount, gameId, winnerSelection, contestEntryFee, timeStamp, gameCur, userId) {
    return new Promise((resolve, reject) => {
        try{
            aeroClient.connect();
    
            var contestId = crypto.randomInt(100000000000, 999999999999).toString();
            var key = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT,process.env.AEROSPIKE_CRYPTO_PRICE_SET,gameId.toString());
            var contestKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT,process.env.AEROSPIKE_CONTEST_SET,contestId)
            var counterKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_COUNTER_SET, contestId)
            //var updatedEvent = await Event.findByIdAndUpdate(gameId,{$inc:{cC:1}},{new:true});
            var ops = [
                Aerospike.operations.incr("tC",1),
                Aerospike.operations.incr("aC",1)
            ]
            aeroClient.operate(key, ops, async (error) => {
                if(error){
                    resolve({message:"Not found!"});
                } else{
                    var riskKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_GLOBAL_SET, "cryptoRiskData");
                    var riskOps = [Aerospike.operations.read("data")];
                    var data = await aeroClient.operate(riskKey, riskOps); 
                    var riskData = JSON.parse(data.bins.data.toString());
    
                    var bins = {
                        _id:contestId,
                        gameId:gameId.toString(),
                        gameName:gameName,
                        gameCur:gameCur,
                        contestName:contestName,
                        contestDesc:contestDesc,
                        contestPool:Number(contestPrize),
                        contestSize:contestMemberCount,
                        contestCode:contestCode,
                        entryFee: Number(contestEntryFee),
                        winnerSelection:winnerSelection,
                        contestType:'N/A',
                        joined:0,
                        status:"active",
                        user:userId,
                        canSettle:false,
                        isSettled:"false",
                        lockPrice:"null",
                        timeStamp:timeStamp,
                        createdAt:new Date(new Date().getTime()).getTime(),
                        endTime:new Date(new Date().getTime() + ((riskData.defaults[timeStamp].exp / 60) * 60 * 1000)).getTime(),
                        settleTime:(new Date(new Date().getTime() + ((riskData.defaults[timeStamp].exp / 60) * 60 * 1000) + (timeStamp * 60 * 1000)).getTime())
                    }
    
                    var counterBins = {
                        pk:     1,
                        users: 0, //total number of registered users
                        posts: 0, //total number of posts
                        spAS: 0, //sports Active Slips
                        spHS: 0, //sports Historical Slips -- basically older than 10 days
                        spAC:0, //sports Active Contests
                        spEC:0, //sports Ended Contests -- basically older than 10 days
                        p2pBS: 0, //peer-to-peer Buy Sell in crypto payment gateway
                    }
    
                    await aeroClient.put(contestKey, bins);
                    await aeroClient.put(counterKey, counterBins);
                    
                    resolve({...bins});
                }
            });
        } catch(err){
            console.log(err);
            reject(err);
        }
	});
}


module.exports = {
    singleContest,
    allContests,
    contestByCode,
    setLockPrice,
    editContest,
    cancelContest,
    revertCancelContest,
    submitContest
}


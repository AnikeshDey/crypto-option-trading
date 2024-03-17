const path = require('path');
//const axios = require('axios');
const { v4: uuidv4 } = require('uuid');  //might consider moving to utils func.
//aeropsike connection
const config = require('../database/config');
const { connectSocket } = require("../socket/socket");

const Aerospike = require('aerospike');
const aeroClient = config.database.client;
//console.log(aeroClient);
const exp = Aerospike.exp;
const op = Aerospike.operations;


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



//allCoins
async function submitSlip(slip, entryFee, userId, userP, userUn){
	return new Promise(async (resolve, reject) => {

        console.log("2", userId);


        const socket = await connectSocket();
        //console.log(aeroClient);
		aeroClient.connect();

		if(slip){
            //const client = getClient();
            var contestId = slip.contestId;
            try{
    
                var contestKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT,process.env.AEROSPIKE_CONTEST_SET,contestId);
    
                aeroClient.get(contestKey, async (error, record) => {
                    if(error){
                        console.log(error);
                        resolve({message:'betslip__couldNotSubmit'});
                    } else{
                        var contest = record.bins;
                    }
                    ////console.log("contest",contest);
                    if(contest){   
                        var newContest = {...contest};
                        newContest.joined = contest.joined + 1;
    
                        await aeroClient.put(contestKey, newContest)
    
                        var payType = "conBal";
    
                        aeroClient.get(new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT,process.env.AEROSPIKE_GLOBAL_SET,"cryptoRiskData"), async (error, record) => {
                            if(error){
                                console.log(error);
                                await aeroClient.put(contestKey, contest);
                                resolve({message:'betslip__couldNotSubmit'});
                            } else {
                                var risk = JSON.parse(record.bins.data.toString());
                            }
    
                            let walletKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_USER_WALLET_SET, userId);
                            
                            aeroClient.get(walletKey, async (error, result) =>{
                                if(error){
                                    console.log(error);
                                    await aeroClient.put(contestKey, contest);
                                    resolve({message:'betslip__couldNotSubmit'});
                                } else {
                                    wallet = result.bins;
                                    var slipQuery = aeroClient.query(process.env.AEROSPIKE_NAMESPACE_DEFAULT,process.env.AEROSPIKE_SLIP_SET);
    
                                    slipQuery.where(Aerospike.filter.equal("cId", contestId))
                                    
                                    const queryPolicy = new Aerospike.QueryPolicy({});
                                    
                                    queryPolicy.filterExpression = exp.eq(exp.binStr("uId"), exp.str(userId.toString()));
                                    
                                    var slipStream = slipQuery.foreach(queryPolicy);
                                    var slipCount = 0;
                                    slipStream.on('data', (record) => {
                                            slipCount++;
                                    })
    
                                    slipStream.on('error', async (error) => {
                                        console.log(error);
                                        await aeroClient.put(contestKey, contest);
                                        resolve({message:'betslip__couldNotSubmit'});
                                    })
    
                                    slipStream.on('end', async () => {
                                        
                                        if(risk.disabledEvents.includes(slip.gameId.toString().replace(':','0'))){
                                            await aeroClient.put(contestKey, contest);
                                            resolve({message:"betslip__disabledEvent"});
                                        } else if(parseFloat(entryFee) > wallet.ccb){
                                            await aeroClient.put(contestKey, contest);
                                            resolve({message:"betslip__exceededUserBalance", value:wallet.cb});
                                        }  else if(contest.joined + 1 > contest.contestSize ){
                                            await aeroClient.put(contestKey, contest);
                                            resolve({message:"contestslip__exceededAllowedUser"});
                                        }
                                        
    
                                        if(slipCount > 0){
                                            if(Number(contest.winnerSelection) <= 50){
                                                if(slipCount >= 1){
                                                    await aeroClient.put(contestKey, contest);
                                                    resolve({message:"contestslip__exceededUserSlip1"});
                                                }
                                            } else if(Number(contest.winnerSelection) > 50 && Number(contest.winnerSelection) <= 100){
                                                if(slipCount >= 2){
                                                    await aeroClient.put(contestKey, contest);
                                                    resolve({message:"contestslip__exceededUserSlip2"});
                                                }
                                            } else if(Number(contest.winnerSelection) > 100 && Number(contest.winnerSelection) <= 500){
                                                if(slipCount >= 3){
                                                    await aeroClient.put(contestKey, contest);
                                                    resolve({message:"contestslip__exceededUserSlip3"});
                                                }
                                            } else if(Number(contest.winnerSelection) > 500 && Number(contest.winnerSelection) <= 1000){
                                                if(slipCount >= 4){
                                                    await aeroClient.put(contestKey, contest);
                                                    resolve({message:"contestslip__exceededUserSlip4"});
                                                }
                                            } else if(Number(contest.winnerSelection) > 1000){
                                                if(slipCount >= 5){
                                                    await aeroClient.put(contestKey, contest);
                                                    resolve({message:"contestslip__exceededUserSlip5"});
                                                }
                                            } 
                                        }
                                        
    
                                        // NEXT LOGIC HERE
                                        // Batch Proccess
    
    
                                        let counterKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_COUNTER_SET, contestId)
                                        const ops = [op.incr('spAS', 1), op.read('spAS')] //spAS is the bin name
                                        const addCounter = await aeroClient.operate(counterKey,ops)
    
    
                                        var slipId = Date.now().toString();
                                        var newBetslip = {
                                            _id:slipId,
                                            spAS:addCounter.bins['spAS'],
                                            cId:contestId,
                                            cN:newContest.contestName,
                                            gN:slip.gameName,
                                            dT:payType,
                                            cc:slipCount > 0 ? slipCount + 1 : 1,
                                            uId:userId,
                                            uP:userP,
                                            uN:userUn,
                                            gId:slip.gameId,
                                            st:"0.0", //st = status
                                            po:slip.selectedOp, //po = points
                                            rk:0,
                                            eF:entryFee,
                                            mS:newContest.contestSize,
                                            cT:new Date().getTime()
                                        }
    
                                        var policy = new Aerospike.WritePolicy({
                                            gen: Aerospike.policy.gen.EQ,
                                            totalTimeout:10000,
                                            socketTimeout:10000,
                                            maxRetries:0
                                        }) 
        
                                        try{
                                            await aeroClient.put(new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_SLIP_SET, slipId), newBetslip, {}, policy);
                                        } catch(err){
                                            console.log(err);
                                            await aeroClient.put(contestKey, contest);
                                            resolve({message:'betslip__couldNotSubmit'});
                                        }
    
                                        
                                        var newPayType = "game_cb";
    
                                        var walletbins = {
                                            ...wallet,
                                            [newPayType]:(wallet[newPayType] - entryFee)
                                        };
                                        
    
                                        try{
    
                                            await aeroClient.put(walletKey, walletbins);
    
                                            if(socket){
                                                socket.to(`game-${contestId}`).emit("reload available");
                                            }
                                        
                                            resolve({body:{slip, entryFee}, wallet:{...walletbins}});
    
                                        } catch(err){
                                            if (err) {
                                                console.log(err);
                                                //await conn.rollback()
                                                await aeroClient.put(contestKey, contest);
                                                aeroClient.remove(new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_SLIP_SET, slipId), (error) => {
                                                    if(error){
                                                        //console.log(error);
                                                    }
    
                                                    resolve({message:'betslip__couldNotSubmit'});
                                                })
                                            }
                                        }
                                    })
                                }
                            });
                            
                        })
                    } else{
                        resolve({message:"contestslip__invalidInput"});
                    }
                })
    
            } catch(err){
                console.log(err);
                resolve({message:'betslip__couldNotSubmit'});
            }
        } else{
            resolve({message:"contestslip__invalidInput"});
        }
	});
}

async function typedContest(uId, type, page, itemStart, itemEnd){
    return new Promise((resolve, reject) => {

		aeroClient.connect();

        var query = aeroClient.query(process.env.AEROSPIKE_NAMESPACE_DEFAULT,process.env.AEROSPIKE_SLIP_SET);

        var userFilter = Aerospike.filter.equal("uId", uId.toString());

        query.where(userFilter); 

        query.select('cId');

        var stream = query.foreach();
        var allIds = [];
        var readKeys = [];
        var allContests = [];
        stream.on('data', async (record) => {
            ////console.log(record.bins)
            if(!allIds.includes(record.bins.cId) && allIds.length < (page * 100)){
                allIds.push(record.bins.cId);

                readKeys.push({
                        key: new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_CONTEST_SET, record.bins.cId.toString()),
                        readAllBins: true
                });
            
            } else if(allIds.length == (page * 100)){
                stream.end();
            }
        });

        


        stream.on('error', function (error) {
            //handle error
            //console.log(error);
        })


        stream.on('end', () => {
            if(readKeys.length < 1){
                resolve({
                    data:[]
                });
            } else{
                aeroClient.batchRead(readKeys, function (error, results) {
                    if (error) {
                    //console.log('ERROR - %s', error.message)
                    } else {
                        ////console.log("results:", results); 
    
                        results.forEach(function (result, index) {
                            ////console.log("result.status:",result.status);
                            ////console.log("result.status:",result.record);
                            if(result.status == 0){
                                if(result.record.bins.status == type){
                                    allContests.push(result.record.bins);
                                }
                            }
    
                            if(index == results.length - 1){
                                resolve({
                                    data:allContests.sort(function(a, b){return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()}).slice(itemStart,itemEnd)
                                });
                            }
                        })
                    }
                    //aeroClient.close()
                })
            }
            
        })
    });
}

async function contestSlipResult(cId){
    return new Promise((resolve, reject) => {

		aeroClient.connect();

        var allResults = [];
        
        var query = aeroClient.query(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_SLIP_SET);
		
		query.where(Aerospike.filter.equal("cId", cId)); //first filter out the result before applying expression regix query

        var stream = query.foreach();
        
        stream.on('data', (rec) => {
            allResults.push(rec.bins);
        })

        stream.on('error', (err) => {
            console.log(err);
            reject(err);
        })

        stream.on('end', () => {
            // console.log("allResults:", allResults);
            resolve({
                betslips:allResults
            });
        });
    });
}


async function contestSlipHistoryResult(cId, setId, itemsStart, itemsEnd, uId){
    return new Promise(async (resolve, reject) => {

		aeroClient.connect();

        var allResults = [];
        
        var contestKey = new Aerospike.Key(AEROSPIKE_NAMESPACE_DEFAULT, `allHistoryContests-${setId}`, cId);

        var contestOps = [
            Aerospike.operations.read("joined")
        ]

        var contestResult = await aeroClient.operate(contestKey, contestOps);
        
        var query = aeroClient.query(process.env.AEROSPIKE_NAMESPACE_DEFAULT, `allHistorySlips-${setId}`);
        

        query.apply("demo", "str_between", ["cId", cId, itemsStart, itemsEnd],(error, result) => {
            if(error){
                //console.log("udferror:", error);
            } else{
                ////console.log("udfresult:", result);
            }        
        })

        query.select("uN", "po", "rk", "_id", "st", "uP","uId")

        var stream = query.foreach();
        
        stream.on('data', (rec) => {
            allResults.push(rec.bins);
        })

        stream.on('error', (err) => {
            //console.log(err);
            reject(err);
        })

        stream.on('end', () => {
            var userQuery = aeroClient.query(process.env.AEROSPIKE_NAMESPACE_DEFAULT, `allHistorySlips-${setId}`);
            userQuery.select("uN", "po", "rk", "_id", "st", "uP", "uId")
            
            userQuery.apply(process.env.AEROSPIKE_NAMESPACE_DEFAULT, "str_between", ["cId", cId, "uId", uId.toString()],(error, result) => {
                if(error){
                    //console.log("udferror:", error);
                } else{
                    ////console.log("udfresult:", result);
                }        
            })

            var userStream = userQuery.foreach();
            var userResults = [];
            userStream.on('data', (rec) => {
                userResults.push(rec.bins);
            })

            userStream.on("end", () => {
                resolve({betslips:JSON.stringify(allResults.sort(function(a, b){return a.spAS - b.spAS})), totalCount:contestResult.bins.joined, userbetslips:JSON.stringify(userResults.sort(function(a, b){return a.spAS - b.spAS}))});
            })
        })
    });
}

async function fullSlipResult(cId, code){
    return new Promise(async (resolve, reject) => {

		aeroClient.connect();

        var query = aeroClient.query(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_SLIP_SET);

        query.where(Aerospike.filter.equal("cId", cId));
        query.select("uN","po","cT","eF");
        var stream = query.foreach();
        var formattedArray = [];
        stream.on('data', (rec) => {
            var formattedData = {}
            formattedData.username = rec.bins.uN;
            formattedData.contestId = code;
            formattedData.point = rec.bins.po;
            formattedData.entryFee = rec.bins.eF;
            formattedData.createdAt = new Date(rec.bins.cT).toDateString();
            formattedArray.push(formattedData);
            console.log("running the loop....");
        })


        stream.on('end', () => {  
            resolve(formattedArray)
        })

        
    });
}

async function contestFinalSettlement(cId){
    return new Promise(async (resolve, reject) => {

		aeroClient.connect();

        const socket = await connectSocket();

        var riskKey = new Aerospike.Key(AEROSPIKE_NAMESPACE_DEFAULT, AEROSPIKE_GLOBAL_SET, "riskData");

        var riskOps = [ Aerospike.operations.read("data") ];

        var result = await aeroClient.operate(riskKey, riskOps);

        var parsedData = JSON.parse(result.bins.data.toString());

        var contestKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_CONTEST_SET, cId);

        aeroClient.get(contestKey, async (error, record) => {
            if(error){
                //console.log(error);
                resolve({message:'Could not settle quiz'});
            } else{
                var contest = record.bins;
                if(Number(contest.joined) >= Number(contest.winnerSelection)){
                                
                    var winnerShare = parsedData.winnersList[contest.winnerSelection];

                    var allWinners = Object.keys(winnerShare);

                    var slipQuery = aeroClient.query(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_SLIP_SET);

                    slipQuery.where(Aerospike.filter.equal("cId", contest._id));

                    slipQuery.select("rk", "uId", "_id", "dT", "po");

                    var slipStream = slipQuery.foreach();
                    var allContestSlips = [];
                    slipStream.on("data", (rec) => {
                        allContestSlips.push(rec.bins);
                    });

                    slipStream.on("end", async () => {
                        var lockPrice;
                        if(contest.lockPrice == "null"){
                            console.log("Looking for lockPrice in Settlement");
                            var data = await (await fetch(`${process.env.CRYPTO_SINGLE_PRICE_API_URL}${contest.gameName}`)).json();
                            var newContestOps = [Aerospike.operations.write("lockPrice", data[0].current_price)];
                            var contestKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_CONTEST_SET, cId);
                            await aeroClient.operate(contestKey, newContestOps);
                            lockPrice = data[0].current_price;
                        } else{
                            console.log("Not looking for lockPrice in Settlement");
                            lockPrice = record.bins.lockPrice;
                        }
                           
                        allContestSlips = getRankData(allContestSlips, lockPrice);
                        //console.log(allContestSlips);
                        for(var l=0; l < allWinners.length; l++ ){
                            var w = allWinners[l]
                            if(w.includes("-")){
                                var contestSlips = allContestSlips.filter(slip => ((slip.rk >= w.split("-")[0]) && (slip.rk <= w.split("-")[1])));
                                var allSlips = contestSlips;
                                if(contestSlips.length > 0){
                                    var allPercentages = [];
                                    contestSlips.forEach((slip, ind)=>{
                                        var foundSlips = contestSlips.filter(s => s.rk == slip.rk);
                                        allWinners.slice(l,(allWinners.length - 1)).map((winner, index) => {
                                            if(!winner.includes("-")){
                                                if( (slip.rk + (foundSlips.length -1)) >= winner){
                                                    allPercentages.push(winner);
                                                }
                                            } else{
                                                if( (slip.rk + (foundSlips.length -1)) >= winner.split("-")[0]){
                                                    return winner;
                                                }
                                            }
                                        
                                        });

                                        contestSlips.splice(ind,foundSlips.length);
                                    }) 
                                    
                                    var totalPercentage = 0;

                                    allPercentages.forEach((p,i) => {
                                            totalPercentage += winnerShare[p];
                                    })

                                    amountPerUser = (((((contest.contestPool / contest.contestSize) * contest.joined ) * totalPercentage) / 100) / allSlips.length)

                                    try{
                                        for(var s=0; s < contestSlips.length; s++){
                                            var payType = "game_wb";

                                            let walletKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_USER_WALLET_SET, contestSlips[s].uId);
                                            
                                            let walletOps = [ Aerospike.operations.incr(payType, parseFloat(amountPerUser).toFixed(2)) ];

                                            await aeroClient.put(walletKey, walletOps);


                                            var writePolicy = new Aerospike.WritePolicy({
                                                totalTimeout:50000,
                                                socketTimeout:50000,
                                                maxRetries:5
                                            })

                                            var slipKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_SLIP_SET, contestSlips[s]._id.toString());

                                            var slipOps = [
                                                Aerospike.operations.write("st", `${parseFloat(amountPerUser).toFixed(2)}`)
                                            ]

                                            await aeroClient.operate(slipKey, slipOps, writePolicy);
                                            
                                            if(s == contestSlips.length -1){

                                                var contestKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_CONTEST_SET, contest._id);
                                                var contestOps = [
                                                    Aerospike.operations.write("status", "ended"),
                                                    Aerospike.operations.write("isSettled", "true")
                                                ]
                                                await aeroClient.operate(contestKey, contestOps);


                                                //console.log("Updated winning in user balance")
                                                if( l == allWinners.length - 1){
                                                    var contestKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_CONTEST_SET, contest._id);

                                                    var ops = [
                                                        Aerospike.operations.write("status","ended"),
                                                        Aerospike.operations.write("isSettled","true"),
                                                        Aerospike.operations.read("isSettled"),
                                                        Aerospike.operations.read("joined"),
                                                        Aerospike.operations.read("_id"),
                                                        Aerospike.operations.read("entryFee"),
                                                        Aerospike.operations.read("status"),
                                                        Aerospike.operations.read("gameId"),
                                                        Aerospike.operations.read("gameName"),
                                                        Aerospike.operations.read("gameCur"),
                                                        Aerospike.operations.read("contestName"),
                                                        Aerospike.operations.read("contestDesc"),
                                                        Aerospike.operations.read("contestPool"),
                                                        Aerospike.operations.read("contestSize"),
                                                        Aerospike.operations.read("contestCode"),
                                                        Aerospike.operations.read("winnerSelection"),
                                                        Aerospike.operations.read("contestType"),
                                                        Aerospike.operations.read("lockPrice"),
                                                        Aerospike.operations.read("user"),
                                                        Aerospike.operations.read("createdAt"),
                                                        Aerospike.operations.read("endTime")
                                                    ]
                                
                                                    var result = await aeroClient.operate(contestKey, ops);

                                                    if(socket){
                                                        ////console.log("Reload Page Sent......" + `contestId-${item}`);
                                                        socket.to(`game-${contest._id}`).emit("reload available", result.bins.lockPrice);
                                                    }
                                                    
                                                    resolve({message:"Successfully Added User Balance", data:result.bins});
                                                }

                                                 
                                            }
                                        }
                                    } catch(err){
                                        //console.log(err);
                                        var contestKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_CONTEST_SET, contest._id);
                                        var contestOps = [
                                            Aerospike.operations.write("status", "active"),
                                            Aerospike.operations.write("isSettled", "false")
                                        ]
                                        await aeroClient.operate(contestKey, contestOps);

                                        resolve({message:'Could not settle quiz'});

                                    }
                                    
                                }
                            } else{
                                var contestSlips = allContestSlips.filter(slip => slip.rk == w);
                                
                                if(contestSlips.length > 0){
                                    var allPercentages = allWinners.filter((winner, index) => winner >= w );
                                    var totalPercentage = 0;

                                    allPercentages.forEach((p,i) => {
                                        if(Number(p) <= (Number(w) +  contestSlips.length -1)){
                                            totalPercentage += winnerShare[p];
                                        }
                                    })

                                    amountPerUser = (((((contest.contestPool / contest.contestSize) * contest.joined ) * totalPercentage) / 100) / contestSlips.length)


                                    console.log("contestSlips:",contestSlips);
                                    console.log("allPercentages:",allPercentages);
                                    console.log("totalPercentage:",totalPercentage);
                                    console.log("amountPerUser",amountPerUser);

                                    try{

                                        for(var z=0; z < contestSlips.length; z++){
                                            var payType = "game_wb";

                                            var writePolicy = new Aerospike.WritePolicy({
                                                totalTimeout:50000,
                                                socketTimeout:50000,
                                                maxRetries:5
                                            })

                                            let walletKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_USER_WALLET_SET, contestSlips[z].uId);
                                            
                                            let walletOps = [ Aerospike.operations.incr(payType, parseFloat(amountPerUser).toFixed(2)) ];

                                            await aeroClient.put(walletKey, walletOps, writePolicy);


                                            var slipKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_SLIP_SET, contestSlips[z]._id.toString());

                                            var slipOps = [
                                                Aerospike.operations.write("st", `${parseFloat(amountPerUser).toFixed(2)}`)
                                            ]

                                            await aeroClient.operate(slipKey, slipOps, writePolicy);
                                            
                                            
                                            if(z == contestSlips.length -1){

                                                var contestKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_CONTEST_SET, contest._id);
                                                var contestOps = [
                                                    Aerospike.operations.write("status", "ended"),
                                                    Aerospike.operations.write("isSettled", "true")
                                                ]
                                                await aeroClient.operate(contestKey, contestOps);

                                                //console.log("Updated winning in user balance _")
                                                
                                                if(l == allWinners.length - 1){
                                                    var ops = [
                                                        Aerospike.operations.write("status","ended"),
                                                        Aerospike.operations.write("isSettled","true"),
                                                        Aerospike.operations.read("isSettled"),
                                                        Aerospike.operations.read("joined"),
                                                        Aerospike.operations.read("_id"),
                                                        Aerospike.operations.read("entryFee"),
                                                        Aerospike.operations.read("status"),
                                                        Aerospike.operations.read("gameId"),
                                                        Aerospike.operations.read("gameType"),
                                                        Aerospike.operations.read("gameName"),
                                                        Aerospike.operations.read("lockPrice"),
                                                        Aerospike.operations.read("contestName"),
                                                        Aerospike.operations.read("contestDesc"),
                                                        Aerospike.operations.read("contestPool"),
                                                        Aerospike.operations.read("contestSize"),
                                                        Aerospike.operations.read("contestCode"),
                                                        Aerospike.operations.read("winnerSelection"),
                                                        Aerospike.operations.read("contestType"),
                                                        Aerospike.operations.read("user"),
                                                        Aerospike.operations.read("createdAt"),
                                                        Aerospike.operations.read("endTime")
                                                    ]
                                
                                                    var result = await aeroClient.operate(contestKey, ops);
                                                    if(socket){
                                                        ////console.log("Reload Page Sent......" + `contestId-${item}`);
                                                        socket.to(`game-${contest._id}`).emit("reload available", result.bins.lockPrice);
                                                    }
                    
                                                    resolve({message:"Successfully Added User Balance", data:result.bins});
                                                }
                                            }
                                        }
                                    } catch(err){
                                        //console.log(err);
                                        var contestKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_CONTEST_SET, contest._id);
                                        var contestOps = [
                                            Aerospike.operations.write("status", "active"),
                                            Aerospike.operations.write("isSettled", "false")
                                        ]
                                        await aeroClient.operate(contestKey, contestOps);

                                        resolve({message:'Could not settle quiz'});
                                    }
                                }
                            }

                            if(l == allWinners.length - 1){
                                var contestKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_CONTEST_SET, contest._id);
                                var ops = [
                                    Aerospike.operations.write("status","ended"),
                                    Aerospike.operations.write("isSettled","true"),
                                    Aerospike.operations.read("isSettled"),
                                    Aerospike.operations.read("joined"),
                                    Aerospike.operations.read("_id"),
                                    Aerospike.operations.read("entryFee"),
                                    Aerospike.operations.read("status"),
                                    Aerospike.operations.read("gameId"),
                                    Aerospike.operations.read("gameName"),
                                    Aerospike.operations.read("gameCur"),
                                    Aerospike.operations.read("contestName"),
                                    Aerospike.operations.read("lockPrice"),
                                    Aerospike.operations.read("contestDesc"),
                                    Aerospike.operations.read("contestPool"),
                                    Aerospike.operations.read("contestSize"),
                                    Aerospike.operations.read("contestCode"),
                                    Aerospike.operations.read("winnerSelection"),
                                    Aerospike.operations.read("contestType"),
                                    Aerospike.operations.read("user"),
                                    Aerospike.operations.read("createdAt"),
                                    Aerospike.operations.read("endTime")
                                ];
            
                                var result = await aeroClient.operate(contestKey, ops);

                                if(socket){
                                    socket.to(`game-${contest._id}`).emit("reload available", result.bins.lockPrice);
                                }

                                resolve({message:"Successfully Added User Balance", data:result.bins});
                            }
                        }
                    });
 
                } else{

                    var contestKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT,process.env.AEROSPIKE_CONTEST_SET, contest._id);

                    var ops = [
                        Aerospike.operations.write("status","cancelled"),
                        Aerospike.operations.read("joined"),
                        Aerospike.operations.read("_id"),
                        Aerospike.operations.read("entryFee"),
                        Aerospike.operations.read("status"),
                        Aerospike.operations.read("gameId"),
                        Aerospike.operations.read("gameName"),
                        Aerospike.operations.read("gameCur"),
                        Aerospike.operations.read("contestName"),
                        Aerospike.operations.read("lockPrice"),
                        Aerospike.operations.read("contestDesc"),
                        Aerospike.operations.read("contestPool"),
                        Aerospike.operations.read("contestSize"),
                        Aerospike.operations.read("contestCode"),
                        Aerospike.operations.read("winnerSelection"),
                        Aerospike.operations.read("contestType"),
                        Aerospike.operations.read("user"),
                        Aerospike.operations.read("createdAt"),
                        Aerospike.operations.read("endTime")
                    ]

                    var result = await aeroClient.operate(contestKey, ops);

                    if(result.bins.joined && result.bins.joined > 0){

                        var query = aeroClient.query(process.env.AEROSPIKE_NAMESPACE_DEFAULT,process.env.AEROSPIKE_SLIP_SET);

                        query.where(Aerospike.filter.equal("cId",contest._id));

                        query.select("uId","dT", "eF");

                        var stream = query.foreach();


                        stream.on("data", async (rec) => {
                            var payType = rec.bins.dT == "conBal" ? "game_cb" : "game_bo";
                            
                            var writePolicy = new Aerospike.WritePolicy({
                                totalTimeout:50000,
                                socketTimeout:50000,
                                maxRetries:5
                            })

                            let walletKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_USER_WALLET_SET, rec.bins.uId);
                            
                            let walletOps = [ Aerospike.operations.incr(payType, parseFloat(rec.bins.eF).toFixed(2)) ];

                            await aeroClient.put(walletKey, walletOps, writePolicy);

                        })

                        stream.on("error", async (err) => {
                            
                            var contestKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT,process.env.AEROSPIKE_CONTEST_SET, contest._id);

                            var ops = [
                                Aerospike.operations.write("status","awaiting")
                            ]

                            await aeroClient.operate(contestKey, ops);
                            reject(err);
                        })

                        stream.on("end", async () => {

                            resolve({message:"Successfully Added User Balance", data:result.bins});
                            
                        });

                    } else{
                        resolve({message:"Successfully Added User Balance", data:result.bins});
                    }   
                }
            }
        })
        
    });
}

async function revertContestFinalSettlement(cId){
    return new Promise(async (resolve, reject) => {

		aeroClient.connect();

        var riskKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_GLOBAL_SET, "riskData");

        var riskOps = [ Aerospike.operations.read("data") ];

        var result = await aeroClient.operate(riskKey, riskOps);

        var parsedData = JSON.parse(result.bins.data.toString());

        var contestKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_CONTEST_SET, cId);

        aeroClient.get(contestKey, async (error, record) => {
            if(error){
                //console.log(error);
                resolve({message:'Could not settle quiz'});
            } else{
                var contest = record.bins;
                                
                var winnerShare = parsedData.winnersList[contest.winnerSelection];

                var allWinners = Object.keys(winnerShare);

                var slipQuery = aeroClient.query(AEROSPIKE_NAMESPACE_DEFAULT, AEROSPIKE_SLIP_SET);

                slipQuery.where(Aerospike.filter.equal("cId", contest._id));

                slipQuery.select("rk", "uId", "_id", "dT", "po");

                var slipStream = slipQuery.foreach();
                var allContestSlips = [];
                slipStream.on("data", (rec) => {
                    allContestSlips.push(rec.bins);
                });

                slipStream.on("end", async () => {
                    allContestSlips = await getRankData(allContestSlips, cId, aeroClient);
                    for(var l=0; l < allWinners.length; l++ ){
                        var w = allWinners[l]
                        if(w.includes("-")){
                            var contestSlips = allContestSlips.filter(slip => ((slip.rk >= w.split("-")[0]) && (slip.rk <= w.split("-")[1])));
                            var allSlips = contestSlips;
                            if(contestSlips.length > 0){
                                var allPercentages = [];
                                contestSlips.forEach((slip, ind)=>{
                                    var foundSlips = contestSlips.filter(s => s.rk == slip.rk);
                                    allWinners.slice(l,(allWinners.length - 1)).map((winner, index) => {
                                        if(!winner.includes("-")){
                                            if( (slip.rk + (foundSlips.length -1)) >= winner){
                                                allPercentages.push(winner);
                                            }
                                        } else{
                                            if( (slip.rk + (foundSlips.length -1)) >= winner.split("-")[0]){
                                                return winner;
                                            }
                                        }
                                    
                                    });

                                    contestSlips.splice(ind,foundSlips.length);
                                }) 
                                
                                var totalPercentage = 0;

                                allPercentages.forEach((p,i) => {
                                        totalPercentage += winnerShare[p];
                                })

                                amountPerUser = (((((contest.contestPool / contest.contestSize) * contest.joined ) * totalPercentage) / 100) / allSlips.length)

                                try{
                                    for(var s=0; s < contestSlips.length; s++){
                                        var payType = "game_wb";

                                        var writePolicy = new Aerospike.WritePolicy({
                                            totalTimeout:50000,
                                            socketTimeout:50000,
                                            maxRetries:5
                                        })
            
                                        let walletKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_USER_WALLET_SET, contestSlips[s].uId);
                                        
                                        let walletOps = [ Aerospike.operations.incr(payType, -1 * parseFloat(amountPerUser).toFixed(2)) ];
            
                                        await aeroClient.put(walletKey, walletOps, writePolicy);

                                        var slipKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_SLIP_SET, contestSlips[s]._id.toString());

                                        var slipOps = [
                                            Aerospike.operations.write("st", `0.0`)
                                        ]

                                        await aeroClient.operate(slipKey, slipOps, writePolicy);
                                        
                                        if(s == contestSlips.length -1){

                                            var contestKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_CONTEST_SET, contest._id);
                                            var contestOps = [
                                                Aerospike.operations.write("status", "active"),
                                                Aerospike.operations.write("isSettled", "false")
                                            ]
                                            await aeroClient.operate(contestKey, contestOps);


                                            //console.log("Updated winning in user balance")
                                            if( l == allWinners.length - 1){

                                                var ops = [
                                                    Aerospike.operations.write("status","active"),
                                                    Aerospike.operations.write("isSettled", "false"),
                                                    Aerospike.operations.read("joined"),
                                                    Aerospike.operations.read("_id"),
                                                    Aerospike.operations.read("entryFee"),
                                                    Aerospike.operations.read("status"),
                                                    Aerospike.operations.read("isSettled"),
                                                    Aerospike.operations.read("gameId"),
                                                    Aerospike.operations.read("gameName"),
                                                    Aerospike.operations.read("contestName"),
                                                    Aerospike.operations.read("contestDesc"),
                                                    Aerospike.operations.read("contestPool"),
                                                    Aerospike.operations.read("contestSize"),
                                                    Aerospike.operations.read("contestCode"),
                                                    Aerospike.operations.read("winnerSelection"),
                                                    Aerospike.operations.read("contestType"),
                                                    Aerospike.operations.read("user"),
                                                    Aerospike.operations.read("createdAt"),
                                                    Aerospike.operations.read("endTime")
                                                ]
                            
                                                var result = await aeroClient.operate(contestKey, ops);
                
                                                resolve({message:"Successfully Added User Balance", data:result.bins});
                                            }

                                        }
                                    }
                                } catch(err){
                                    //console.log(err);
                                    var contestKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_CONTEST_SET, contest._id);
                                    var contestOps = [
                                        Aerospike.operations.write("status", "ended"),
                                        Aerospike.operations.write("isSettled", "true")
                                    ]
                                    await aeroClient.operate(contestKey, contestOps);

                                    resolve({message:'Could not settle quiz'});

                                }
                                
                            }
                        } else{
                            var contestSlips = allContestSlips.filter(slip => slip.rk == w);
                            ////console.log(contestSlips);
                            if(contestSlips.length > 0){
                                var allPercentages = allWinners.filter((winner, index) => winner >= w );
                                var totalPercentage = 0;

                                allPercentages.forEach((p,i) => {
                                    if(Number(p) <= (Number(w) +  contestSlips.length -1)){
                                        totalPercentage += winnerShare[p];
                                    }
                                })

                                amountPerUser = (((((contest.contestPool / contest.contestSize) * contest.joined ) * totalPercentage) / 100) / contestSlips.length)

                                try{
                                    for(var z=0; z < contestSlips.length; z++){
                                        var payType = "game_wb";

                                        var writePolicy = new Aerospike.WritePolicy({
                                            totalTimeout:50000,
                                            socketTimeout:50000,
                                            maxRetries:5
                                        })

                                        let walletKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_USER_WALLET_SET, contestSlips[z].uId);
                                        
                                        let walletOps = [ Aerospike.operations.incr(payType, -1 * parseFloat(amountPerUser).toFixed(2)) ];
            
                                        await aeroClient.put(walletKey, walletOps, writePolicy);

                                        var slipKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_SLIP_SET, contestSlips[z]._id.toString());

                                        var slipOps = [
                                            Aerospike.operations.write("st", `0.0`)
                                        ]

                                        await aeroClient.operate(slipKey, slipOps, writePolicy);
                                        
                                        
                                        if(z == contestSlips.length -1){

                                            var contestKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_CONTEST_SET, contest._id);
                                            var contestOps = [
                                                Aerospike.operations.write("status", "active"),
                                                Aerospike.operations.write("isSettled", "false")
                                            ]
                                            await aeroClient.operate(contestKey, contestOps);

                                            //console.log("Updated winning in user balance _")
                                            
                                            if(l == allWinners.length - 1){
                                                var ops = [
                                                    Aerospike.operations.write("status","active"),
                                                    Aerospike.operations.write("isSettled", "false"),
                                                    Aerospike.operations.read("joined"),
                                                    Aerospike.operations.read("_id"),
                                                    Aerospike.operations.read("entryFee"),
                                                    Aerospike.operations.read("status"),
                                                    Aerospike.operations.read("isSettled"),
                                                    Aerospike.operations.read("gameId"),
                                                    Aerospike.operations.read("gameName"),
                                                    Aerospike.operations.read("contestName"),
                                                    Aerospike.operations.read("contestDesc"),
                                                    Aerospike.operations.read("contestPool"),
                                                    Aerospike.operations.read("contestSize"),
                                                    Aerospike.operations.read("contestCode"),
                                                    Aerospike.operations.read("winnerSelection"),
                                                    Aerospike.operations.read("contestType"),
                                                    Aerospike.operations.read("user"),
                                                    Aerospike.operations.read("createdAt"),
                                                    Aerospike.operations.read("endTime")
                                                ]
                            
                                                var result = await aeroClient.operate(contestKey, ops);
                
                                                resolve({message:"Successfully Added User Balance", data:result.bins});
                                            }
                                                // res.status(200).json({data: contest});    
                                        }
                                    }
                                } catch(err){
                                    //console.log(err);
                                    var contestKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_CONTEST_SET, contest._id);
                                    var contestOps = [
                                        Aerospike.operations.write("status", "ended"),
                                        Aerospike.operations.write("isSettled", "true")
                                    ]
                                    await aeroClient.operate(contestKey, contestOps);

                                    resolve({message:'Could not settle quiz'});
                                }
                            }
                        }

                        if(l == allWinners.length - 1){
                            var ops = [
                                Aerospike.operations.write("status","active"),
                                Aerospike.operations.read("isSettled", "false"),
                                Aerospike.operations.read("joined"),
                                Aerospike.operations.read("_id"),
                                Aerospike.operations.read("entryFee"),
                                Aerospike.operations.read("status"),
                                Aerospike.operations.read("isSettled"),
                                Aerospike.operations.read("gameId"),
                                Aerospike.operations.read("gameName"),
                                Aerospike.operations.read("contestName"),
                                Aerospike.operations.read("contestDesc"),
                                Aerospike.operations.read("contestPool"),
                                Aerospike.operations.read("contestSize"),
                                Aerospike.operations.read("contestCode"),
                                Aerospike.operations.read("winnerSelection"),
                                Aerospike.operations.read("contestType"),
                                Aerospike.operations.read("user"),
                                Aerospike.operations.read("createdAt"),
                                Aerospike.operations.read("endTime")
                            ]
        
                            var result = await aeroClient.operate(contestKey, ops);

                            resolve({message:"Successfully Added User Balance", data:result.bins});
                        }
                    }
                });
            }
        })
        
    });
}

module.exports = {
    submitSlip,
    typedContest,
    contestSlipResult,
    contestSlipHistoryResult,
    fullSlipResult,
    contestFinalSettlement,
    revertContestFinalSettlement
}


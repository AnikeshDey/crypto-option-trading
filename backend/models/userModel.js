const path = require('path');
//const axios = require('axios');
const { v4: uuidv4 } = require('uuid');  //might consider moving to utils func.
//aeropsike connection
const config = require('../database/config');
const Aerospike = require('aerospike');

const getCexBalance = require('../helpers/getCexBalance');

const aeroClient = config.database.client;
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






//gamingWallet
async function gamingWallet(data, full=null) {
    try{
		const uId = data;

        console.log(uId, process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_USER_WALLET_SET);
	
		aeroClient.connect();
		
		const key = new Aerospike.Key(AEROSPIKE_NAMESPACE_DEFAULT, AEROSPIKE_USER_WALLET_SET, uId);
		
		var { bins } = await aeroClient.get(key);
		
        if(!full){
            return {wallet: {
                cb: bins.game_cb,
                wb: bins.game_wb,
                bo: bins.game_bo,
                mi: bins.game_mi,
                mo: bins.game_mo,
                pv: bins.game_pv,
                wv: bins.game_wv,
                bw: bins.game_bw,
                pc: bins.game_pc,
                wc: bins.game_wc,
                cc: bins.game_cc
            }};
        } else {
            let data = {};
            for (const property in bins.wallets) {
                data[`${property}_w`] = property;
                data[`${property}_bal`] = await getCexBalance(uId, property);
            }

            return data;
        }
		
	} catch(err){
		console.log(err);
		return null;
	}
}

//gamingTransactions
async function gamingTransactions(uId, tab, start, end, ){
	return new Promise((resolve, reject) => {

		aeroClient.connect();

		var query = aeroClient.query(AEROSPIKE_NAMESPACE_DEFAULT, `gaming_${tab}History`);
    
		query.where(Aerospike.filter.equal("uId", uId));
		query.select("id", "from", "cT", "amount", "status");
		var stream = query.foreach();
		var transactionArray = [];
		count = 0;
		stream.on("data", (rec) => {
			count++;
			if(count > start && count <= end){
				transactionArray.push(rec.bins);
			} else if(count > end){
				stream.end();
			}
		})

		stream.on("error", (err) => {
			reject(err);
		})

		stream.on("end", () => {
			resolve(transactionArray.sort(function(a, b){return b.cT - a.cT}));
		});
	});
  }

//gamingWallet
async function gamingSingleTransaction(id, type) {
    try{
		aeroClient.connect();

        var key = new Aerospike.Key(AEROSPIKE_NAMESPACE_DEFAULT, `gaming_${type}History`, id);
        var rec  = await aeroClient.get(key);

        return rec.bins;
	} catch(err){
		console.log(err);
		return null;
	}
}

//gamingWallet
async function depositeBalance(uId, amount) {
    try{
		aeroClient.connect()

        var key = new Aerospike.Key(AEROSPIKE_NAMESPACE_DEFAULT, AEROSPIKE_USER_WALLET_SET, uId);

        let { bins } = await aeroClient.get(key);

        bins.wallets[currency]["bal"] =  Number(bins.wallets[currency]["bal"]) - Number(amount);
        bins.wallets["game_cb"] =  Number(bins.wallets["game_cb"]) + Number(amount);

        await aeroClient.put(key, bins);

        let toID = Math.floor(Math.random() * 99999999) + 10000000;

        let transactionBins = {
            id:toID.toString(),
            userId:uId,
            address:"game_cb",
            coin:currency,
            type:"debit",
            amount:amount,
            txId:toID,
            fee:0,
            txTime:new Date().getTime(),
            txType:"internal",
            metadata: "null"
        }

        let transactionKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, "allCexTransaction", toID.toString());

        aeroClient.put(transactionKey, transactionBins);

        return {wallet: {
            cb: bins.game_cb,
            wb: bins.game_wb,
            bo: bins.game_bo,
            mi: bins.game_mi,
            mo: bins.game_mo,
            pv: bins.game_pv,
            wv: bins.game_wv,
            bw: bins.game_bw,
            pc: bins.game_pc,
            wc: bins.game_wc,
            cc: bins.game_cc
        }};;
        
	} catch(err){
		console.log(err);
		return null;
	}
}

async function withdrawBalance(uId, withdrawFrom, withdrawTo, amount) {
    try{
		aeroClient.connect();

        var key = new Aerospike.Key(AEROSPIKE_NAMESPACE_DEFAULT, AEROSPIKE_USER_WALLET_SET, uId);

        let { bins } = await aeroClient.get(key);

        bins.wallets[withdrawFrom] =  Number(bins.wallets[withdrawFrom]) - Number(amount);
        bins.wallets[withdrawTo]["bal"] =  Number(bins.wallets[withdrawTo]["bal"]) + Number(amount);

        await aeroClient.put(key, bins);

        let toID = Math.floor(Math.random() * 99999999) + 10000000;

        let transactionBins = {
            id:toID.toString(),
            userId:uId,
            address:bins.wallets[withdrawTo]["ad"],
            coin:withdrawTo,
            type:"credit",
            amount:amount,
            txId:toID,
            fee:0,
            txTime:new Date().getTime(),
            txType:"internal",
            metadata: "null"
        }

        let transactionKey = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, "allCexTransaction", toID.toString());

        aeroClient.put(transactionKey, transactionBins);

        return {wallet: {
            cb: bins.game_cb,
            wb: bins.game_wb,
            bo: bins.game_bo,
            mi: bins.game_mi,
            mo: bins.game_mo,
            pv: bins.game_pv,
            wv: bins.game_wv,
            bw: bins.game_bw,
            pc: bins.game_pc,
            wc: bins.game_wc,
            cc: bins.game_cc
        }};;
        
	} catch(err){
		console.log(err);
		return null;
	}
}

async function transferSelf(uId, amount) {
    try{
		aeroClient.connect()

        var key = new Aerospike.Key(AEROSPIKE_NAMESPACE_DEFAULT, AEROSPIKE_USER_WALLET_SET, uId);

        let { bins } = await aeroClient.get(key);

        bins.wallets["game_wb"] =  bins.wallets["game_wb"] - Number(amount);
        bins.wallets["game_cb"] =  Number(bins.wallets["game_cb"]) + Number(amount);

        await aeroClient.put(key, bins);

        return {wallet: {
            cb: bins.game_cb,
            wb: bins.game_wb,
            bo: bins.game_bo,
            mi: bins.game_mi,
            mo: bins.game_mo,
            pv: bins.game_pv,
            wv: bins.game_wv,
            bw: bins.game_bw,
            pc: bins.game_pc,
            wc: bins.game_wc,
            cc: bins.game_cc
        }};;
        
	} catch(err){
		console.log(err);
		return null;
	}
}

//
async function checkIfUserExists(uId) {
    try{
		aeroClient.connect()

        let key = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_USER_SET, uId.toString());

        let exists = await aeroClient.exists(key);

        return exists;
	} catch(err){
		console.log(err);
		return null;
	}
}

async function userStats(uId, gameStats, dateStart, dateEnd) {
    try{
		aeroClient.connect()

        let key = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_USER_SET, uId.toString());

        let ops = [Aerospike.operations.read("stats")];

        let { bins } = await aeroClient.operate(key, ops);

        let allSlipIds = [];

        //console.log(bins);

        if(Object.keys(bins).length > 0 && bins.stats){
            for(let z=0; z < Object.keys(bins.stats).length; z++){
                let el = bins.stats[Object.keys(bins.stats)[z]];
                if(req.query.timeRange > 0){
                    if(new Date(el.createdAt).getTime() >= dateStart.getTime() && new Date(el.createdAt).getTime() <= dateEnd.getTime()){
                        allSlipIds.push({key: new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, `allHistorySlips-${el.setId}`, el.slipId.toString()), readAllBins: true})
                    }
                } else{
                    allSlipIds.push({key: new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, `allHistorySlips-${el.setId}`, el.slipId.toString()), readAllBins: true})
                }  
            }   
    
            if(allSlipIds.length > 0){
                let itemCount = 1000;
                for(var i=0; i < allSlipIds.length; i++){
                    let itemStart = i * itemCount;
                    let itemEnd = ((i + 1) * itemCount);
                    let keys = allSlipIds.slice(itemStart, itemEnd);
                    if(keys.length > 0){
                        ////console.log("keys:", keys.length);
                        let readPolicy = new Aerospike.ReadPolicy({
                            totalTimeout:50000,
                            socketTimeout:50000,
                            maxRetries:2
                        }) 
                        let results = await aeroClient.batchRead(keys, readPolicy)
                        //var allResults = results;
                        ////console.log("results:",results);
    
                        if(results.length > 0){
                            for(let j=0; j < results.length; j++){
                                let record = results[j].record;

								slipBins = record.bins;

                                gameStats.matchesPlayed++;
                                if(slipBins.cId in contestObject){
                                    gameStats.contestObject[slipBins.cId]++;
                                } else {
                                    gameStats.contestObject[slipBins.cId] = 1;
                                }
    
                                if(slipBins.gN in sportObject){
                                    gameStats.sportObject[slipBins.gN].totalPlayed++
                                } else {
                                    gameStats.sportObject[slipBins.gN] = { 
                                        totalPlayed:1,
                                        won:0,
                                        loss:0
                                    };
                                }
    
                                if(Number(slipBins.st) > Number(slipBins.eF)){
                                    let moneyWon = Number(slipBins.st) - Number(slipBins.eF);
                                    gameStats.totalMoneyWon += moneyWon;
                                    gameStats.sportObject[slipBins.gN].won++;
                                    gameStats.matchesWon++;
                                    gameStats.wins.push(moneyWon);
                                } else {
                                    let moneyLost = Number(slipBins.eF) - Number(slipBins.st);
                                    ////console.log("money lost:", moneyLost);
                                    gameStats.totalMoneyLost += moneyLost;
                                    gameStats.sportObject[slipBins.gN].loss++;
                                    gameStats.matchesLost++;
                                    gameStats.losses.push(moneyLost)
                                }
    
                                
                                if(i == allSlipIds.length - 1 && j == results.length - 1){
                                    return gameStats;
                                }
                            }
                        } else {
                            if(i == allSlipIds.length - 1){
                                return gameStats;
                            }
                        }
                        
                      
                    } else{
                        if(i == allSlipIds.length - 1){
                            return gameStats;
                        }
                    }
                }
            } else{
                return gameStats;
            }
        } else{
            return gameStats;
        }
	} catch(err){
		console.log(err);
		return gameStats;
	}
}

module.exports = {
    gamingWallet,
	gamingTransactions,
	gamingSingleTransaction,
	checkIfUserExists,
	userStats,
    depositeBalance,
    transferSelf,
    withdrawBalance
}
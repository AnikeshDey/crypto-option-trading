const path = require('path');
//const axios = require('axios');
const { v4: uuidv4 } = require('uuid');  //might consider moving to utils func.
//aeropsike connection
const config = require('../database/config');
const Aerospike = require('aerospike');
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





//singleCoin
async function singleCoin(id) {
    try{
	
		aeroClient.connect();
		
		const key = new Aerospike.Key(AEROSPIKE_NAMESPACE_DEFAULT, AEROSPIKE_CRYPTO_PRICE_SET, id);
		
		var { bins } = await aeroClient.get(key);
			
		return bins;
	} catch(err){
		throw err;
	}
}

//allCoins
async function allCoins(){
	return new Promise((resolve, reject) => {

		aeroClient.connect();

		var query = aeroClient.query(AEROSPIKE_NAMESPACE_DEFAULT, AEROSPIKE_CRYPTO_PRICE_SET);
    
		var stream = query.foreach();
        //var count = 0;
        var allEvents = [];
        stream.on('data', function (record) {
            allEvents.push(record.bins);
        })

        stream.on('error', function (error) {
            //handle error
            //console.log(error);
            throw error;
        })

        stream.on('end', function () {
            //signal the end of query result
            resolve(allEvents.sort(function(a, b){return a.id - b.id}));
        })
	});
}

module.exports = {
    singleCoin,
    allCoins
}


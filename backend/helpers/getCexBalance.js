const Aerospike = require("aerospike");
const config = require('../database/config');
const aeroClient = config.database.client;

const getCexBalance = (uId, currency) => {
	
	return new Promise(async function(resolve, reject) {
	  try{

		aeroClient.connect();
		
		const query = aeroClient.query("test_ssd", "allCexTransaction");
		query.where(Aerospike.filter.equal("userId", uId));
		query.select("coin", "type", "amount");

		const stream = query.foreach(); 
		let totalBalance = 0;
		stream.on("data", ({bins}) => {
			if(bins.coin == currency){
				if(bins.type == "credit"){
					totalBalance += Number(bins.amount); 
				} else {
					totalBalance -= Number(bins.amount);
				}
			}
		});
		
		stream.on("error", (err) => {
			console.log("genCexBalance Error:", err);
			return reject(err);
		});

		stream.on("end", () => {
			//console.log(`totalBalance of ${currency}: ${totalBalance}`);
			return resolve(totalBalance);
		})
	  } catch(err){
		  console.log("genCexBalance Error:", err);
		  return reject(err);
	  }
	})
};

module.exports = getCexBalance;
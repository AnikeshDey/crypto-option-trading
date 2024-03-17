import Aerospike, { Client } from "aerospike";
import { getAerospikeClient } from "../../../config/aerospike";

import { SlipData } from "../interfaces/SlipData";

class Wallet {
    static NAMESPACE = process.env.AEROSPIKE_NAMESPACE_DEFAULT || "test";
    static SET = process.env.AEROSPIKE_USER_WALLET_SET || "wallets";

    constructor(){};

    static async getWallet(userId:string): Promise<Object | undefined> {
        try{
          const aeroClient: Client = await getAerospikeClient();
          const key = new Aerospike.Key(Wallet.NAMESPACE, Wallet.SET, userId);
          
          let data: Object | undefined;
          
          if(aeroClient instanceof Client){
            let record = await aeroClient.get(key);
            data = record.bins;
          }
          
          return data;
  
        } catch(err:any){
            throw err;
        }
    }

    static async takeEntryFee(userId:string, feeType:string, fee:number): Promise<void> {
        try{
          const aeroClient: Client = await getAerospikeClient();
          const key = new Aerospike.Key(Wallet.NAMESPACE, Wallet.SET, userId);
          
          let ops:any[1] = [
            Aerospike.operations.incr(feeType, -1 * fee)
          ]
          
          if(aeroClient instanceof Client){
            await aeroClient.operate(key, ops);
          }
  
        } catch(err:any){
            throw err;
        }
    }

    static async returnBulkEntryFee(slips:SlipData[], fee:number): Promise<void> {
        try{
            const aeroClient: Client = await getAerospikeClient();
            
            if(aeroClient instanceof Client){
                const batchType = Aerospike.batchType;
                let batchSize = 300;
                let policy = new Aerospike.WritePolicy({
                    totalTimeout:50000,
                    socketTimeout:50000,
                    maxRetries:2
                }) 
                
                for(let batch=0; batch<slips.length; batch+=batchSize) {
                    var batchRecords:any = []
                    
                    for (let x = 0; x<batchSize && x+batch<slips.length; x++) {
                            let payType = slips[batch + x].dT === "conBal" ? "game_cb" : "game_bo";

                            batchRecords.push({
                                type: batchType.BATCH_WRITE,
                                key: new Aerospike.Key(Wallet.NAMESPACE, Wallet.SET, slips[batch + x].uId),
                                ops:[
                                    Aerospike.operations.incr(payType, slips[batch + x].eF)
                                ]
                            })
                    }
                    // Send next batch after all promises resolved 
                    ////console.log(promises);
                    await aeroClient.batchWrite(batchRecords, policy);
                    //console.log("Inserting History Contest Data......" + (batch == 0 ? batchSize : batchSize + batch));
                }
            }
  
        } catch(err:any){
            throw err;
        }
    }

    static async takeBulkEntryFee(slips:SlipData[], fee:number): Promise<void> {
        try{
            const aeroClient: Client = await getAerospikeClient();
            
            if(aeroClient instanceof Client){
                const batchType = Aerospike.batchType;
                let batchSize = 300;
                let policy = new Aerospike.WritePolicy({
                    totalTimeout:50000,
                    socketTimeout:50000,
                    maxRetries:2
                }) 
                
                for(let batch=0; batch<slips.length; batch+=batchSize) {
                    var batchRecords:any = []
                    
                    for (let x = 0; x<batchSize && x+batch<slips.length; x++) {
                            let payType = slips[batch + x].dT === "conBal" ? "game_cb" : "game_bo";

                            batchRecords.push({
                                type: batchType.BATCH_WRITE,
                                key: new Aerospike.Key(Wallet.NAMESPACE, Wallet.SET, slips[batch + x].uId),
                                ops:[
                                    Aerospike.operations.incr(payType, -1 * slips[batch + x].eF)
                                ]
                            })
                    }
                    // Send next batch after all promises resolved 
                    ////console.log(promises);
                    await aeroClient.batchWrite(batchRecords, policy);
                    //console.log("Inserting History Contest Data......" + (batch == 0 ? batchSize : batchSize + batch));
                }
            }
  
        } catch(err:any){
            throw err;
        }
    }

    static async putBulkPrizeMoney(userIds:string[], money:number): Promise<void> {
        try{
            const aeroClient: Client = await getAerospikeClient();
            
            if(aeroClient instanceof Client){
                const batchType = Aerospike.batchType;
                let batchSize = 300;
                let policy = new Aerospike.WritePolicy({
                    totalTimeout:50000,
                    socketTimeout:50000,
                    maxRetries:2
                }) 
                
                for(let batch=0; batch<userIds.length; batch+=batchSize) {
                    var batchRecords:any = []
                    
                    for (let x = 0; x<batchSize && x+batch<userIds.length; x++) {
                            batchRecords.push({
                                type: batchType.BATCH_WRITE,
                                key: new Aerospike.Key(Wallet.NAMESPACE, Wallet.SET, userIds[batch + x]),
                                ops:[
                                    Aerospike.operations.incr("wb", money)
                                ]
                            })
                    }
                    // Send next batch after all promises resolved 
                    ////console.log(promises);
                    await aeroClient.batchWrite(batchRecords, policy);
                    //console.log("Inserting History Contest Data......" + (batch == 0 ? batchSize : batchSize + batch));
                }
            }
  
        } catch(err:any){
            throw err;
        }
    }

    static async returnBulkPrizeMoney(userIds:string[], money:number): Promise<void> {
        try{
            const aeroClient: Client = await getAerospikeClient();
            
            if(aeroClient instanceof Client){
                const batchType = Aerospike.batchType;
                let batchSize = 300;
                let policy = new Aerospike.WritePolicy({
                    totalTimeout:50000,
                    socketTimeout:50000,
                    maxRetries:2
                }) 
                
                for(let batch=0; batch<userIds.length; batch+=batchSize) {
                    var batchRecords:any = []
                    
                    for (let x = 0; x<batchSize && x+batch<userIds.length; x++) {
                            batchRecords.push({
                                type: batchType.BATCH_WRITE,
                                key: new Aerospike.Key(Wallet.NAMESPACE, Wallet.SET, userIds[batch + x]),
                                ops:[
                                    Aerospike.operations.incr("wb", -1 * money)
                                ]
                            })
                    }
                    // Send next batch after all promises resolved 
                    ////console.log(promises);
                    await aeroClient.batchWrite(batchRecords, policy);
                    //console.log("Inserting History Contest Data......" + (batch == 0 ? batchSize : batchSize + batch));
                }
            }
  
        } catch(err:any){
            throw err;
        }
    }
}

export { Wallet };
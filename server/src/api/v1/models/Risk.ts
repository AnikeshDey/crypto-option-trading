import Aerospike, { Client } from "aerospike";
import { getAerospikeClient } from "../../../config/aerospike";

import SavedRiskData from "../../../config/constants/RiskManagement.json";

class Risk {
    static NAMESPACE = process.env.AEROSPIKE_NAMESPACE_DEFAULT || "test";
    static SET = process.env.AEROSPIKE_GLOBAL_SET || "global";
    static ID = process.env.RISK_DATA_ID || "cryptoRiskData";

    constructor(){};

    static async getData(): Promise<Object | undefined> {
        const aeroClient: Client = await getAerospikeClient();
          const key = new Aerospike.Key(Risk.NAMESPACE, Risk.SET, Risk.ID);
        try{
          
          let data: Object | undefined;
          
          if(aeroClient instanceof Client){
            let record = await aeroClient.get(key);
            data = JSON.parse(record.bins.data.toString());
          }
          
          return data;
  
        } catch(err:any){
            let obj = JSON.parse(JSON.stringify(SavedRiskData));
            //console.log("obj:",obj);
            var bins = {data:Buffer.from(JSON.stringify(obj))};
            if(aeroClient instanceof Client){
                await aeroClient.put(key, bins);
            }
            
            return obj;
        }
    }
}

export { Risk };
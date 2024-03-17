import Aerospike, { Client } from "aerospike";
import { ContestCounterData } from "../interfaces/ContestCounterData";
import { getAerospikeClient } from "../../../config/aerospike";


class ContestCounter implements ContestCounterData {

    static NAMESPACE = process.env.AEROSPIKE_NAMESPACE_DEFAULT || "test";
    static SET = process.env.AEROSPIKE_COUNTER_SET || "contestCounter";

    pk: string;
    users: number;
    posts: number;
    spAS: number;
    spHS: number;
    spAC: number;
    spEC: number;
    p2pBS: number;
  
    constructor(
      pk: string,
      users: number,
      posts: number,
      spAS: number,
      spHS: number,
      spAC: number,
      spEC: number,
      p2pBS: number
    ) {
      this.pk = pk;
      this.users = users;
      this.posts = posts;
      this.spAS = spAS;
      this.spHS = spHS;
      this.spAC = spAC;
      this.spEC = spEC;
      this.p2pBS = p2pBS;
    }

    async save(): Promise<ContestCounterData> {
      try{
        const aeroClient: Client = await getAerospikeClient();
        const bins: ContestCounterData = {...this};
        const key = new Aerospike.Key(ContestCounter.NAMESPACE, ContestCounter.SET, this.pk);

        if(aeroClient instanceof Client){
          await aeroClient.put(key, bins);
        }
        
        return bins;

      } catch(err:any){
        throw err;
      }
    }

    static async findById(id:string): Promise<ContestCounterData | undefined> {
      try{
        const aeroClient: Client = await getAerospikeClient();
        const key = new Aerospike.Key(ContestCounter.NAMESPACE, ContestCounter.SET, id);
        
        let counter: ContestCounterData | undefined;
        
        if(aeroClient instanceof Client){
          counter = await aeroClient.get(key);
        }
        
        return counter;

      } catch(err:any){
        throw err;
      }
    }
}

export { ContestCounter };
  
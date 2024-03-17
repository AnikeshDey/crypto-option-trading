import Aerospike, { Client } from "aerospike";
import { getAerospikeClient } from "../../../config/aerospike";
import { SlipData } from "../interfaces/SlipData";

class Slip implements SlipData {

    static NAMESPACE = process.env.AEROSPIKE_NAMESPACE_DEFAULT || "test";
    static SET = process.env.AEROSPIKE_SLIP_SET || "allSlips";

    _id: string;
    spAS: number;
    cId: string;
    cN: string;
    gN: string;
    dT: string;
    cc: number;
    uId: string;
    uP: string;
    uN: string;
    gId: string;
    st: string;
    po: string;
    rk: number;
    eF: number;
    mS: number;
    cT: number;
  
    constructor(
      _id: string,
      spAS: number,
      cId: string,
      cN: string,
      gN: string,
      dT: string,
      cc: number,
      uId: string,
      uP: string,
      uN: string,
      gId: string,
      st: string,
      po: string,
      rk: number,
      eF: number,
      mS: number,
      cT: number
    ) {
      this._id = _id;
      this.spAS = spAS;
      this.cId = cId;
      this.cN = cN;
      this.gN = gN;
      this.dT = dT;
      this.cc = cc;
      this.uId = uId;
      this.uP = uP;
      this.uN = uN;
      this.gId = gId;
      this.st = st;
      this.po = po;
      this.rk = rk;
      this.eF = eF;
      this.mS = mS;
      this.cT = cT;
    }

    async save(): Promise<SlipData> {
      try{
        const aeroClient: Client = await getAerospikeClient();
        const bins: SlipData = {...this};
        const key = new Aerospike.Key(Slip.NAMESPACE, Slip.SET, this._id);

        if(aeroClient instanceof Client){
          await aeroClient.put(key, bins);
        }
        
        return bins;

      } catch(err:any){
        throw err;
      }
    }

    static async findSlipByContestId(contestId:string): Promise<SlipData[]> {
      return new Promise<SlipData[]>(async (resolve, reject) => {
        try{
          const aeroClient: Client = await getAerospikeClient();
          
          let data:SlipData[] = [];
          
          if(aeroClient instanceof Client){
            var query = aeroClient.query(Slip.NAMESPACE, Slip.SET);
  
            query.where(Aerospike.filter.equal("cId", contestId));
  
            let stream:any = query.foreach();
  
            stream.on("data", async ({...bins}:SlipData) => {
                data.push(bins);
  
            })
  
            stream.on("error", async (err:Error) => {
                //console.log(err);
                reject(err);
            })
  
            stream.on("end", async () => {
              resolve(data);
            });
          }
  
        } catch(err:any){
            reject(err);
        }
      });
    }
}

export { Slip };
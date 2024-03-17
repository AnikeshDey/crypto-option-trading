import Aerospike, { Client } from "aerospike";
import { getAerospikeClient } from "../../../config/aerospike";
import { CryptoData } from "../interfaces/CryptoData";

class Crypto implements CryptoData {
    static NAMESPACE = process.env.AEROSPIKE_NAMESPACE_DEFAULT || "test";
    static SET = process.env.AEROSPIKE_CRYPTO_PRICE_SET || "crypto";

    id: string;
    nM: string;
    fnM: string;
    tG: string;
    pR: number;
    pRc: string;
    pRcP: string;
    mC: number;
    mCr: number;
    mCC: number;
    mCCP: number;
    vol: number;
    fDV: number;
    h_24: number;
    l_24: number;
    cS: number;
    tS: number;
    mS: number | null;
    ath: number;
    athCP: number;
    athD: string;
    atl: number;
    atlCP: number;
    atlD: string;
    roi: any;
    updatedAt: string;
  
    constructor(
      id: string,
      nM: string,
      fnM: string,
      tG: string,
      pR: number,
      pRc: string,
      pRcP: string,
      mC: number,
      mCr: number,
      mCC: number,
      mCCP: number,
      vol: number,
      fDV: number,
      h_24: number,
      l_24: number,
      cS: number,
      tS: number,
      mS: number | null,
      ath: number,
      athCP: number,
      athD: string,
      atl: number,
      atlCP: number,
      atlD: string,
      roi: any,
      updatedAt: string
    ) {
      this.id = id;
      this.nM = nM;
      this.fnM = fnM;
      this.tG = tG;
      this.pR = pR;
      this.pRc = pRc;
      this.pRcP = pRcP;
      this.mC = mC;
      this.mCr = mCr;
      this.mCC = mCC;
      this.mCCP = mCCP;
      this.vol = vol;
      this.fDV = fDV;
      this.h_24 = h_24;
      this.l_24 = l_24;
      this.cS = cS;
      this.tS = tS;
      this.mS = mS;
      this.ath = ath;
      this.athCP = athCP;
      this.athD = athD;
      this.atl = atl;
      this.atlCP = atlCP;
      this.atlD = atlD;
      this.roi = roi;
      this.updatedAt = updatedAt;
    }

    async save(): Promise<CryptoData> {
      try{
        const aeroClient: Client = await getAerospikeClient();
        const bins: CryptoData = {...this};
        const key = new Aerospike.Key(Crypto.NAMESPACE, Crypto.SET, this.id);

        if(aeroClient instanceof Client){
          await aeroClient.put(key, bins);
        }
        
        return bins;

      } catch(err:any){
        throw err;
      }
    }

    static async findById(id:string): Promise<CryptoData | undefined> {
      try{
        const aeroClient: Client = await getAerospikeClient();
        const key = new Aerospike.Key(Crypto.NAMESPACE, Crypto.SET, id);
        
        let crypto: CryptoData | undefined;
        
        if(aeroClient instanceof Client){
          crypto = await aeroClient.get(key);
        }
        
        return crypto;

      } catch(err:any){
        throw err;
      }
    }

    static async findAll(): Promise<CryptoData[]> {
      return new Promise<CryptoData[]>(async (resolve, reject) => {
        const aeroClient: Client = await getAerospikeClient();
        if(aeroClient instanceof Client){
          var query = aeroClient.query(Crypto.NAMESPACE, Crypto.SET);
          var stream:any = query.foreach();
          var allEvents:CryptoData[] = [];
          
          stream.on("data", ({...bins}:CryptoData) => {
            allEvents.push(bins);
          });
          
          stream.on("error", (error: Error) => {
            console.log(error);
            reject(error);
          });
          
          stream.on("end", () => {
            resolve(allEvents);
          });
        }
        
      });
    }

    static async updatePrice(id:string, price:number, priceChange:string, priceChangePercentage:string, lastUpdated:string): Promise<void> {
      try{
        const aeroClient: Client = await getAerospikeClient();
        const key = new Aerospike.Key(Crypto.NAMESPACE, Crypto.SET, id);
        
        let ops: any[4] = [
            Aerospike.operations.write("pR", price),//price
            Aerospike.operations.write("pRc", priceChange),
            Aerospike.operations.write("pRcP", priceChangePercentage),
            Aerospike.operations.write("updatedAt", lastUpdated),
        ]
        
        
        if(aeroClient instanceof Client){
          await aeroClient.operate(key, ops);
        }

      } catch(err:any){
        throw err;
      }
    }

}
  
export { Crypto };
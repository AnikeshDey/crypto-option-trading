import Aerospike, { Client } from "aerospike";
import crypto from "crypto";
import { ContestData } from "../interfaces/ContestData";
import { getAerospikeClient } from "../../../config/aerospike";

import dotenv from "dotenv";
dotenv.config();

enum Status {
    ACTIVE = "active",
    ENDED = "ended",
    CANCELLED = "cancelled"
}



class Contest implements ContestData {

    static NAMESPACE:string = process.env.AEROSPIKE_NAMESPACE_DEFAULT || "test";
    static SET:string = process.env.AEROSPIKE_CONTEST_SET || "allContests";

    public _id: string;
    public gameId: string;
    public gameName: string;
    public gameCur: string;
    public contestName: string;
    public contestDesc: string;
    public contestPool: number;
    public contestSize: number;
    public contestCode: string;
    public entryFee: number;
    public winnerSelection: string;
    public contestType: string;
    public joined: number;
    public status: string;
    public user: string;
    public canSettle: true | false;
    public isSettled: true | false;
    public lockPrice: number | string;
    public timeStamp: number;
    public createdAt: number;
    public endTime: number;
    public settleTime: number;
  
    constructor(
      _id: string,
      gameId: string,
      gameName: string,
      gameCur: string,
      contestName: string,
      contestDesc: string,
      contestPool: number,
      contestSize: number,
      contestCode: string,
      entryFee: number,
      winnerSelection: string,
      contestType: string,
      joined: number,
      status: string,
      user: string,
      canSettle: true | false,
      isSettled: true | false,
      lockPrice: number | string,
      timeStamp: number,
      createdAt: number,
      endTime: number,
      settleTime: number
    ) {
      this._id = _id;
      this.gameId = gameId;
      this.gameName = gameName;
      this.gameCur = gameCur;
      this.contestName = contestName;
      this.contestDesc = contestDesc;
      this.contestPool = contestPool;
      this.contestSize = contestSize;
      this.contestCode = contestCode;
      this.entryFee = entryFee;
      this.winnerSelection = winnerSelection;
      this.contestType = contestType;
      this.joined = joined;
      this.status = status;
      this.user = user;
      this.canSettle = canSettle;
      this.isSettled = isSettled;
      this.lockPrice = lockPrice;
      this.timeStamp = timeStamp;
      this.createdAt = createdAt;
      this.endTime = endTime;
      this.settleTime = settleTime;
    }

    async save(): Promise<ContestData> {
      try{
        const aeroClient: Client = await getAerospikeClient();
        const bins: ContestData = {...this};
        const key = new Aerospike.Key(Contest.NAMESPACE, Contest.SET, this._id);

        if(aeroClient instanceof Client){
          await aeroClient.put(key, bins);
        }
        
        return bins;

      } catch(err:any){
        throw err;
      }
    }

    static async genDefaultContest(gId:string, gN:string, cur:string, quizDefaultPool:number, quizDefaultParticipants:number, quizComm:number, uId:string): Promise<ContestData> {
      try{
        const aeroClient: Client = await getAerospikeClient();
        const contestId:string = crypto.randomInt(100000000000, 999999999999).toString();
        const bins: ContestData = {
            _id:contestId,
            gameId:gId,
            gameName:gN,
            gameCur:cur,
            contestName:"Main Contest",
            contestDesc:"",
            contestPool:quizDefaultPool,
            contestSize:quizDefaultParticipants,
            contestCode:(Math.floor(Math.random() * 99999999) + 19000000).toString(),
            entryFee: Number(((quizDefaultPool / quizDefaultParticipants) + (((quizDefaultPool / quizDefaultParticipants) * quizComm) / 100)).toFixed(2)),
            winnerSelection:"3",
            contestType:'N/A',
            joined:0,
            status:"active",
            user:uId,
            canSettle:false,
            isSettled:false,
            lockPrice:"null",
            timeStamp:180,
            createdAt:new Date(new Date().getTime()).getTime(),
            endTime:new Date(new Date().getTime() + (30 * 60 * 1000)).getTime(),
            settleTime:(new Date(new Date().getTime() + (30 * 60 * 1000) + (180 * 60 * 1000)).getTime())
        };
        const key = new Aerospike.Key(Contest.NAMESPACE, Contest.SET, contestId);

        if(aeroClient instanceof Client){
          await aeroClient.put(key, bins);
        }
        
        return bins;

      } catch(err:any){
        throw err;
      }
    }

    static async findById(id:string): Promise<ContestData | undefined> {
      try{
        const aeroClient: Client = await getAerospikeClient();
        const key = new Aerospike.Key(Contest.NAMESPACE, Contest.SET, id);
        
        let contest: ContestData | undefined;
        
        if(aeroClient instanceof Client){
          contest = await aeroClient.get(key);
        }
        
        return contest;

      } catch(err:any){
        throw err;
      }
    }

    static async findByContestCode(code:string): Promise<ContestData[]> {
      return new Promise<ContestData[]>(async (resolve, reject) => {
        const aeroClient: Client = await getAerospikeClient();
        if(aeroClient instanceof Client){
          var query = aeroClient.query(Contest.NAMESPACE, Contest.SET);
          query.where(Aerospike.filter.equal("contestCode", code));
          var stream:any = query.foreach();
          var allContests:ContestData[] = [];
          
          stream.on("data", ({...bins}:ContestData) => {
            allContests.push(bins);
          });
          
          stream.on("error", (error: Error) => {
            console.log(error);
            reject(error);
          });
          
          stream.on("end", () => {
            resolve(allContests);
          });
        }
        
      });
    }

    static async updateById(id:string, contestName:string, contestDesc:string, contestPrize:number, contestMemberCount:number, contestEntryFee:number, winnerSelection:string): Promise<void> {
      try{
        const aeroClient: Client = await getAerospikeClient();
        const key = new Aerospike.Key(Contest.NAMESPACE, Contest.SET, id);
        
        let ops: any[6] = [
          Aerospike.operations.write("contestName",contestName),
          Aerospike.operations.write("contestDesc",contestDesc),
          Aerospike.operations.write("contestPool", contestPrize),
          Aerospike.operations.write("contestSize",contestMemberCount),
          Aerospike.operations.write("entryFee", contestEntryFee),
          Aerospike.operations.write("winnerSelection",winnerSelection)
        ]
        
        
        if(aeroClient instanceof Client){
          await aeroClient.operate(key, ops);
        }

      } catch(err:any){
        throw err;
      }
    }

    static async getLockPrice(id:string): Promise<string | number> {
      try{
        const aeroClient: Client = await getAerospikeClient();
        const key = new Aerospike.Key(Contest.NAMESPACE, Contest.SET, id);
        let lockPrice:string | number;
        
        if(aeroClient instanceof Client){
          let { ...bins }:ContestData = await aeroClient.get(key);
          
          if(bins.lockPrice == "null"){
              //console.log("Looking for lockPrice in Settlement");
              var data = await (await fetch(`${process.env.CRYPTO_SINGLE_PRICE_API_URL}${bins.gameName}`)).json();
              var newContestOps = [Aerospike.operations.write("lockPrice", data[0].current_price)];
              var contestKey = new Aerospike.Key(Contest.NAMESPACE, Contest.SET, id);
              await aeroClient.operate(contestKey, newContestOps);
              lockPrice = data[0].current_price;
          } else{
              //console.log("Not looking for lockPrice in Settlement");
              lockPrice = bins.lockPrice;
          }

          return lockPrice;
        }

        return "null";
      } catch(err:any){
        throw err;
      }
    }

    static async setLockPrice(id:string, price:number): Promise<void> {
      try{
        const aeroClient: Client = await getAerospikeClient();
        const key = new Aerospike.Key(Contest.NAMESPACE, Contest.SET, id);
        
        let ops: any[1] = [Aerospike.operations.write("lockPrice", price)];
        
        
        if(aeroClient instanceof Client){
          await aeroClient.operate(key, ops);
        }

      } catch(err:any){
        throw err;
      }
    }

    static async setStatusActive(id:string): Promise<void> {
      try{
        const aeroClient: Client = await getAerospikeClient();
        const key = new Aerospike.Key(Contest.NAMESPACE, Contest.SET, id);
        
        let ops: any[1] = [Aerospike.operations.write("status", Status.ACTIVE)];
        
        
        if(aeroClient instanceof Client){
          await aeroClient.operate(key, ops);
        }

      } catch(err:any){
        throw err;
      }
    }

    static async setStatusEnded(id:string): Promise<void> {
      try{
        const aeroClient: Client = await getAerospikeClient();
        const key = new Aerospike.Key(Contest.NAMESPACE, Contest.SET, id);
        
        let ops: any[1] = [Aerospike.operations.write("status", Status.ENDED)];
        
        
        if(aeroClient instanceof Client){
          await aeroClient.operate(key, ops);
        }

      } catch(err:any){
        throw err;
      }
    }

    static async setStatusCancelled(id:string): Promise<void> {
      try{
        const aeroClient: Client = await getAerospikeClient();
        const key = new Aerospike.Key(Contest.NAMESPACE, Contest.SET, id);
        
        let ops: any[1] = [Aerospike.operations.write("status", Status.CANCELLED)];
        
        
        if(aeroClient instanceof Client){
          await aeroClient.operate(key, ops);
        }

      } catch(err:any){
        throw err;
      }
    }
}

export { Contest };
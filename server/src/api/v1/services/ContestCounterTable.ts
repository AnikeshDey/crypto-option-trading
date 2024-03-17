import { ContestCounter } from "../models/ContestCounter";

import { ContestCounterData } from "../interfaces/ContestCounterData";

export class ContestCounterTable {
  
    constructor() {}

    static async putNewCounter(contestId:string): Promise<ContestCounterData> {
        try{
            
            const data:ContestCounterData = new ContestCounter(contestId,0,0,0,0,0,0,0);

            return data;

        } catch(err:any){
          throw err;
        }
    }

    static async getContestCounter(id:string): Promise<ContestCounterData | undefined> {
        try{
            const data:ContestCounterData | undefined = await ContestCounter.findById(id);
            return data;
        } catch(err:any){
          throw err;
        }
    }
}
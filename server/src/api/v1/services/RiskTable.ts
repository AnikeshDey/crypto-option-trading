import { Risk } from "../models/Risk";

export class RiskTable {
  
    constructor() {}

    static async getRiskData(): Promise<Object | undefined> {
        try{
            let data = await Risk.getData();

            return data;
        } catch(err:any){
          throw err;
        }
    }
}
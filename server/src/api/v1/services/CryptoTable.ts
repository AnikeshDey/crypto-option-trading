import https from "https";

import fs from "fs";

import { Transform as Stream } from "stream";
    
import { Crypto } from "../models/Crypto";

import { CryptoData } from "../interfaces/CryptoData";

export class CryptoTable {
  
    constructor() {}

    static async saveNewCryptoData(): Promise<Object[]> {
        try{
            var data = await (await fetch(process.env.CRYPTO_PRICE_API_URL || "")).json();

            let allData:Object[] = [];
            
            const dataArray = data.map((res:any) => {
                https.request(res.image, function(response) {                                        
                    var data = new Stream();                                                    
                
                    response.on('data', function(chunk) {                                       
                    data.push(chunk);                                                         
                    });                                                                         
                
                    response.on('end', function() {                                             
                    fs.writeFileSync(`./coins/images/large/${res.id}.png`, data.read());                               
                    });                                                                         
                }).end();

                https.request(res.image.replace("/large/","/small/"), function(response) {                                        
                    var data = new Stream();                                                    
                
                    response.on('data', function(chunk) {                                       
                    data.push(chunk);                                                         
                    });                                                                         
                
                    response.on('end', function() {                                             
                    fs.writeFileSync(`./coins/images/small/${res.id}.png`, data.read());                               
                    });                                                                         
                }).end();

                //console.log("parseFloat(res.price_change_percentage_24h).toFixed(2):", parseFloat(res.price_change_percentage_24h).toFixed(2));

                allData.push(
                    {
                        id:res.id,
                        nM:res.symbol,
                        fnM:res.name,
                        tG:'USDT',
                        pR:res.current_price, // price ***
                        pRc:parseFloat(res.price_change_24h).toFixed(2),
                        pRcP:parseFloat(res.price_change_percentage_24h).toFixed(2), // price_change_percentage ***
                        vol:res.total_volume,
                        updatedAt:res.last_updated
                    }
                );


                return {
                    id:res.id,
                    nM:res.symbol,
                    fnM:res.name,
                    tG:'USDT',
                    pR:res.current_price, // price ***
                    pRc:parseFloat(res.price_change_24h).toFixed(2), // price_change
                    pRcP:parseFloat(res.price_change_percentage_24h).toFixed(2), // price_change_percentage ***
                    mC:res.market_cap, //market cap
                    mCr:res.market_cap_rank, //market cap rank
                    mCC:res.market_cap_change_24h, //market cap change
                    mCCP:res.market_cap_change_percentage_24h, //market cap change percentage
                    vol:res.total_volume,
                    fDV:res.fully_diluted_valuation, //fully_diluted_valuation
                    h_24:res.high_24h,
                    l_24:res.low_24h,
                    cS:res.circulating_supply,
                    tS:res.total_supply,
                    mS:res.max_supply,
                    ath:res.ath,
                    athCP:res.ath_change_percentage,
                    athD:res.ath_date,
                    atl:res.atl,
                    atlCP:res.atl_change_percentage,
                    atlD:res.atl_date,
                    roi:res.roi,
                    updatedAt:res.last_updated // ***
                };
            });

            for (let i in dataArray) {
                let crypto = new Crypto(
                    dataArray[i].id,
                    dataArray[i].nM,
                    dataArray[i].fnM,
                    dataArray[i].tG,
                    dataArray[i].pR,
                    dataArray[i].pRc,
                    dataArray[i].pRcP,
                    dataArray[i].mC,
                    dataArray[i].mCr,
                    dataArray[i].mCC,
                    dataArray[i].mCCP,
                    dataArray[i].vol,
                    dataArray[i].fDV,
                    dataArray[i].h_24,
                    dataArray[i].l_24,
                    dataArray[i].cS,
                    dataArray[i].tS,
                    dataArray[i].mS,
                    dataArray[i].ath,
                    dataArray[i].athCP,
                    dataArray[i].athD,
                    dataArray[i].atl,
                    dataArray[i].atlCP,
                    dataArray[i].atlD,
                    dataArray[i].roi,
                    dataArray[i].updatedAt
                );

                await crypto.save();
            }

            return allData;

        } catch(err:any){
          throw err;
        }
    }

    static async updateAllCryptoPrice(): Promise<Object[]> {
        try{
            var data = await (await fetch(process.env.CRYPTO_PRICE_API_URL || "")).json();

            let allData:Object[] = [];
            
            for(let i in data){

                await Crypto.updatePrice(
                    data[i].id,
                    data[i].current_price,
                    parseFloat(data[i].price_change_24h).toFixed(2),
                    parseFloat(data[i].price_change_percentage_24h).toFixed(2),
                    data[i].last_updated
                );

                allData.push({
                    id:data[i].id,
                    pR:data[i].current_price,
                    pRc:parseFloat(data[i].price_change_24h).toFixed(2),
                    pRcP:parseFloat(data[i].price_change_percentage_24h).toFixed(2),
                    updatedAt:data[i].last_updated
                });

            } 

            return allData;

        } catch(err:any){
          throw err;
        }
    }

    static async getAllCryptoData(): Promise<CryptoData[]> {
        try{
            
            const data:CryptoData[] = await Crypto.findAll();

            return data;

        } catch(err:any){
          throw err;
        }
    }

    static async getSingleCryptoData(id:string): Promise<CryptoData | undefined> {
        try{
            
            const data:CryptoData | undefined = await Crypto.findById(id);

            return data;

        } catch(err:any){
          throw err;
        }
    }
}
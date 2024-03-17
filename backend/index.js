const express = require('express');
const app = express();
const port = process.env.PORT || 3198;
const middleware = require('./middleware/auth');
const path = require('path');
const dotenv = require('dotenv').config();
const session = require("express-session");
const cors = require('cors');
const fs = require('fs');
const fetch = require("node-fetch");

const responseHandler = require("./middleware/responseHandler");
const errorHandler = require("./middleware/errorHandler");

const cryptoRoutes = require('./routes/cryptoRoutes');

app.use((_, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
    next();
});
	
app.use(
  cors({
    orgin: "http://localhost:3199",
  })
);


var https = require('https'),                                                
    Stream = require('stream').Transform;
const Aerospike = require("aerospike");

const config = require('./database/config');
const aeroClient = config.database.client;
const { connectSocket } = require("./socket/socket");
const kafkaConsumer = require('./kafka/consumer');
const { decryptData } = require("./helpers/encryption");


const server = app.listen(port, async () => {
    //console.log("Server listening on port " + port + "...")
    try{
		
		//allContests -> gameId -> String
		//allContests -> contestCode -> NUMERIC
		//allSlips -> gId -> String
		//allSlips -> cId -> String
		//allQuizzes -> gId -> String
		//allEvents -> gSD -> NUMERIC
		//allSlips -> uId -> String

        // var options = {
        //     ns: 'test',
        //     set: 'allContests',
        //     bin: 'contestCode',
        //     index: 'contestCode',
        //     datatype: Aerospike.indexDataType.NUMERIC
        // }
        // console.log("Creating Index............");
        // config.createIndex(options, function (error, job) {
        //   if (error) {
        //     // error creating index
        //     console.log(error);
        //   }
        //   job.waitUntilDone(function (error) {
        //     console.log('Index was created successfully......')
        //   })
        // })

        // config.indexRemove('test', 'canSettle', function (error) {
        //     if(error){
        //         //console.log(error);
        //     } else{
        //         console.log('Index was deleted successfully......')
        //     }
        // })
        
        kafkaConsumer().catch(err => {
            //console.log(err)
        });

        
        //await manageSportsData();
        
        // await newfunction(config);

    }catch(err){
        //console.log(err);
    }
});

server.setTimeout(0);

const newfunction = async (config) => {
    try{
    
        // var {redisStreamClient, redisStream} = await getStreamClient();

        // var key = new Aerospike.Key("test", "allContests", "120990917199");
        // const ops = [Aerospike.operations.write('status', "ended")] //spAS is the bin name
        // await config.operate(key,ops)
        // //console.log("Contest Edited.......................");
        

        // config.udfRegister('./clientUdf/new.lua', function (error) {
        //     if (error) {
        //         console.error('Error: %s [%d]', error.message, error.code)
        //     } else {
        //         //console.log("UDF Created.......................")
        //     }
        // })

        // config.udfRemove('test.lua', function (error) {
        //     if (error) {
        //         console.error('Error: %s [%d]', error.message, error.code)
        //     } else {
        //         //console.log("UDF deleted.......................")
        //     }
        // })

        
        // var allUsers = await Event.find();
        // //var newArray = []
        // //console.log("allUsers:", allUsers.length);

        // //console.log("Started inserting data in aerospike........");
        // //console.log("Started inserting data in aerospike........");
        // //console.log("Started inserting data in aerospike........");

        // // var policy = new Aerospike.WritePolicy();
        // // policy.compress = true;
        // // policy.totalTimeout = 60000
        // // policy.socketTimeout = 60000

        // for(var i=0; i < 10; i++){
        //     //newArray.push({...allUsers[i]._doc})

        //     for(var j=0; j < allUsers.length; j++){
        //         var key = new Aerospike.Key('test', 'allNewEvents2', `${allUsers[j]._doc._id.toString()}${uuidv4()}`);

        //         await config.put(key, {
        //             _id:allUsers[j]._doc._id.toString(),
        //             data:Buffer.from(JSON.stringify(allUsers[j]._doc))
        //         });
        //     }

            
            
        //     // config.remove(new Aerospike.Key('test', 'allEvents',allUsers[i]._doc._id.toString()), (error) => {
        //     //     if(error){
        //     //         //console.log(error);
        //     //     } else{
        //     //         //console.log("Deleted Record From Aerospike...")
        //     //     }
        //     // });
        // }

        // //console.log("Inserted data in aerospike........");
        // //console.log("Inserted data in aerospike........");
        // //console.log("Inserted data in aerospike........");

        //process.exit(1);

        //var key = new Aerospike.Key('test', 'allNewEvents4', "PK");
        //var bins = Buffer.from(JSON.stringify(newArray))
        ////console.log("bins: ",bins);

        //var policy = new Aerospike.WritePolicy();
        //policy.totalTimeout = 60000
        //policy.socketTimeout = 60000
        ////console.log("policy",policy);
        // await config.put(key, {
        //     data:Buffer.from(JSON.stringify(newArray))
        // });
         


        

        //var query = config.query('test', 'allSlips');

        //query.where(Aerospike.filter.equal("gId","31595707"))
        
        // // //query.select(['_id','user','ds','po', 'rk','cId']);
        //query.select(['_id']);

        // query.apply("demo", "count", (error, result) => {
        //     if(error){
        //         //console.log("udferror:", error);
        //     } else{
        //         //console.log("udfresult:", result);
        //     }        
        // })
        
        //var stream = query.foreach();
        //var count = 0;
        // var allSlips = [];
        //stream.on('data', function (record) {
            // var value = JSON.parse(record.bins.data.toString());
            // //console.log("record.bins.data:",record.bins);
            //count++;
            ////console.log("slipcount:",count);
            // if(count < 10){
            //     allSlips.push(record.bins);
            // }
            
            // config.remove(new Aerospike.Key('test', 'allEvents',record.bins._id), (error) => {
            //     if(error){
            //         //console.log(error);
            //     } else{
            //         //console.log("Deleted Record From Aerospike...")
            //     }
            // });
        //})

        // stream.on('end', () => {
        //     //console.log("finalslipcount:",count);
        // })
        // //console.log("Started fetching Contest Rank Data...........");
        //  fetch('http://34.106.49.135/api/index/contest?limit=100000&cid=739283333&type=single', {
        //     method: 'GET'
        // }).then(res => res.json()) //single = contestId //multi = eventId
        // .then(async data => {
        //     ////console.log("data:",data);
            
        //     //console.log("Started inserting Contest Rank Data...........");

        //     // Open stream
        //     console.time("dbsave");
        //     var stream = redisStreamClient.stream();

        //     // Example of setting 10000 records
        //     for(var i = 0; i < data.length; i++) {

        //         // Command is an array of arguments:
        //         var command = ['zadd', data[i].cId, data[i].pts, data[i].uid];  

        //         // Send command to stream, but parse it before
        //         stream.redis.write( redisStream.parse(command) );
        //     }

        //     // Create event when stream is closed
        //     stream.on('close', () => {
        //         //console.log('Completed!..........');

        //         // Here you can create stream for reading results or similar
        //     });

        //     // Close the stream after batch insert
        //     stream.end();
        //     console.timeEnd("dbsave");

            

        //     ////console.log("data:",data);
        //     //var batchSize = 1000;

        //     // var fs = require('fs')
        //     // fs.writeFile('datalog.txt', Buffer.from(JSON.stringify(data.slice(0,1000))), function (err) {
        //     //     if (err) {
        //     //         // append failed
        //     //         //console.log("Text file error:", err);
        //     //     } else {
        //     //         // done
        //     //         fs.readFile('datalog.txt', async (err, result) => {
        //     //             //var bufferedData = Buffer.from(JSON.stringify(result));
        //     //             await producer(result,'aerospike12');
        //     //             //console.log("Sent Contest Rank Data to producer...........");
        //     //         })
        //     //     }
        //     // })

        //     // //console.log("Started inserting Contest Rank Data...........");
        //     // var contestId = uuidv4();
            
        //     // var key = new Aerospike.Key("test","newSlips",contestId);
        //     // //var bufferedData = Buffer.from(JSON.stringify(data.slice(0, 1000)));
        //     // const chunkSize = 1000;
        //     // var formattedData = {};
        //     // var bins;
        //     // for (let i = 0; i < data.length; i += chunkSize) {
        //     //     const chunk = data.slice(i, i + chunkSize);
        //     //     // do whatever
        //     //     var bufferedData = Buffer.from(JSON.stringify(chunk));
        //     //     formattedData[i] = bufferedData;
        //     //     bins = {_id:contestId, data:Buffer.from(JSON.stringify(formattedData))};
        //     //     // await producer(bufferedData,'aerospike12');
        //     //     // //console.log("Sent Contest Rank Data to producer...........");
        //     // }

        //     // //console.log("formattedData:",bins);
        //     // await config.put(key, bins);
        //     //  //console.log("Done inserting Contest Rank Data...........");
        //     // //console.log("contestId:", contestId);

        //     // for(let batch=0; batch<data.length; batch+=batchSize) {
        //     //     let promises = [];
                
        //     //     for (let x = 0; x<batchSize && x+batch<data.length; x++) {
                    
        //     //         var slipId = uuidv4();
        //     //         promises.push(putData({
        //     //             _id:slipId,
        //     //             cId:data[batch+x].cId,
        //     //             uid:data[batch+x].uid,
        //     //             rk:data[batch+x].dens_rk,
        //     //             po:data[batch+x].pts,
        //     //             createdAt:new Date(new Date().getTime()).toISOString()
        //     //         }));
                    
        //     //     }
        //     //     // Send next batch after all promises resolved 
        //     //     ////console.log(promises);
        //     //     await Promise.all(promises.map(p=>p.catch(()=>'slip request failed')))
        //     //                 .then(results => //console.log(results.filter(x => x=='failed').length, ' slip requests failed'));
                
        //     //     //console.log("Inserting Dummy Slip Data......" + (batch));
        //     // }
            
        //     // //console.log("Done inserting Dummy Slip Data...........");
        //     // process.exit(1);

            
        //  })
        //  .catch(err => //console.log("Our get error:",err));



        // stream.on('end', () => {
        //     //console.log("slip count:",count);
        //     //console.log("all slips:", allSlips);
        //     fetch('http://34.106.49.135/', {
        //         method: 'POST',
        //         body: JSON.stringify({data:allSlips}),
        //         headers: { 'Content-Type': 'application/json' }
        //     }).then(res => res.json())
        //     .then(json => //console.log("Our post result:",json))
        //     .catch(err => //console.log("Our post error:",err));

        //     fetch('http://34.106.49.135/api/index/user/list/limit=200', {
        //         method: 'GET'
        //     }).then(res => res.json())
        //     .then(json => //console.log("Our get result:",json))
        //     .catch(err => //console.log("Our get error:",err));
        // })
        // var key = new Aerospike.Key('test','allEvents','test');
        // config.get(key);

        // //console.log("field: ",field);

        // var options = {
        //     ns: 'test',
        //     set: 'transactionHistory',
        //     bin: 'uId',
        //     index: 'uId',
        //     datatype: Aerospike.indexDataType.STRING
        // }
        // console.log("Creating Index............");
        // config.createIndex(options, function (error, job) {
        //   if (error) {
        //     // error creating index
        //     console.log(error);
        //   }
        //   job.waitUntilDone(function (error) {
        //     console.log('Index was created successfully......')
        //   })
        // })

        // config.indexRemove('test', 'gameId', function (error) {
        //     if(error){
        //         //console.log(error);
        //     } else{
        //         //console.log('Index was deleted successfully......')
        //     }
        // })

    } catch(err){
        //console.log("Error in newfunction:", err);
    }
}


const io = connectSocket(server);

app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}))


app.use('/', cryptoRoutes);


//centralized response handler
app.use(responseHandler);
app.use(errorHandler);



io.on("connection", (socket) => {
    //console.log("Socket Connected....");

    getRiskData().then(data => {
        ////console.log(data);
        socket.emit("get risk data", JSON.stringify(data))
    }).catch(err => {
        //console.log(err)
    });

    socket.on("setup", userData => {
        socket.join(userData._id);
        socket.emit("connected");  
    })

    socket.on("join room", room => {
        socket.join(room)
        //console.log("Joined room " + room);
    });

    socket.on("notification recieved", room => socket.in(room).emit("notification recieved"));

    socket.on("get crypto data", async () => {
        //console.log('requested for data')
        
        aeroClient.connect();

        var query = aeroClient.query(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_CRYPTO_PRICE_SET);

        query.select('id','nM', "fnM", 'tG', 'pR', 'pRc', 'vol', 'pRcP', 'updatedAt')

        var stream = query.foreach();
        //var count = 0;
        var allEvents = [];
        stream.on('data', function (record) {
            allEvents.push(record.bins);
        })

        stream.on('error', function (error) {
            //handle error
            console.log(error);
            //res.status(404).json({message:"Event Not found!"});
        })

        stream.on('end', function () {
            //signal the end of query result
            //res.status(200).json(allEvents.sort(function(a, b){return a.id - b.id}));
            //console.log(allEvents[0]);
            socket.emit("get crypto data", allEvents.sort((a, b) => a.nM?.localeCompare(b?.nM)));
        })
    })
})

async function getRiskData(){
    try{
        const aeroClient = await getAerospikeClient();

        var key = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT,process.env.AEROSPIKE_GLOBAL_SET,"cryptoRiskData");
		
        var record = await aeroClient.get(key);

        //console.log("From Aerospike Database.....");
        var parsedResult = JSON.parse(record.bins.data.toString())
        ////console.log(parsedResult);
        return parsedResult;
    } catch(err){
		
		let data = fs.readFileSync('./constants/constant.json', 'utf8')
		 
		let obj = JSON.parse(data);
		//console.log("obj:",obj);
		var bins = {data:Buffer.from(JSON.stringify(obj))}
        await aeroClient.put(key, bins);
        return obj;
    }
}


async function manageSportsData() {
    try {
        var socket = connectSocket();

        aeroClient.connect();

        var data = await (await fetch(process.env.CRYPTO_PRICE_API_URL)).json();
        //console.log(data);
        console.time("cryptoData");
        allData = []
        const dataArray = data.map((res, ix) => {
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
            )


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
            }
        });

        //console.log(dataArray);
        dataArray.forEach(async el => {
            var key = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_CRYPTO_PRICE_SET, el.id.toString());
        
            await aeroClient.put(key, el);
            //////console.log("mySocket:",socket);
            // if(socket){
            //     ////console.log("Reload Page Sent......" + `contestId-${item}`);
            //     socket.to(`game-${el.id.toString()}`).emit("reload available");
            // }
        })
        console.timeEnd("cryptoData");


        socket.emit("get crypto data", allData.sort((a, b) => a.nM.localeCompare(b.nM)))
        //console.log("dataArray:",allData);

        setInterval(async () => {
            var data = await (await fetch(process.env.CRYPTO_PRICE_API_URL)).json();
            // console.log(tickers);
            // return;
            
            const batchType = Aerospike.batchType;
            var batchSize = 100;
            var policy = new Aerospike.WritePolicy({
                totalTimeout:50000,
                socketTimeout:50000,
                maxRetries:2
            }) 
            //console.log(dataArray.length);
            console.time("cryptoPriceData");
            var allNewRecords = []
            for(let batch=0; batch<Number(data.length); batch+=batchSize) {
                var batchRecords = []
                
                for (let x = 0; x<batchSize && x+batch<Number(data.length); x++) {
                    
                    //var id = `${tickers[batch + x].base}-${tickers[batch + x].target}`;

                    batchRecords.push({
                        type: batchType.BATCH_WRITE,
                        key: new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_CRYPTO_PRICE_SET, data[batch + x].id),
                        ops:[ 
                            Aerospike.operations.write("pR", data[batch + x].current_price),//price
                            Aerospike.operations.write("pRc", parseFloat(data[batch + x].price_change_24h).toFixed(2)),
                            Aerospike.operations.write("pRcP", parseFloat(data[batch + x].price_change_percentage_24h).toFixed(2)),
                            Aerospike.operations.write("updatedAt", data[batch + x].last_updated),
                        ]
                    })

                    allNewRecords.push({
                        id:data[batch + x].id,
                        pR:data[batch + x].current_price,
                        pRc:parseFloat(data[batch + x].price_change_24h).toFixed(2),
                        pRcP:parseFloat(data[batch + x].price_change_percentage_24h).toFixed(2),
                        updatedAt:data[batch + x].last_updated
                    })
                }
                // Send next batch after all promises resolved 
                ////console.log(promises);
                await aeroClient.batchWrite(batchRecords, policy);
                
                console.log("Inserting Tickers Data......" + (batch == 0 ? batchSize : batchSize + batch));
            }

            console.timeEnd("cryptoPriceData");
            socket.emit("get latest price", allNewRecords);
        }, 60000);



        setInterval(async () => {
            var data = await (await fetch(process.env.CRYPTO_PRICE_API_URL)).json();
            //console.log(data);
            console.time("cryptoRepeatData");
            var allNewData = []
            const dataArray = data.map((res, ix) => {
                allNewData.push(
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
                )
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
                }
            });

            //console.log(dataArray);
            dataArray.forEach(async el => {
                var key = new Aerospike.Key(process.env.AEROSPIKE_NAMESPACE_DEFAULT, process.env.AEROSPIKE_CRYPTO_PRICE_SET, el.id.toString());
            
                await aeroClient.put(key, el);
                //////console.log("mySocket:",socket);
                // if(socket){
                //     ////console.log("Reload Page Sent......" + `contestId-${item}`);
                //     socket.to(`game-${el.id.toString()}`).emit("reload available");
                // }
            })
            console.timeEnd("cryptoRepeatData");


            socket.emit("get crypto data", allNewData.sort((a, b) => a.nM.localeCompare(b.nM)))
        },600000)
    } catch (err) {
        console.log(err);
    }
    
}


module.exports = server;




//export NODE_OPTIONS=--max-old-space-size=8192
//'http://07685e18709.cashanywire.com:5000'
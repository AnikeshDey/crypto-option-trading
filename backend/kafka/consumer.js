const { Kafka } = require("kafkajs");
const Chance = require("chance");
const Aerospike = require("aerospike");
const conn = require("../database/mysql.js");

const chance = new Chance();
const { connectSocket } = require("../socket/socket.js");
const config = require("../database/config");
const aeroClient = config.database.client;

// const kafka = new Kafka({
//   clientId: 'my-consumer',
//   brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094']
// })

//'34.106.49.135:9092'

const kafka = new Kafka({
  clientId: "my-consumer",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: chance.character() });
//const topic = 'newSlips';

// "KafkaJS v2.0.0 switched default partitioner. To retain the same partitioning behavior as in previous versions, create the producer with the option \"createPartitioner: Partitioners.LegacyPartitioner\"

const run = async () => {
  aeroClient.connect();

  // Producing
  await consumer.connect();
  ////console.log("Consumer connected successfully...........");
  await consumer.subscribe({
    topics: [
      "aerospike",
      "contestResult",
      "updateContestResult",
      "newSlips",
      "shiftSlipsToHistory",
    ],
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (topic == "aerospike") {
        var parsedData = JSON.parse(message.value.toString());

        if (
          parsedData.metadata &&
          parsedData.metadata.set == process.env.AEROSPIKE_SLIP_SET &&
          parsedData.metadata.msg == "write" &&
          parsedData.metadata.gen == 1
        ) {
          delete parsedData.metadata;

          var insertQuery = `INSERT INTO ${process.env.MYSQL_CONTEST_DATABASE} (s, cid, uid, ev, cc, p, ds) VALUES ("${parsedData._id}", "${parsedData.cId}", "${parsedData.uId}", "${parsedData.gId}", "${parsedData.cc}", "${parsedData.po}", "${parsedData.ds}")`;

          conn.query(insertQuery, async function (error, results, fields) {
            if (error) {
              ////console.log("Insert Slip Error:", error);
            } else {
              ////console.log(`Inserted slip with id ${parsedData._id}`);
              // var key = new Aerospike.Key("test", process.env.AEROSPIKE_USER_SET, parsedData.uId.toString());
              // var stats = {
              //   slipId:parsedData._id,
              //   cId:parsedData._id,
              //   cN:parsedData.cN,
              //   gN:parsedData.gN,
              //   sN:parsedData.sN,
              //   gId:parsedData.gId,
              //   st:parsedData.st,
              //   po:parsedData.po,
              //   rk:parsedData.rk,
              //   eF:parsedData.eF
              // }
              // var ops = [Aerospike.maps.put("stats", parsedData._id.toString(), stats)];
              // await aeroClient.operate(key, ops);
            }
          });
        }
      } else if (topic == "updateContestResult") {
        var parsedValue = JSON.parse(message.value);
        ////console.log("consumer updateContestResult:", parsedValue)

        updateRankInLoop(parsedValue.contestId, aeroClient);
      } else if (topic == "shiftSlipsToHistory") {
        var parsedValue = JSON.parse(message.value);
        ////console.log("consumer shiftToHistoryResult:", parsedValue)

        shiftSlipsToHistory(parsedValue.contestId, aeroClient);
      } else if (topic == "contestResult") {
        ////console.log("New Contest Result Came......")
        var parsedValue = JSON.parse(message.value);
        var allResults = parsedValue.contestData;
        const batchType = Aerospike.batchType;
        var batchSize = 300;
        var policy = new Aerospike.WritePolicy({
          totalTimeout: 50000,
          socketTimeout: 50000,
          maxRetries: 2,
        });

        for (let batch = 0; batch < allResults.length; batch += batchSize) {
          var batchRecords = [];

          for (let x = 0; x < batchSize && x + batch < allResults.length; x++) {
            batchRecords.push({
              type: batchType.BATCH_WRITE,
              key: new Aerospike.Key(
                process.env.AEROSPIKE_NAMESPACE_DEFAULT,
                process.env.AEROSPIKE_SLIP_SET,
                allResults[batch + x].s
              ),
              ops: [
                Aerospike.operations.write("po", allResults[batch + x].p),
                Aerospike.operations.write("rk", allResults[batch + x].r),
              ],
            });
          }

          await aeroClient.batchWrite(batchRecords, policy).catch((err) => {
            ////console.log("Batchwrite Err:", err)
          });

          ////console.log("Inserting Slip Rank Data......" + (batch == 0 ? batchSize : batchSize + batch));
        }

        ////console.log("Done Inserting Slip Rank Data......")
      } else if (topic == "newSlips") {
        var parsedData = JSON.parse(message.value);
        // await aeroClient.put(new Aerospike.Key("test",process.env.AEROSPIKE_SLIP_SET,parsedData['_id'].toString()), parsedData);

        var insertQuery = `INSERT INTO ${process.env.MYSQL_CONTEST_DATABASE} (s, cid, uid, ev, cc, p, ds) VALUES ("${parsedData._id}", "${parsedData.cId}", "${parsedData.uId}", "${parsedData.gId}", "${parsedData.cc}", "${parsedData.po}", "${parsedData.ds}")`;

        conn.query(insertQuery, function (error, results, fields) {
          if (error) {
            ////console.log("Insert Slip Error:", error);
          } else {
            console.log(`Inserted slip with id ${parsedData._id}`);
          }
        });

        // fetch('http://localhost/insertContest.php', {
        //     method: 'POST',
        //     body: message.value,
        //     headers: { 'Content-Type': 'application/json' }
        // }).then(res => res.json())
        // .then(json => ////console.log("newSlips Result:", json))
        // .catch(err => ////console.log("newSlips Err:", err));
      }
    },
  });
};

const shiftSlipsToHistory = async (contestId, aeroClient) => {
  var slipQuery = aeroClient.query(
    process.env.AEROSPIKE_NAMESPACE_DEFAULT,
    process.env.AEROSPIKE_SLIP_SET
  );

  slipQuery.where(Aerospike.filter.equal("cId", contestId));

  slipQuery.select("_id");

  var slipStream = slipQuery.foreach();
  var allSlipIds = [];
  slipStream.on("data", (rec) => {
    allSlipIds.push({
      key: new Aerospike.Key(
        process.env.AEROSPIKE_NAMESPACE_DEFAULT,
        process.env.AEROSPIKE_SLIP_SET,
        rec.bins._id.toString()
      ),
      readAllBins: true,
    });
  });

  slipStream.on("error", (err) => {
    ////console.log(err);
  });

  slipStream.on("end", () => {
    var itemCount = 1000;
    for (var i = 0; i < allSlipIds.length; i++) {
      var itemStart = i * itemCount;
      var itemEnd = (i + 1) * itemCount;
      var keys = allSlipIds.slice(itemStart, itemEnd);
      if (keys.length > 0) {
        var readPolicy = new Aerospike.ReadPolicy({
          totalTimeout: 50000,
          socketTimeout: 50000,
          maxRetries: 2,
        });
        aeroClient.batchRead(keys, readPolicy, async function (error, results) {
          if (error) {
            ////console.log('ERROR - %s', error.message)
          } else {
            var allResults = results;
            //////console.log("results:",results);
            const batchType = Aerospike.batchType;
            var batchSize = 300;
            var policy = new Aerospike.WritePolicy({
              totalTimeout: 50000,
              socketTimeout: 50000,
              maxRetries: 5,
            });

            for (let batch = 0; batch < allResults.length; batch += batchSize) {
              var batchRecords = [];
              var batchRecords2 = [];

              for (
                let x = 0;
                x < batchSize && x + batch < allResults.length;
                x++
              ) {
                var currentMonth = new Date(
                  allResults[batch + x].record.bins.cT
                ).getMonth();
                var currentYear = new Date(
                  allResults[batch + x].record.bins.cT
                ).getFullYear();
                var setName = `allHistorySlips-${currentMonth}${currentYear}`;
                batchRecords.push({
                  type: batchType.BATCH_WRITE,
                  key: new Aerospike.Key(
                    process.env.AEROSPIKE_NAMESPACE_DEFAULT,
                    setName,
                    allResults[batch + x].record.bins._id.toString()
                  ),
                  ops: [
                    Aerospike.operations.write(
                      "_id",
                      allResults[batch + x].record.bins._id
                    ),
                    Aerospike.operations.write(
                      "spAS",
                      allResults[batch + x].record.bins.spAS
                    ),
                    Aerospike.operations.write(
                      "cId",
                      allResults[batch + x].record.bins.cId
                    ),
                    Aerospike.operations.write(
                      "cN",
                      allResults[batch + x].record.bins.cN
                    ),
                    Aerospike.operations.write(
                      "gN",
                      allResults[batch + x].record.bins.gN
                    ),
                    Aerospike.operations.write(
                      "dT",
                      allResults[batch + x].record.bins.dT
                    ),
                    Aerospike.operations.write(
                      "cc",
                      allResults[batch + x].record.bins.cc
                    ),
                    Aerospike.operations.write(
                      "uId",
                      allResults[batch + x].record.bins.uId
                    ),
                    Aerospike.operations.write(
                      "uP",
                      allResults[batch + x].record.bins.uP
                    ),
                    Aerospike.operations.write(
                      "uN",
                      allResults[batch + x].record.bins.uN
                    ),
                    Aerospike.operations.write(
                      "gId",
                      allResults[batch + x].record.bins.gId
                    ),
                    Aerospike.operations.write(
                      "st",
                      allResults[batch + x].record.bins.st
                    ),
                    Aerospike.operations.write(
                      "po",
                      allResults[batch + x].record.bins.po
                    ),
                    Aerospike.operations.write(
                      "rk",
                      allResults[batch + x].record.bins.rk
                    ),
                    Aerospike.operations.write(
                      "eF",
                      allResults[batch + x].record.bins.eF
                    ),
                    Aerospike.operations.write(
                      "mS",
                      allResults[batch + x].record.bins.mS
                    ),
                    Aerospike.operations.write(
                      "cT",
                      allResults[batch + x].record.bins.cT
                    ),
                  ],
                });

                //Aerospike.maps.put("stats", allResults[batch + x].record.bins._id.toString(), stats)

                var stats = {
                  slipId: allResults[batch + x].record.bins._id,
                  contestId: allResults[batch + x].record.bins.cId,
                  setId: `${currentMonth}${currentYear}`,
                  createdAt: allResults[batch + x].record.bins.cT,
                };

                batchRecords2.push({
                  type: batchType.BATCH_WRITE,
                  key: new Aerospike.Key(
                    process.env.AEROSPIKE_NAMESPACE_DEFAULT,
                    process.env.AEROSPIKE_USER_SET,
                    allResults[batch + x].record.bins.uId.toString()
                  ),
                  ops: [
                    Aerospike.maps.put(
                      "stats",
                      allResults[batch + x].record.bins._id,
                      stats
                    ),
                  ],
                });
              }
              // Send next batch after all promises resolved
              //////console.log(promises);
              await aeroClient.batchWrite(batchRecords, policy);
              await aeroClient.batchWrite(batchRecords2, policy);

              ////console.log("Shifting Slip Data to History......" + (batch == 0 ? batchSize : batchSize + batch));
            }

            ////console.log("Done Shifting Slip Data to History......")
          }
        });
      }
    }
  });
};

const updateRankInLoop = async (contestId, aeroClient) => {
  var loopCount = 10;
  var limitCount = 10000;
  var countObj = {};
  //console.time("batchUpdate");
  for (var i = 0; i < loopCount; i++) {
    conn.query(
      `SELECT cid,s,p, RANK() OVER (partition by cid ORDER BY p DESC)as r FROM ${
        process.env.MYSQL_CONTEST_DATABASE
      } WHERE ev="${contestId}" LIMIT ${i * limitCount}, ${
        (i + 1) * limitCount
      }`,
      async function (err, result, fields) {
        if (err) throw err;
        if (result.length < 1) {
          //conn.end()
          return;
        } else {
          ////console.log("result data came from sql...............");
          ////console.log("result:", result);
          var newArray = {};
          for (var i = 0; i < result.length; i++) {
            if (result[i].cid in newArray) {
              newArray[result[i].cid] = [...newArray[result[i].cid], result[i]];
            } else {
              newArray[result[i].cid] = [result[i]];
            }
          }

          Object.keys(newArray).forEach((i) => {
            var count = countObj[i] ? countObj[i] : 0;
            newArray[i].forEach((item, idx) => {
              count++;
              item["c"] = count;

              if (idx == newArray[i].length - 1) {
                if (i in countObj) {
                  countObj[i] = countObj[i] + count;
                } else {
                  countObj[i] = count;
                }
              }
            });
          });

          Object.keys(newArray).forEach(async (item) => {
            var allResults = newArray[item];
            const batchType = Aerospike.batchType;
            var batchSize = 300;
            var policy = new Aerospike.WritePolicy({
              totalTimeout: 50000,
              socketTimeout: 50000,
              maxRetries: 5,
            });

            for (let batch = 0; batch < allResults.length; batch += batchSize) {
              var batchRecords = [];

              for (
                let x = 0;
                x < batchSize && x + batch < allResults.length;
                x++
              ) {
                batchRecords.push({
                  type: batchType.BATCH_WRITE,
                  key: new Aerospike.Key(
                    process.env.AEROSPIKE_NAMESPACE_DEFAULT,
                    process.env.AEROSPIKE_SLIP_SET,
                    allResults[batch + x].s
                  ),
                  ops: [
                    Aerospike.operations.write("_id", allResults[batch + x].s),
                    Aerospike.operations.write("po", allResults[batch + x].p),
                    Aerospike.operations.write("rk", allResults[batch + x].r),
                    Aerospike.operations.write("spAS", allResults[batch + x].c),
                  ],
                });
              }

              await aeroClient.batchWrite(batchRecords, policy).catch((err) => {
                ////console.log("Batchwrite Err:", err)
              });
              //////console.log("policy:", policy);
              //////console.log("result:", result);

              ////console.log("Inserting Slip Rank Data......" + (batch == 0 ? batchSize : batchSize + batch));
            }

            ////console.log("Done Inserting Slip Rank Data......")

            var socket = connectSocket();
            //////console.log("mySocket:",socket);
            if (socket) {
              ////console.log("Reload Page Sent......" + `contestId-${item}`);
              socket.to(`contestId-${item}`).emit("reload available");
            }
          });

          // if(i == loopCount -1){
          //   console.timeEnd("batchUpdate");
          // }

          //conn.end()
        }

        // if(result.length > 0){
        //   ////console.log("result.length:",result.length);
        // }
      }
    );
  }
  //conn.end();
};

module.exports = run;

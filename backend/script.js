const Aerospike = require('aerospike');
//const express = require('express');
// const app = express();
// const port = process.env.PORT || 5001;
// const middleware = require('./middleware/auth')
// const path = require('path')
// const mongoose = require("./database");
// const session = require("express-session");
// const cors = require('cors')
// const as = require('bindings')('aerospike.node')
// const opcodes = as.listOperations
// const Context = require('./cdt_context')
// const AerospikeError = require('./error')
// const Operation = require('./operations').Operation

// const fetch = require("node-fetch");
// const dotenv = require('dotenv').config();
// const Event = require('./schemas/EventSchema');




//for aerospike

const client = new Aerospike.Client({
  hosts: 'localhost:3010',
  modlua: {
    userPath: './',
    systemPath: './lua/'
  },
  policies: {
      read: new Aerospike.ReadPolicy({
          socketTimeout: 2000,
          totalTimeout: 6000,
          maxRetries:2
      }),
      write: new Aerospike.WritePolicy({
          socketTimeout: 2000,
          totalTimeout: 6000,
          maxRetries:1
      })
  }
})

//const maps = Aerospike.maps
//const key = new Aerospike.Key('test', 'bindl', 'mapKey')

client.connect()
.then(async config => {
  console.log("aerospike connected")
  const NewKey = new Aerospike.Key('test', 'counterSet', 1);
        await client.put(NewKey, {
            pk:     1,
            users: 0, //total number of registered users
            posts: 0, //total number of posts
            spAS: 0, //sports Active Slips
            spHS: 0, //sports Historical Slips -- basically older than 10 days
            spAC:0, //sports Active Contests
            spEC:0, //sports Ended Contests -- basically older than 10 days
            p2pBS: 0, //peer-to-peer Buy Sell in crypto payment gateway
        })
  // var query = config.query('test', 'allSlips');
      
  // // //query.select(['_id','user','ds','po', 'rk','cId']);
  // query.select(['_id']);

  // query.apply("./lua/test", "count", (error, result) => {
  //     if(error){
  //         console.log("udfError:", error);
  //     } else{
  //         console.log("udfResult:", result);
  //     }        
  // })
})

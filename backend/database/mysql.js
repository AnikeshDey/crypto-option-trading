var mysql = require("mysql2");
const fs = require("fs");
const output = fs.createWriteStream("query.csv");

// connect to the db
connInfo = {
  host: "localhost",
  user: "gamingSports",
  password: "Magic@1947",
  database: "_sports",
  port: "3306",
  connectionLimit: 50000, //mysql connection pool length
};

//create mysql connection pool
// var conn = mysql.createConnection(connInfo);

// // Attempt to catch disconnects
// conn.on("connection", function (connection) {
//   //console.log('Mysql Connection established....');
//   connection.on("error", function (err) {
//     //console.error(new Date(), 'MySQL error', err.code);
//   });

//   //print closed timestamp
//   connection.on("close", function (err) {
//     //console.error(new Date(), 'MySQL close', err);
//   });
// });

// module.exports = conn;

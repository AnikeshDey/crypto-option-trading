const client = require('./aerospike');

//you can add multiple other databases including mySQL, MongoDB etc
module.exports = {
  // Other configuration options for your app
  database: {
    client: client //for aerospike
    
    // Other database configuration options
  },
  // Other configuration options for your app
};
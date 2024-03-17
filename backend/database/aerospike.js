const Aerospike = require('aerospike');
// Load environment variables

const client = Aerospike.client({
  hosts: [{
    addr: process.env.AEROSPIKE_HOST,
    port: parseInt(process.env.AEROSPIKE_PORT),
  }],
  maxConnsPerNode: 100,
  log: {
    level: Aerospike.log.INFO,
  },
  clientPolicy: {
    timeout: 1000, // the timeout value in milliseconds
    idleTimeout: 30000 // the idleTimeout value in milliseconds
  }
});

client.connect((err) => {
  if (err) {
    console.error('Error connecting to Aerospike:', err);
  } else {
    console.log('Connected to Aerospike...');
  }
});


module.exports = client;
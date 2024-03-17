

const createIndex = (config) => {
    var spasOptions = {
        ns: 'test',
        set: 'allSlips',
        bin: 'spAS', 
        index: 'count',
        datatype: Aerospike.indexDataType.NUMERIC
    }
    config.createIndex(spasOptions, function (error, job) {
      if (error) {
        // error creating index
      }
      job.waitUntilDone(function (error) {
        console.log('SPAS Index was created successfully......')
      })
    })
}

export default createIndex;
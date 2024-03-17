import Aerospike, { Client, Config, ReadPolicy, WritePolicy } from "aerospike";

let client: Client | null = null;
let clientDefined = false;

const defineAerospikeClient = async (): Promise<Client> => {
  try {
    const defaults = {
      socketTimeout: 3000,
      totalTimeout: 6000,
      maxRetries: 10,
    };

    const config: any = {
      hosts: [
        {
          addr: "34.131.105.107",
          port: 3010
        }
      ],
      maxConnsPerNode: 1000,
      modlua: {
        userPath: './clientUdf',
        systemPath: "/opt/aerospike/usr/udf/",
      },
      policies: {
        read: new Aerospike.ReadPolicy({
          socketTimeout: 30000,
          totalTimeout: 60000,
          maxRetries: 5,
        }),
        write: new Aerospike.WritePolicy({
          socketTimeout: 30000,
          totalTimeout: 60000,
          maxRetries: 1,
          compress: true,
        }),
      },
    };

    const client = new Aerospike.Client(config);
    await client.connect();
    clientDefined = true;

    return client;
  } catch (error: any) {
    console.error('Errorx: %s [%i]', error.message, error.code);
    if (error.config) {
        error.config.close();
    }
    process.exit(1);
  }
};

const getAerospikeClient = async (): Promise<Client> => {
  if (clientDefined) {
    return client as Client;
  } else {
    try {
      const config = await defineAerospikeClient();
      return config;
    } catch (error: any) {
      console.error('Errorx: %s [%i]', error.message, error.code);
      if (error.config) {
        error.config.close();
    }
      process.exit(1);
    }
  }
};

export { defineAerospikeClient, getAerospikeClient };

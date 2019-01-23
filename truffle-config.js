const path = require("path");

module.exports = {
  
  contracts_build_directory: "./client/src/contracts",
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '1234',
      gas: '5000000'
    }
  }
};


const path = require("path");
const HDWalletProvider = require("truffle-hdwallet-provider");


module.exports = {

  contracts_build_directory: "./client/src/contracts",
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '1234',
      gas: '10000000'
    },
    ropsten: {
    provider: function() {
      return new HDWalletProvider("mom elbow buzz suffer sunny type deer announce wide wrong cave advice", "https://ropsten.infura.io/v3/e533e2e0cd7042a884f3cf4ddda9ddaf");
    },
    network_id: '3',
    gas: 4700000,
    gasPrice: 100000000000
     }

  }
};

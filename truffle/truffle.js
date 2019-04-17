// module.exports = {
//   // See <http://truffleframework.com/docs/advanced/configuration>
//   // to customize your Truffle configuration!
// };
require('dotenv').config()
require("ts-node/register")


const HDWalletProvider = require('truffle-hdwallet-provider')


module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*", // Match any network id
      gas: 6109322
    },
    ropsten: {
      provider: () => new HDWalletProvider(
          process.env.MNEMONIC,
          process.env.ROPSTEN_URL),
      network_id: 3
    }
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.5.6",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  }
}
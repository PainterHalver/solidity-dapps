const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const dotenv = require("dotenv").config({
  path: "./.env",
});

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  // web3.eth.sendTransaction({to:'0x0178B5794dbeBF1A3F10f0e5b3aD6dE1554f2A74', from:accounts[0], value: web3.utils.toWei('1')})
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    // ganache
    development: {
      port: 8545,
      host: "127.0.0.1",
      network_id: 1337, // Match any network id
    },
    rinkeby: {
      provider: () =>
        new HDWalletProvider({
          privateKeys: [process.env.PRIVATE_KEY],
          providerOrUrl: process.env.INFURA_URL_RINKEBY,
        }),
      network_id: 4, // Ropsten's id
    },
  },
  compilers: {
    solc: {
      version: "^0.8.10",
    },
  },
};

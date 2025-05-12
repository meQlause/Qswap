/** @type import('hardhat/config').HardhatUserConfig */
require("hardhat-contract-sizer");
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.28",
  settings: {
    optimizer: {
      enabled: true,
      runs: 100
    }
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: ["df57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e"]
    }
  }
};

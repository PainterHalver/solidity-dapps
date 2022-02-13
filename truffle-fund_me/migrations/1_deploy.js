const FundMe = artifacts.require("FundMe");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(FundMe);
};

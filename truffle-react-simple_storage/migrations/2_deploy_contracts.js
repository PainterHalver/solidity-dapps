var SimpleStorage = artifacts.require("./SimpleStorage.sol");

module.exports = function (deployer) {
  const simpleStorage = deployer.deploy(SimpleStorage);
};

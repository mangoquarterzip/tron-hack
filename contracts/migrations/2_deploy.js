var posTerminal = artifacts.require("./PoSTerminal.sol");
var vaultFactory = artifacts.require("./VaultFactory.sol");

module.exports = function (deployer) {
  deployer.deploy(posTerminal);
  deployer.deploy(vaultFactory);
};

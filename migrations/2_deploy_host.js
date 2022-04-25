const Host = artifacts.require("Host");
const { deployProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {
  await deployProxy(Host, [], {
    deployer,
  });
};

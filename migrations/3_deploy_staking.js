const StakingToken = artifacts.require("StakingToken");
const { deployProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {
  const name = "StakingToken";
  const symbol = "DKST";
  const totalSupply = 10000;
  await deployProxy(StakingToken, [name, symbol, totalSupply], {
    deployer,
    initializer: "initialize",
  });
};

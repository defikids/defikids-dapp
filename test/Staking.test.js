require("chai").use(require("chai-as-promised")).should();

const Staking = artifacts.require("StakingToken");

const { deployProxy, upgradeProxy } = require("@openzeppelin/truffle-upgrades");

contract("Staking", ([]) => {
  let staking;
  const name = "StakingToken";
  const symbol = "DKST";
  const totalSupply = 1000000000;

  before(async () => {
    staking = await deployProxy(Staking, [name, symbol, totalSupply]);
  });

  describe("deployment", () => {
    it("tracks the contract address", async () => {
      (await staking.address).should.not.be.null;
    });
    it("tracks the contract name", async () => {
      (await staking.name()).should.equal("StakingToken");
    });
    it("tracks the contract symbol", async () => {
      (await staking.symbol()).should.equal("DKST");
    });
    it("tracks the contract total supply", async () => {
      (await staking.totalSupply()).toString().should.be.equal("1000000000");
    });
  });
});

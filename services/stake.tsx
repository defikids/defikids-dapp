import { BigNumber, ethers } from "ethers";
import { StakingToken } from "../types/ethers-contracts";
import STAKING_ABI from "../abis/contracts/StakingToken.json";
import { approveUSDCX } from "./usdcx_contract";

const CONTRACT_ADDRESS = "0xbef965924efc5Fc353cC583F139419ef2150BaCf";

export interface IStakerDetails {
  totalInvested: BigNumber;
  totalRewards: BigNumber;
  totalCreatedStakes: BigNumber;
}
export interface IContractStake {
  stakeId: BigNumber;
  stakeStartTime: BigNumber;
  stakeEndTime: BigNumber;
  amount: BigNumber;
  duration: BigNumber;
  itemName: string;
}

export interface IStake {
  id: string;
  amount: BigNumber;
  remainingDays: number;
  duration: number;
  name: string;
}

const parseStake = function (stake: IContractStake): IStake {
  console.log("start time:", new Date(stake.stakeStartTime.toNumber() * 1000));
  const timePassed = Math.abs(
    new Date().getTime() -
      new Date(stake.stakeStartTime.toNumber() * 1000).getTime()
  );
  const remainingDays =
    stake.duration.toNumber() - Math.ceil(timePassed / (1000 * 60 * 60 * 24));

  return {
    id: stake.stakeId.toString(),
    name: stake.itemName,
    amount: stake.amount,
    duration: stake.duration.toNumber(),
    remainingDays,
  };
};

export enum IStakeDuration {
  DAY = 0,
  WEEK = 1,
  FORTNIGHT = 2,
}

export const REWARD_RATE = 0.05;

class StakeContract {
  private contract: StakingToken;
  private wallet: string;
  private provider: ethers.providers.Web3Provider;

  constructor(
    contract: StakingToken,
    wallet: string,
    provider: ethers.providers.Web3Provider
  ) {
    this.contract = contract;
    this.wallet = wallet;
    this.provider = provider;
  }

  getWallet() {
    return this.wallet;
  }

  static async fromProvider(
    provider: ethers.providers.Web3Provider,
    address?: string
  ) {
    let wallet = address;
    if (!address) {
      const accounts = await provider.send("eth_requestAccounts", []);
      wallet = accounts[0];
    }
    const signer = provider.getSigner(wallet);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      STAKING_ABI.abi,
      signer
    ) as StakingToken;
    return new StakeContract(contract, wallet, provider);
  }

  async fetchStakes(address = this.wallet): Promise<IStake[]> {
    const stakes = await this.contract.fetchStakes(address);
    return stakes.map(parseStake);
  }

  fetchStakerDetails(address = this.wallet): Promise<IStakerDetails> {
    return this.contract.fetchStakerDetails(address);
  }

  async createStake(amount: number, duration: IStakeDuration, name: string) {
    const tokens = ethers.utils.parseUnits(amount.toString(), 18);
    await approveUSDCX(this.provider, this.wallet, amount, CONTRACT_ADDRESS);
    return this.contract.createStake(tokens, duration, name);
  }

  static calculateDays(duration: IStakeDuration) {
    let days = 0;
    switch (duration) {
      case IStakeDuration.DAY:
        days = 1;
        break;
      case IStakeDuration.WEEK:
        days = 7;
        break;
      case IStakeDuration.FORTNIGHT:
        days = 14;
        break;
    }
    return days;
  }

  static calculateAllocateReward(amount: number, duration: IStakeDuration) {
    const days = this.calculateDays(duration);
    return parseFloat((days * REWARD_RATE * amount).toFixed(2));
  }

  static calculateUSDCReward(amount: number, duration: IStakeDuration) {
    const days = this.calculateDays(duration);
    return parseFloat(((days * REWARD_RATE * amount) / 365).toFixed(2));
  }
}

export default StakeContract;

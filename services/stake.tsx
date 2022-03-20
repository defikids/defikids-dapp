import { ethers } from "ethers";
import { StakingToken } from "../types/ethers-contracts";
import STAKING_ABI from "../abis/contracts/StakingToken.json";
import { approveUSDCX, getUSDCXBalance, transferUSDCX } from "./usdcx_contract";

const CONTRACT_ADDRESS = "0x321f33AD5Bb157710c2d65F895a7EFB05bDa496f";
const VAULT_ADDRESS = "0x9D324D73a6d43A6c66e080E65bF705F4e078495E";

export interface IStake {
  stakeId: number;
  stakeStartTime: number;
  stakeEndTime: number;
  amount: number;
  duration: number;
}

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

  fetchStakes(address = this.wallet) {
    return this.contract.fetchStakes(address);
  }

  fetchStakerDetails(address: string) {
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

import { Contract, ethers } from "ethers";
import { DEFIKIDS_PROXY_ADDRESS } from "./contract-addresses";
import { getSigner } from "./utils";
import { defikidsCoreABI } from "./artifacts/defikids-core";

class DefiDollarsContract {
  contract: Contract;

  constructor(contract: Contract) {
    this.contract = contract;
  }

  static async fromProvider(provider?: ethers.BrowserProvider) {
    let signer: any;

    if (provider) {
      signer = await getSigner(provider);
    } else {
      signer = await getSigner();
    }
    const contract = new ethers.Contract(
      DEFIKIDS_PROXY_ADDRESS,
      defikidsCoreABI,
      signer
    );
    return new DefiDollarsContract(contract);
  }

  async contractAddress() {
    return this.contract.getAddress();
  }

  async balanceOf(wallet: string) {
    const response = await this.contract.balanceOf(wallet);
    const balance = Number(ethers.formatEther(response));
    return balance;
  }

  async depositAndMint(
    amount: bigint,
    recipients: string[],
    deadline: number,
    v: number,
    r: string,
    s: string
  ) {
    return await this.contract.depositAndMint(
      amount,
      recipients,
      deadline,
      v,
      r,
      s
    );
  }

  async withdrawByMember(
    user: string,
    parent: string,
    amount: bigint,
    deadline: number,
    v: number,
    r: string,
    s: string
  ) {
    return await this.contract.withdrawByMember(
      user,
      parent,
      amount,
      deadline,
      v,
      r,
      s
    );
  }

  async settlement(memberAddress: string, amount: bigint) {
    return await this.contract.settlement(memberAddress, amount);
  }

  async getStableTokenBalance(wallet: string) {
    const response = await this.contract.getStableTokenBalance(wallet);
    const balance = Number(ethers.formatEther(response));
    return balance;
  }

  async withdraw() {
    return await this.contract.withdraw();
  }

  async setStableTokenAddress(stableTokenAddress: string) {
    return await this.contract.setStableTokenAddress(stableTokenAddress);
  }

  async allowance(owner: string, spender: string) {
    const response = await this.contract.allowance(owner, spender);
    const allowance = Number(ethers.formatEther(response));
    return allowance;
  }
}

export default DefiDollarsContract;

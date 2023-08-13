import { ethers } from "ethers";
import { Host } from "../types/ethers-contracts";
import HOST_ABI from "../abis/contracts/Host.json";
import { SequenceSigner } from "@0xsequence/provider";
import { HOST_ADDRESS } from "@/store/contract/contractStore";

export enum UserType {
  PARENT = 1,
  CHILD = 2,
  UNREGISTERED = 3,
}

export interface IChild {
  username: string;
  _address: string;
  isActive: boolean;
  isLocked: boolean;
}

class HostContract {
  private contract: Host;
  private wallet: string;

  constructor(contract: Host, wallet: string) {
    this.contract = contract;
    this.wallet = wallet;
  }

  getWallet() {
    return this.wallet;
  }

  static async fromProvider(
    provider: ethers.providers.JsonRpcProvider | SequenceSigner,
    address?: string
  ) {
    const contract = new ethers.Contract(
      HOST_ADDRESS,
      HOST_ABI.abi,
      provider
    ) as Host;

    return new HostContract(contract, address);
  }

  async getUserType(): Promise<UserType> {
    const result = await this.contract.getUserType(this.wallet);
    const userType = parseInt(result._hex, 16);
    return userType;
  }

  async registerParent() {
    return this.contract.registerParent();
  }

  async fetchChildren() {
    const children = await this.contract.fetchChildren();
    return children;
  }

  async addChild(wallet: string, username: string, isLocked: boolean) {
    return this.contract.addChild(wallet, username, isLocked);
  }

  async changeAccess(wallet: string, childId: number) {
    return this.contract.changeAccess(wallet, childId);
  }
}

export default HostContract;

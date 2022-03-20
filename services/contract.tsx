import { ethers } from "ethers";
import { Host } from "../types/ethers-contracts";
import HOST_ABI from "../abis/contracts/Host.json";

const CONTRACT_ADDRESS = "0xfC09d939b3d622677331e5252FDAEc7Cf8E6c08E";

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
      HOST_ABI.abi,
      signer
    ) as Host;
    return new HostContract(contract, wallet);
  }

  async getUserType(): Promise<UserType> {
    const result = await this.contract.getUserType(this.wallet);
    const userType = parseInt(result._hex, 16);
    return userType;
  }

  async createParent() {
    return this.contract.registerParent();
  }

  async fetchChildren() {
    return this.contract.fetchChildren();
  }

  async addMember(wallet: string, username: string, isLocked: boolean) {
    return this.contract.addChild(wallet, username, isLocked);
  }

  async changeAccess(wallet: string, childId: number) {
    return this.contract.changeAccess(wallet, childId);
  }
}

export default HostContract;

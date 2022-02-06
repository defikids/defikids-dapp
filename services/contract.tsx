import { ethers } from "ethers";
import { Host } from "../types/ethers-contracts";
import HOST_ABI from "../artifacts/contracts/Host.sol/Host.json";

const CONTRACT_ADDRESS = "0xC92A93D03cFA2b34A904fE5A48c20Aa86aE54396";

export enum UserType {
  PARENT = 1,
  CHILD = 2,
  UNREGISTERED = 3,
}

export interface IChild {
  name: string;
  address: string;
  access: 0 | 1;
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

  static async fromProvider(provider: ethers.providers.Web3Provider) {
    const accounts = await provider.send("eth_requestAccounts", []);
    const wallet = accounts[0];
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
    return this.contract.createParent();
  }

  async fetchChildren() {
    return this.contract.fetchChildren();
  }

  async addMember(wallet: string, username: string) {
    return this.contract.addMember(wallet, username);
  }
}

export default HostContract;

import { ethers } from "ethers";
import { Host } from "../types/ethers-contracts";
import HOST_ABI from "../abis/contracts/Host.json";
import { HOST_ADDRESS } from "@/store/contract/contractStore";
import { WalletClient } from "wagmi";

export enum UserType {
  UNREGISTERED = 0,
  PARENT = 1,
  CHILD = 2,
}

export interface IChild {
  username: string;
  avatarURI: string;
  familyId: string;
  memberSince: ethers.BigNumber;
  wallet: string;
  childId: number;
  sandboxMode: boolean;
  isActive: boolean;
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
    provider:
      | ethers.providers.JsonRpcProvider
      | ethers.providers.JsonRpcSigner
      | WalletClient,
    address?: string
  ) {
    console.log("address", address);
    console.log("provider", provider);
    const contract = new ethers.Contract(
      HOST_ADDRESS,
      HOST_ABI.abi,
      provider
    ) as Host;

    return new HostContract(contract, address);
  }

  async getUserType(accountAddress: string): Promise<UserType> {
    const userType = await this.contract.getUserType(accountAddress);
    return userType;
  }

  async registerParent(hash: string, avatarURI: string, username: string) {
    // @ts-ignore
    return this.contract.registerParent(hash, avatarURI, username);
  }

  async fetchChildren() {
    const familyId = localStorage.getItem("defi-kids.family-id");
    const children = await this.contract.fetchChildren(familyId);
    console.log("fetchChildren-children", children);
    return children;
  }

  async addChild(
    familyId: string,
    username: string,
    avatarURI: string,
    wallet: string,
    sandboxMode: boolean
  ) {
    return this.contract.addChild(
      familyId,
      username,
      avatarURI,
      wallet,
      sandboxMode
    );
  }

  async changeAccess(wallet: string, childId: number) {
    return this.contract.changeAccess(wallet, childId);
  }

  async hashFamilyId(wallet: string, familyId: string) {
    return this.contract.hashFamilyId(wallet, familyId);
  }

  async getFamilyIdByOwner(wallet: string) {
    return this.contract.getFamilyIdByOwner(wallet);
  }
}

export default HostContract;

import { ethers } from "ethers";
//@ts-ignore
import { Host } from "../types/ethers-contracts";
import HOST_ABI from "../abis/contracts/Host.json";
import { HOST_ADDRESS } from "@/store/contract/contractStore";
import { ChildDetails } from "@/dataSchema/hostContract";

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
    provider: ethers.providers.JsonRpcProvider | ethers.providers.JsonRpcSigner,
    address?: string
  ) {
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
    const familyId = await this.contract.getFamilyIdByOwner(this.wallet);
    const response = await this.contract.fetchChildren(familyId);
    let children = [];
    if (response.length)
      children = response.map((child) => {
        return {
          username: child.username,
          avatarURI: child.avatarURI,
          familyId: child.familyId,
          memberSince: child.memberSince.toString(),
          wallet: child.wallet,
          childId: child.childId,
          sandboxMode: child.sandboxMode,
          isActive: child.isActive,
        };
      });

    console.log("children", children);

    return children;
  }

  async addChild(
    username: string,
    avatarURI: string,
    wallet: string,
    sandboxMode: boolean
  ) {
    console.log("contract.tsx");
    console.log("this.contract", this.contract);
    console.log("this.wallet");
    const familyId = await this.contract.getFamilyIdByOwner(this.wallet);
    console.log("familyId", familyId);
    const tx = await this.contract.addChild(
      familyId,
      username,
      avatarURI,
      wallet,
      sandboxMode
    );
    return tx;
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

  async getFamilyByOwner(wallet: string) {
    const response = await this.contract.getFamilyByOwner(wallet);

    let familyDetails = {
      familyId: response.familyId,
      memberSince: response.memberSince.toString(),
      avatarURI: response.avatarURI,
      owner: response.owner,
      username: response.username,
    };
    return familyDetails;
  }
}

export default HostContract;

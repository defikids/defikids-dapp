// import { ethers } from "ethers";
// //@ts-ignore
// import { Host } from "../../types/ethers-contracts";
// import HOST from "../artifacts/src/Host.sol/Host.json";
// import { HOST_ADDRESS } from "@/store/contract/contractStore";
// import { User } from "@/data-schema/types";
// import { UserType } from "@/data-schema/enums";

// // export enum UserType {
// //   UNREGISTERED = 0,
// //   PARENT = 1,
// //   CHILD = 2,
// // }

// export interface IChild {
//   username: string;
//   avatarURI: string;
//   familyId: string;
//   memberSince: ethers.BigNumber;
//   wallet: string;
//   childId: number;
//   sandboxMode: boolean;
//   isActive: boolean;
// }

// class HostContract {
//   private contract: Host;
//   private wallet: string;

//   constructor(contract: Host, wallet: string) {
//     this.contract = contract;
//     this.wallet = wallet;
//   }

//   getWallet() {
//     return this.wallet;
//   }

//   static async fromProvider(
//     provider: ethers.providers.JsonRpcProvider | ethers.providers.JsonRpcSigner,
//     address?: string
//   ) {
//     const contract = new ethers.Contract(
//       HOST_ADDRESS,
//       HOST.abi,
//       provider
//     ) as Host;

//     return new HostContract(contract, address);
//   }

//   async getUserType(accountAddress: string): Promise<UserType> {
//     const userType = await this.contract.getUserType(accountAddress);
//     return userType;
//   }

//   async registerParent(
//     familyId: string,
//     walletAddress: string,
//     avatarURI: string,
//     username: string
//   ) {
//     const hash = await this.contract.hashFamilyId(walletAddress, familyId);
//     return this.contract.registerParent(hash, avatarURI, username);
//   }

//   async fetchChildren(walletAddress: string) {
//     const familyId = await this.contract.getFamilyIdByOwner(walletAddress);
//     const response = await this.contract.fetchChildren(familyId);
//     let children = [];
//     if (response.length)
//       children = response.map((child) => {
//         return {
//           username: child.username,
//           avatarURI: child.avatarURI,
//           familyId: child.familyId,
//           memberSince: child.memberSince.toString(),
//           wallet: child.wallet,
//           childId: child.childId,
//           sandboxMode: child.sandboxMode,
//           isActive: child.isActive,
//         };
//       });

//     return children;
//   }

//   async addChild(
//     username: string,
//     avatarURI: string,
//     wallet: string,
//     sandboxMode: boolean
//   ) {
//     const familyId = await this.contract.getFamilyIdByOwner(this.wallet);
//     const tx = await this.contract.addChild(
//       familyId,
//       username,
//       avatarURI,
//       wallet,
//       sandboxMode
//     );
//     return tx;
//   }

//   async changeAccess(wallet: string, childId: number) {
//     return this.contract.changeAccess(wallet, childId);
//   }

//   async hashFamilyId(wallet: string, familyId: string) {
//     return this.contract.hashFamilyId(wallet, familyId);
//   }

//   async getFamilyIdByOwner(wallet: string) {
//     return this.contract.getFamilyIdByOwner(wallet);
//   }

//   async getFamilyByOwner(wallet: string) {
//     const response = await this.contract.getFamilyByOwner(wallet);

//     let familyDetails = {
//       familyId: response.familyId,
//       memberSince: response.memberSince.toString(),
//       avatarURI: response.avatarURI,
//       owner: response.owner,
//       username: response.username,
//     };
//     return familyDetails;
//   }

//   async updateAvatarURI(avatarURI: string) {
//     return this.contract.updateAvatarURI(avatarURI);
//   }

//   async updateChildAvatarURI(
//     childAddress: string,
//     avatarURI: string,
//     familyId: string
//   ) {
//     return this.contract.updateChildAvatarURI(
//       familyId,
//       childAddress,
//       avatarURI
//     );
//   }

//   async toggleSandbox(childAddress: string, familyId: string) {
//     return this.contract.toggleSandbox(childAddress, familyId);
//   }

//   async updateUsername(username: string) {
//     return this.contract.updateUsername(username);
//   }

//   async updateChildUsername(
//     familyId: string,
//     childAddress: string,
//     username: string
//   ) {
//     return this.contract.updateChildUsername(familyId, childAddress, username);
//   }

//   //   async fetchChild(familyId: string, childAddress: string) {
//   //     const response = await this.contract.fetchChild(childAddress, familyId);
//   //     let childDetails: User = {
//   //       username: response.username,
//   //       avatarURI: response.avatarURI,
//   //       familyId: response.familyId,
//   //       memberSince: response.memberSince.toString(),
//   //       wallet: response.wallet,
//   //       sandboxMode: response.sandboxMode,
//   //     };
//   //     return childDetails;
//   //   }
// }

// export default HostContract;

export {};

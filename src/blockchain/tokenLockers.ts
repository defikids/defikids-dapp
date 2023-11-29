import { Contract, ethers } from "ethers";
import { tokenLockersABI } from "./artifacts/tokenLockers";
import { TOKEN_LOCKERS_ADDRESS } from "./contract-addresses";
import { getSigner } from "./utils";
import { Locker } from "@/data-schema/types";
import { durationInSecondsRemaining, secondsToDays } from "@/utils/dateTime";

const formattedLocker = (locker: Locker) => {
  return {
    amount: ethers.formatEther(locker[0].toString()),
    lockTime: secondsToDays(locker[1].toString()),
    name: locker[2],
    lockerNumber: locker[3].toString(),
    owner: locker[4],
    lockAppliedAt: locker[5].toString(),
    lockTimeRemaining: durationInSecondsRemaining(
      locker[1].toString(),
      locker[5].toString()
    ),
  };
};

class TokenLockerContract {
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
      TOKEN_LOCKERS_ADDRESS,
      tokenLockersABI,
      signer
    );
    return new TokenLockerContract(contract);
  }

  async contractAddress() {
    return this.contract.getAddress();
  }

  async fetchAllLockersByUser() {
    const response = await this.contract.fetchAllLockersByUser();
    console.log(response);
    const formattedLockers = response.map((locker: Locker) =>
      formattedLocker(locker)
    );

    console.log(formattedLockers);
    return formattedLockers;
  }

  async getTotalValueLockedByUser(wallet: string) {
    const response = await this.contract.getTotalValueLockedByUser(wallet);
    const totalValue = response.toString();
    return totalValue;
  }

  async getLockerCountByUser(wallet: string) {
    const response = await this.contract.getLockerCountByUser(wallet);
    const lockerCount = response.toString();
    return lockerCount;
  }

  async createLocker(
    lockerName: string,
    amount: bigint,
    lockDuration: number,
    deadline: number,
    v: number,
    r: string,
    s: string
  ) {
    return this.contract.createLocker(
      lockerName,
      amount,
      lockDuration,
      deadline,
      v,
      r,
      s
    );
  }

  async addToLocker(
    amount: bigint,
    lockerNumber: number,
    deadline: number,
    v: number,
    r: string,
    s: string
  ) {
    return this.contract.addToLocker(amount, lockerNumber, deadline, v, r, s);
  }

  async emptyLocker(lockerNumber: number) {
    return this.contract.emptyLocker(lockerNumber);
  }

  async removeFromLocker(lockerNumber: number, amount: bigint) {
    return this.contract.removeFromLocker(lockerNumber, amount);
  }

  async applyNewLock(lockerNumber: number, lockDuration: number) {
    return this.contract.applyNewLock(lockerNumber, lockDuration);
  }

  async transferFundsBetweenLockers(
    lockerNumber: number,
    recipientLockerNumber: number,
    amount: bigint
  ) {
    return this.contract.transferFundsBetweenLockers(
      lockerNumber,
      recipientLockerNumber,
      amount
    );
  }

  async removeLocker(lockerNumber: number, lockerOwner: string) {
    return this.contract.removeLocker(lockerNumber, lockerOwner);
  }

  async withdraw() {
    return this.contract.withdraw();
  }

  async deleteLocker(lockerNumber: number) {
    return this.contract.deleteLocker(lockerNumber);
  }

  async renameLocker(lockerNumber: number, newName: string) {
    return this.contract.renameLocker(lockerNumber, newName);
  }
}

export default TokenLockerContract;

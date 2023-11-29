import { ethers } from "ethers";
import { durationInSecondsRemaining, secondsToDays } from "./dateTime";
import { Locker } from "@/data-schema/types";

export const formattedLocker = (locker: Locker) => {
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

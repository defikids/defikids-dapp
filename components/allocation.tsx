import { BigNumber, ethers } from "ethers";
import React from "react";
import { ProgressBar } from "react-bootstrap";
import { twMerge } from "tailwind-merge";
import StakeContract, { IStake } from "../services/stake";

interface IProps extends IStake {
  className?: string;
}

const Allocation: React.FC<IProps> = ({
  name,
  amount,
  duration,
  remainingDays,
  className,
}) => {
  return (
    <div
      className={twMerge(
        "bg-grey-light p-2 mt-3 rounded",
        "last:mb-0",
        className
      )}
    >
      <p className="text-blue-dark text-md mb-2 ml-1">{name}</p>
      <ProgressBar min={0} max={duration} now={duration - remainingDays} />
      <div className="flex justify-between mt-2">
        <p className="ml-1">{remainingDays} days remaining</p>
        <h4 className="text-md">{ethers.utils.formatEther(amount)} USDCx</h4>
      </div>
    </div>
  );
};

export default Allocation;

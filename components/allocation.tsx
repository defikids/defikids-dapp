import React from "react";
import { ProgressBar } from "react-bootstrap";
import { twMerge } from "tailwind-merge";
import StakeContract, { IStakeDuration } from "../services/stake";

interface IProps {
  name: string;
  value: number;
  duration: number;
  durationTotal: IStakeDuration;
  className?: string;
}

const Allocation: React.FC<IProps> = ({
  name,
  value,
  duration,
  durationTotal,
  className,
}) => {
  const totalDays = StakeContract.calculateDays(durationTotal);
  return (
    <div
      className={twMerge(
        "bg-grey-light p-2 mt-3 rounded",
        "last:mb-0",
        className
      )}
    >
      <p className="text-blue-dark text-md mb-2 ml-1">{name}</p>
      <ProgressBar min={0} max={totalDays} now={duration + 1} />
      <div className="flex justify-between mt-2">
        <p className="ml-1">{totalDays - duration} days remaining</p>
        <h4 className="text-md">{value} USDCx</h4>
      </div>
    </div>
  );
};

export default Allocation;

import React from "react";
import { ProgressBar } from "react-bootstrap";
import { twMerge } from "tailwind-merge";

interface IProps {
  name: string;
  value: number;
  total: number;
}

const Allocation: React.FC<IProps> = ({ name, value, total }) => {
  return (
    <div className={twMerge("bg-grey-light p-2 mt-3 rounded", "last:mb-0")}>
      <ProgressBar min={0} max={total} now={value} />
      <div className="flex justify-between mt-2">
        <p className="text-blue-dark">{name}</p>
        <h4 className="text-md">
          {value}/{total}
        </h4>
      </div>
    </div>
  );
};

export default Allocation;

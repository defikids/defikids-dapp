import React, { ReactHTMLElement } from "react";
import { twMerge } from "tailwind-merge";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const Toggle: React.FC<IProps> = ({
  value,
  onValueChange,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={twMerge("flex cursor-pointer items-center", className)}
      {...props}
      onClick={() => onValueChange(!value)}
    >
      <div className="relative w-24" style={{ width: 24 }}>
        <div
          className="rounded-lg border-1 border-black"
          style={{ height: 8, marginTop: 2 }}
        ></div>
        <div
          className={`rounded-full border-1 border-black  absolute top-0 transition ${
            !value ? "left-0 bg-grey-medium" : "right-0 bg-blue-oil"
          }`}
          style={{ width: 12, height: 12 }}
        />
      </div>
      {children}
    </div>
  );
};

export default Toggle;

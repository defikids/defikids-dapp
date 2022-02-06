import React from "react";
import { twMerge } from "tailwind-merge";

interface IProps extends React.HTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

const Button: React.FC<IProps> = ({
  className,
  size = "md",
  disabled,
  ...props
}) => {
  const style =
    size === "lg"
      ? "p-6 h-130 rounded-md flex items-end text-base pb-3"
      : size === "sm"
      ? "px-3 py-2 text-sm"
      : "";
  return (
    <button
      {...props}
      className={twMerge(
        "bg-orange text-white text-lg font-medium br-90 rounded-full px-6 py-3 hover:shadow-lg transition",
        style,
        disabled ? "opacity-40 pointer-events-none" : "",
        className
      )}
    />
  );
};

export default Button;

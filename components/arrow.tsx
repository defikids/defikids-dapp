import React from "react";
import Image, { ImageProps } from "next/image";
import { twMerge } from "tailwind-merge";

interface IProps extends Omit<ImageProps, "src" | "alt"> {
  dir?: "up" | "down" | "left" | "right";
}

const Arrow: React.FC<IProps> = ({
  width = 24,
  height = 24,
  dir = "up",
  ...props
}) => {
  let rotate = 0;
  switch (dir) {
    case "down":
      rotate = 180;
      break;
    case "right":
      rotate = 90;
      break;
    case "left":
      rotate = 270;
      break;
  }
  return (
    <div className="flex" style={{ transform: `rotate(${rotate}deg)` }}>
      <Image
        {...props}
        src="/arrow.svg"
        alt={`Arrow ${dir}`}
        width={width}
        height={height}
      />
    </div>
  );
};

export default Arrow;

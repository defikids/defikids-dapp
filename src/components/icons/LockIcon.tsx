"use client";

import React from "react";
import Image, { ImageProps } from "next/image";

interface IProps extends Omit<ImageProps, "src" | "alt"> {}

const LockIcon: React.FC<IProps> = ({ width = 24, height = 24, ...props }) => {
  return (
    <Image
      {...props}
      src="/icons/lock-icon.svg"
      alt={`Lock`}
      width={width}
      height={height}
    />
  );
};

export default LockIcon;

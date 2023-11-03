"use client";

import React from "react";
import Image, { ImageProps } from "next/image";

interface IProps extends Omit<ImageProps, "src" | "alt"> {}

const UsdcTokenIcon: React.FC<IProps> = ({
  width = 24,
  height = 24,
  ...props
}) => {
  return (
    <Image
      {...props}
      src="/icons/usdc-token-icon.svg"
      alt={`Add`}
      width={width}
      height={height}
    />
  );
};

export default UsdcTokenIcon;

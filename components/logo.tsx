import React from "react";
import Image, { ImageProps } from "next/image";

const Logo: React.FC<
  Omit<ImageProps, "src" | "alt"> & { variant?: "white" | "blue" }
> = ({ width = 48, height = 48, variant = "white", ...props }) => {
  return (
    <Image
      {...props}
      src="/pig_logo.png"
      alt="DefiKids Logo"
      width={width}
      height={height}
    />
  );
};

export default Logo;

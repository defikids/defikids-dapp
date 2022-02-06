import React from "react";
import Image, { ImageProps } from "next/image";

const Logo: React.FC<
  Omit<ImageProps, "src" | "alt"> & { variant?: "white" | "blue" }
> = ({ width = 48, height = 18, variant = "white", ...props }) => {
  return (
    <Image
      {...props}
      src={variant === "white" ? "/logo.svg" : "/logo_blue.svg"}
      alt="Allocate Logo"
      width={width}
      height={height}
    />
  );
};

export default Logo;

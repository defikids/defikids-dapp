import React from "react";
import Image, { ImageProps } from "next/image";

const Logo: React.FC<Omit<ImageProps, "src" | "alt">> = ({
  width = 48,
  height = 18,
  ...props
}) => {
  return (
    <Image
      {...props}
      src="/logo.svg"
      alt="Allocate Logo"
      width={width}
      height={height}
    />
  );
};

export default Logo;

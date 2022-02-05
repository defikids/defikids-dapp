import React from "react";
import Image, { ImageProps } from "next/image";

const LogoNavbar: React.FC<Omit<ImageProps, "src" | "alt">> = ({
  width = 160,
  height = 24,
  ...props
}) => {
  return (
    <Image
      {...props}
      src="/logo_navbar.svg"
      alt="Allocate Logo"
      width={width}
      height={height}
    />
  );
};

export default LogoNavbar;

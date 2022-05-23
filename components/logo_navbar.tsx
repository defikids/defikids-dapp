import React from "react";
import Image, { ImageProps } from "next/image";

const LogoNavbar: React.FC<Omit<ImageProps, "src" | "alt">> = ({
  width = 72,
  height = 72,
  ...props
}) => {
  return (
    <div className="flex items-center">
      <Image
        {...props}
        src="/pig_logo.png"
        alt="DefiKids Logo"
        width={width}
        height={height}
      />
      <h1 className="text-blue-dark text-[52px] ml-5">DefiKids</h1>
    </div>
  );
};

export default LogoNavbar;

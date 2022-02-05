import React from "react";
import Image, { ImageProps } from "next/image";

interface IProps extends Omit<ImageProps, "src" | "alt"> {}

const Plus: React.FC<IProps> = ({ width = 24, height = 24, ...props }) => {
  return (
    <Image
      {...props}
      src="/plus.svg"
      alt={`Add`}
      width={width}
      height={height}
    />
  );
};

export default Plus;

import React from "react";

interface IProps extends React.HTMLAttributes<HTMLSpanElement> {
  color: string;
}
const UnderlineText: React.FC<IProps> = ({
  color,
  className,
  children,
  ...props
}) => (
  <span {...props} className={`relative px-1 ${className}`}>
    <span className={`${color} absolute w-full h-3 left-0 bottom-3 z-0`} />
    <span className="z-10 relative">{children}</span>
  </span>
);

export default UnderlineText;

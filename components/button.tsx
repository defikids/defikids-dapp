import React from "react";

interface IProps extends React.HTMLAttributes<HTMLButtonElement> {}

const Button: React.FC<IProps> = ({ className, ...props }) => (
  <button
    {...props}
    className={`bg-orange text-white text-lg font-medium br-90 rounded-full px-6 py-3 hover:shadow-lg ${className}`}
  />
);

export default Button;

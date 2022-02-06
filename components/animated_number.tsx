import React, { useEffect, useRef, useState } from "react";

interface IProps extends React.HTMLAttributes<HTMLParagraphElement> {
  value: number;
  rate: number;
  timeout?: number;
  decimalPlaces?: number;
}

const AnimatedNumber: React.FC<IProps> = ({
  value,
  rate,
  timeout = 100,
  decimalPlaces = 7,
  ...props
}) => {
  const [valueShow, setValueShow] = useState(value);
  useEffect(() => {
    setValueShow(value);
    const id = setInterval(() => {
      setValueShow((currValue) => {
        return currValue + rate / (1000 / timeout);
      });
    }, timeout);
    return () => {
      clearInterval(id);
    };
  }, [value, rate]);
  return <p {...props}>{valueShow.toFixed(decimalPlaces)}</p>;
};

export default AnimatedNumber;

"use client";

import { Flex, Heading, useBreakpointValue, Image } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

interface DefiKidsProps {
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
}

const DefiKidsLogo = ({ direction = "row" }: DefiKidsProps) => {
  const router = useRouter();
  const isMobileSize = useBreakpointValue({
    base: true,
    sm: false,
    md: false,
    lg: false,
  });

  return (
    <Flex
      direction={direction}
      align="center"
      cursor="pointer"
      onClick={() => {
        router.push("/");
      }}
    >
      {!isMobileSize && (
        <Image
          src={"/logos/pig_logo.png"}
          alt="Loader"
          width="50"
          height="50"
        />
      )}

      <Heading size="lg" ml={isMobileSize ? 0 : 5}>
        Defikids
      </Heading>
    </Flex>
  );
};

export default DefiKidsLogo;

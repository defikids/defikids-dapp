"use client";

import { trimAddress } from "@/utils/web3";
import { Flex, Heading, Text, Center } from "@chakra-ui/react";
import { useBalance } from "wagmi";

const AccountBalance = ({ walletAddress }: { walletAddress: string }) => {
  const { data } = useBalance({
    address: walletAddress as `0x${string}`,
    watch: true,
  });
  return (
    <>
      <Flex
        direction="row"
        alignItems="baseline"
        justify="center"
        mt={5}
        ml={5}
      >
        <Heading size="2xl" display="flex" alignItems="baseline">
          {`${Number(data?.formatted).toFixed(4)}`}
        </Heading>
        <Text fontSize="sm" ml={2}>
          {data?.symbol}
        </Text>
      </Flex>
      <Center>{trimAddress(walletAddress)}</Center>
    </>
  );
};

export default AccountBalance;

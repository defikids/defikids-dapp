"use client";

import { trimAddress } from "@/utils/web3";
import { CopyIcon } from "@chakra-ui/icons";
import {
  Flex,
  Heading,
  Text,
  Center,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import { useBalance } from "wagmi";

const AccountBalance = ({ walletAddress }: { walletAddress: string }) => {
  const { data } = useBalance({
    address: walletAddress as `0x${string}`,
    watch: true,
  });

  const toast = useToast();
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

      <Tooltip label="Copy to clipboard" hasArrow placement="bottom">
        <Center
          cursor="pointer"
          onClick={() => {
            navigator.clipboard.writeText(walletAddress);
            toast({
              title: "Copied to clipboard",
              status: "success",
            });
          }}
        >
          {trimAddress(walletAddress)}
        </Center>
      </Tooltip>
    </>
  );
};

export default AccountBalance;

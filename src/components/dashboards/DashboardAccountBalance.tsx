"use client";

import { UserType } from "@/data-schema/enums";
import { trimAddress } from "@/utils/web3";
import {
  Flex,
  Heading,
  Text,
  Center,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import { stable_coin_symbol } from "@/config";
import { User } from "@/data-schema/types";

const AccountBalance = ({
  walletAddress,
  tokenBalance,
  user,
}: {
  walletAddress: string;
  tokenBalance: number;
  user: User;
}) => {
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
        <Heading
          size={tokenBalance > 1000 ? "xl" : "2xl"}
          display="flex"
          alignItems="baseline"
        >
          {Number(tokenBalance).toFixed(2)}
        </Heading>
        <Text fontSize="sm" ml={2}>
          {user?.userType === UserType.PARENT ? stable_coin_symbol : "DFD"}
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

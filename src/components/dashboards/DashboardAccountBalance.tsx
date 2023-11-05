"use client";

import { UserType } from "@/data-schema/enums";
import { useAuthStore } from "@/store/auth/authStore";
import { trimAddress } from "@/utils/web3";
import {
  Flex,
  Heading,
  Text,
  Center,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import { shallow } from "zustand/shallow";
import { stable_coin_symbol } from "@/config";

const AccountBalance = ({
  walletAddress,
  tokenBalance,
}: {
  walletAddress: string;
  tokenBalance: number;
}) => {
  const { userDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
    }),
    shallow
  );

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
          {userDetails?.userType === UserType.PARENT
            ? stable_coin_symbol
            : "DFD"}
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

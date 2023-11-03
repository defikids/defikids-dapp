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
import { useBalance } from "wagmi";
import shallow from "zustand/shallow";

const AccountBalance = ({
  walletAddress,
  tokenBalance,
}: {
  walletAddress: string;
  tokenBalance: number;
}) => {
  const { data } = useBalance({
    address: walletAddress as `0x${string}`,
    watch: true,
  });

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
          {Number(tokenBalance).toFixed(4)}
        </Heading>
        <Text fontSize="sm" ml={2}>
          {userDetails?.userType === UserType.PARENT ? "USDC" : "DFD"}
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

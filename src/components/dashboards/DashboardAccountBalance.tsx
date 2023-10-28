"use client";

import { UserType } from "@/data-schema/enums";
import { useAuthStore } from "@/store/auth/authStore";
import { useContractStore } from "@/store/contract/contractStore";
import { trimAddress } from "@/utils/web3";
import {
  Flex,
  Heading,
  Text,
  Center,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useBalance } from "wagmi";
import shallow from "zustand/shallow";

const AccountBalance = ({ walletAddress }: { walletAddress: string }) => {
  const [tokenBalance, setTokenBalance] = useState(0);

  const { data } = useBalance({
    address: walletAddress as `0x${string}`,
    watch: true,
  });

  const { defiDollarsContractInstance } = useContractStore(
    (state) => ({
      defiDollarsContractInstance: state.defiDollarsContractInstance,
    }),
    shallow
  );

  const { userDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
    }),
    shallow
  );

  const toast = useToast();

  useEffect(() => {
    const defiDollarsBalance = async () => {
      const balance = await defiDollarsContractInstance?.balanceOf(
        userDetails.wallet
      );
      setTokenBalance(Number(ethers.utils.formatEther(balance)));
    };

    defiDollarsBalance();
  }, []);
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
          {`${
            userDetails?.userType === UserType.PARENT
              ? Number(data?.formatted).toFixed(4)
              : Number(tokenBalance).toFixed(4)
          }`}
        </Heading>
        <Text fontSize="sm" ml={2}>
          {userDetails?.userType === UserType.PARENT ? data?.symbol : "DFD"}
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

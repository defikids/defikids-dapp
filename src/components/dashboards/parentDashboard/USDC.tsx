"use client";

import {
  Flex,
  useColorModeValue,
  Heading,
  Button,
  Box,
  Image,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { AddUSDCTokenToWallet } from "@/services/metamask/addToken";
import { useRouter } from "next/navigation";

export const USDC = ({
  stableTokenBalance,
}: {
  stableTokenBalance: number;
}) => {
  const router = useRouter();
  const toast = useToast();

  const handleToast = (response: { message: string; error: string }) => {
    if (response?.message) {
      toast({
        title: response?.message,
        description: "Successfully added to wallet!",
        status: "success",
      });
    } else {
      toast({
        title: response?.error,
        status: "error",
      });
    }
  };

  return (
    <Box p={5} bg={useColorModeValue("gray.100", "gray.900")} rounded="lg">
      <Flex justifyContent="space-between" alignItems="center" pb={2}>
        <Heading as="h3" size="sm" color="white">
          USDC
        </Heading>
        <Tooltip label="Add to Metamask" hasArrow placement="top">
          <Image
            boxSize="100%"
            src="/icons/metamask-icon.svg"
            alt="Metamask"
            width={10}
            cursor="pointer"
            onClick={async (e) => {
              e.stopPropagation();
              const response = (await AddUSDCTokenToWallet()) as unknown as {
                message: string;
                error: string;
              };

              handleToast(response);
            }}
          />
        </Tooltip>
      </Flex>

      <Flex
        rounded="md"
        overflow="hidden"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading size="2xl" display="flex">
          {stableTokenBalance.toFixed(4)}
        </Heading>

        {/* Actions */}
        <Flex justifyContent="space-between" alignItems="center">
          <Button
            colorScheme="blue"
            variant="outline"
            size="sm"
            onClick={() => {
              router.push("/swap");
            }}
          >
            Deposit
          </Button>
          <Button
            colorScheme="blue"
            variant="outline"
            size="sm"
            ml={3}
            onClick={() => {
              router.push("/swap");
            }}
          >
            Withdraw
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

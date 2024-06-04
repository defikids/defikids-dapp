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
import { AddDefiDollarsTokenToWallet } from "@/services/metamask/addToken";

export const DefiDollars = ({
  tokenBalance,
  onOpenWithdrawDefiDollarsModal,
}: {
  tokenBalance: number;
  onOpenWithdrawDefiDollarsModal: () => void;
}) => {
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
      <Flex justifyContent="space-between" alignItems="center">
        <Heading as="h3" size="sm" color="white">
          Defi Dollars
        </Heading>

        <Tooltip label="Add to Metamask" hasArrow placement="top">
          <Image
            boxSize="100%"
            src="/icons/metamask-icon.svg"
            alt="Metamask"
            width={10}
            height={10}
            cursor="pointer"
            onClick={async (e) => {
              e.stopPropagation();
              const response =
                (await AddDefiDollarsTokenToWallet()) as unknown as {
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
          {`${Number(tokenBalance).toFixed(2)}`}
        </Heading>

        {/* Actions */}
        <Flex justifyContent="space-between" alignItems="center">
          <Button
            colorScheme="blue"
            variant="outline"
            size="sm"
            ml={3}
            onClick={(e) => {
              e.stopPropagation();
              onOpenWithdrawDefiDollarsModal();
            }}
          >
            Withdraw
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

"use client";

import {
  Flex,
  useColorModeValue,
  Heading,
  Button,
  Box,
} from "@chakra-ui/react";

export const DefiDollars = ({
  onOpenDepositDefiDollarsModal,
  tokenBalance,
}: {
  onOpenDepositDefiDollarsModal: () => void;
  tokenBalance: number;
}) => {
  return (
    <Box p={5} bg={useColorModeValue("gray.100", "gray.900")} rounded="lg">
      <Heading as="h3" size="sm" color="white" pb={2}>
        Defi Dollars
      </Heading>

      <Flex
        rounded="md"
        overflow="hidden"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading size="2xl" display="flex">
          {`${Number(tokenBalance).toFixed(4)}`}
        </Heading>

        {/* Actions */}
        <Flex justifyContent="space-between" alignItems="center">
          <Button
            colorScheme="blue"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDepositDefiDollarsModal();
            }}
          >
            Deposit
          </Button>
          <Button colorScheme="blue" variant="outline" size="sm" mx={3}>
            Withdraw
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

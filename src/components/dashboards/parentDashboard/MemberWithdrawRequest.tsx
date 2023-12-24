"use client";

import {
  Flex,
  useColorModeValue,
  Heading,
  Button,
  Box,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export const MemberWithdrawRequest = ({
  withdrawRequests,
}: {
  withdrawRequests: number;
}) => {
  const router = useRouter();

  return (
    <Box p={5} bg={useColorModeValue("gray.100", "gray.900")} rounded="lg">
      <Flex justifyContent="space-between" alignItems="center" pb={2}>
        <Heading as="h3" size="sm" color="white">
          Withdraw Requests
        </Heading>
        <Button
          size="xs"
          colorScheme="blue"
          variant="outline"
          cursor="pointer"
          onClick={() => {
            router.push("/withdraw-requests");
          }}
        >
          Manage
        </Button>
      </Flex>

      <Flex
        rounded="md"
        overflow="hidden"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading size="2xl" display="flex">
          {withdrawRequests}
        </Heading>
      </Flex>
    </Box>
  );
};

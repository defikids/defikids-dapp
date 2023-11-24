"use client";

import {
  Center,
  Box,
  Heading,
  Text,
  Container,
  Button,
  Flex,
} from "@chakra-ui/react";
import { useAccount } from "wagmi";

export const TokenLockersMemberLayout = ({
  memberAddress,
}: {
  memberAddress: string;
}) => {
  const { address: connectedAddress } = useAccount();

  return (
    <Box>
      {connectedAddress === memberAddress ? (
        <Box
          h="90%"
          mx={5}
          px={10}
          py={5}
          border={"1px solid #E2E8F0"}
          borderRadius={"xl"}
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Box>
              <Heading fontSize={"xl"} mb={1}>
                Total Locker Owned:
              </Heading>
              <Heading fontSize={"xl"}>Total Locked Value:</Heading>
            </Box>
            <Button
              colorScheme="blue"
              onClick={() => {
                window.location.href = `/token-lockers/${memberAddress}/create`;
              }}
            >
              Create Locker
            </Button>
          </Flex>
        </Box>
      ) : (
        <Container mt="20rem" maxW="5xl" h="90%">
          <Center height="100%">
            <Heading fontSize={"6xl"}>401</Heading>
          </Center>
          <Center mt="1rem" height="100%">
            <Text fontSize={"2xl"}>
              You are not authorized to view this page
            </Text>
          </Center>
        </Container>
      )}
    </Box>
  );
};

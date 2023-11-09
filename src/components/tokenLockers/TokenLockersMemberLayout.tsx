"use client";

import { Center, Box, Heading, Text, Container } from "@chakra-ui/react";
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
        <Center mt="1rem" height="100%">
          {`Token Locker by Member - ${memberAddress}`}
        </Center>
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

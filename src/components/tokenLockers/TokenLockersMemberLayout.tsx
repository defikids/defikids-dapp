"use client";

import {
  Center,
  Box,
  Heading,
  Text,
  Container,
  Button,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { TokenLockerDrawer } from "@/components/tokenLockers/TokenLockerDrawer";
import { TokenLockerFunctions } from "@/data-schema/enums";
import { useState } from "react";

export const TokenLockersMemberLayout = ({
  memberAddress,
}: {
  memberAddress: string;
}) => {
  const [currentFunction, setCurrentFunction] = useState<TokenLockerFunctions>(
    TokenLockerFunctions.NONE
  );
  const { address: connectedAddress } = useAccount();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
                setCurrentFunction(TokenLockerFunctions.CREATE_LOCKER);
                onOpen();
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

      {/* Drawer */}
      <TokenLockerDrawer
        isOpen={isOpen}
        onClose={onClose}
        placement={"right"}
        currentFunction={currentFunction}
      />
    </Box>
  );
};

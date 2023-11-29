"use client";

import {
  Container,
  Flex,
  useColorModeValue,
  Heading,
  Button,
} from "@chakra-ui/react";
import { TokenLockersList } from "@/components/tokenLockers/TokenLockersList";
import { useRouter } from "next/navigation";
import { Locker, User } from "@/data-schema/types";

export const TokenLockers = ({
  userDetails,
  lockersByUser,
}: {
  userDetails: User;
  lockersByUser: Locker[];
}) => {
  const router = useRouter();
  return (
    <Container
      maxW="5xl"
      bg={useColorModeValue("gray.100", "gray.900")}
      h="90%"
    >
      <Flex justify="space-between" my="1rem" align="center">
        <Heading as="h3" size="sm" color="white">
          Token Lockers
        </Heading>
        {lockersByUser.length > 0 && (
          <Button
            size="xs"
            colorScheme="blue"
            variant="outline"
            onClick={() => {
              router.push(`/token-lockers/${userDetails?.wallet}`);
            }}
          >
            View All
          </Button>
        )}
      </Flex>
      {lockersByUser.length > 0 ? (
        <TokenLockersList lockers={lockersByUser} />
      ) : (
        <Flex justify="center" my="1rem" align="center" h="80%">
          <Button
            colorScheme="blue"
            variant="outline"
            onClick={() => {
              router.push(`/token-lockers/${userDetails?.wallet}`);
            }}
          >
            Create Locker
          </Button>
        </Flex>
      )}
    </Container>
  );
};

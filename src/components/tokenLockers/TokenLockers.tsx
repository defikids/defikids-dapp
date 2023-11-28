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
import { User } from "@/data-schema/types";

interface LockerSchema {
  lockTime: string;
  lockerName: string;
  lockedValue: string;
  isLocked: boolean;
  lockDuration: string;
  logo?: string;
}

const lockers: LockerSchema[] = [
  {
    lockTime: "10-23-2023",
    lockerName: `<span style="font-weight: 600">Savings</span>`,
    lockedValue: "130.00",
    isLocked: false,
    lockDuration: "7 days",
    logo: "/logos/compound-logo.png",
  },
  {
    lockTime: "12-23-2023",
    lockerName: `<span style="font-weight: 600">Books</span>`,
    lockedValue: "30.00",
    isLocked: true,
    lockDuration: "14 days",
    logo: "/logos/compound-logo.png",
  },
  {
    lockTime: "01-23-2024",
    lockerName: `<span style="font-weight: 600">PlayStation</span>`,
    lockedValue: "330.00",
    isLocked: true,
    lockDuration: "90 days",
    logo: "/logos/compound-logo.png",
  },
];

export const TokenLockers = ({ userDetails }: { userDetails: User }) => {
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
        {lockers.length > 0 && (
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
      {lockers.length > 0 ? (
        <TokenLockersList lockers={lockers} />
      ) : (
        <Flex justify="center" my="1rem" align="center" h="80%">
          <Button
            colorScheme="blue"
            variant="outline"
            // Open Modal
          >
            Create Locker
          </Button>
        </Flex>
      )}
    </Container>
  );
};

import { Fragment } from "react";
import {
  Flex,
  Stack,
  VStack,
  Divider,
  useColorModeValue,
  Avatar,
  Text,
  Badge,
} from "@chakra-ui/react";
import { Locker } from "@/data-schema/types";

// interface LockerSchema {
//   lockTime: string;
//   lockerName: string;
//   lockedValue: string;
//   isLocked: boolean;
//   lockDuration: string;
//   logo?: string;
// }

export const TokenLockersList = ({ lockers }: { lockers: Locker[] }) => {
  return (
    <VStack
      boxShadow={useColorModeValue(
        "2px 6px 8px rgba(160, 174, 192, 0.6)",
        "2px 6px 8px rgba(9, 17, 28, 0.9)"
      )}
      bg={useColorModeValue("gray.100", "gray.800")}
      rounded="md"
      overflow="hidden"
      spacing={0}
      mb={5}
    >
      {lockers.map((locker, index) => (
        <Fragment key={index + Number(locker.lockTime)}>
          <Flex w="100%" justify="space-between" alignItems="center">
            <Stack spacing={0} direction="row" alignItems="center">
              <Flex p={4}>
                <Avatar
                  size="md"
                  name={locker.name}
                  src={"/logos/pig_logo.png"}
                />
              </Flex>
              <Flex direction="column" p={2}>
                <Text
                  fontSize={{ base: "sm", sm: "md", md: "lg" }}
                  dangerouslySetInnerHTML={{
                    __html: locker.name,
                  }}
                />
                <Text fontSize={{ base: "sm", sm: "md" }}>
                  {locker.amount} DFD
                </Text>
              </Flex>
            </Stack>
            {locker.lockTimeRemaining > 0 && (
              <Badge
                colorScheme={locker.lockTimeRemaining > 0 ? "red" : "green"}
                variant="outline"
                fontSize={{ base: "xs", sm: "sm" }}
                px={2}
                borderRadius={5}
                mr={5}
              >
                {locker.lockTimeRemaining > 0 ? "Locked" : "Unlocked"}
              </Badge>
            )}
          </Flex>
          {lockers.length - 1 !== index && <Divider m={0} />}
        </Fragment>
      ))}
    </VStack>
  );
};

import {
  Flex,
  useColorModeValue,
  Image,
  Text,
  Button,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
  Card,
  CardHeader,
  Heading,
  CardBody,
  Box,
  Stack,
  Divider,
  Badge,
  Container,
  VStack,
  Avatar,
} from "@chakra-ui/react";
import { Locker } from "@/data-schema/types";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { TokenLockerFunctions } from "@/data-schema/enums";
import { Fragment } from "react";

export const TokenLockerCard = ({
  locker,
  setCurrentFunction,
  onOpen,
  setSelectedLocker,
}: {
  locker: Locker;
  setCurrentFunction: any;
  onOpen: any;
  setSelectedLocker: any;
}) => {
  const isLocked = locker.lockTimeRemaining !== 0;

  const menuItems = () => {
    return (
      <Menu>
        <MenuButton as={Button} size="xs" rightIcon={<ChevronDownIcon />}>
          Actions
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => {
              setCurrentFunction(TokenLockerFunctions.RENAME_LOCKER);
              setSelectedLocker(locker);
              onOpen();
            }}
          >
            Rename Locker
          </MenuItem>
          <MenuItem
            onClick={() => {
              setCurrentFunction(TokenLockerFunctions.ADD_TO_LOCKER);
              setSelectedLocker(locker);
              onOpen();
            }}
          >
            Add to Locker
          </MenuItem>

          {!isLocked && (
            <>
              <MenuItem
                onClick={() => {
                  setCurrentFunction(TokenLockerFunctions.APPLY_NEW_LOCK);
                  setSelectedLocker(locker);
                  onOpen();
                }}
              >
                Apply New Lock
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setCurrentFunction(
                    TokenLockerFunctions.TRANSFER_FUNDS_BETWEEN_LOCKERS
                  );
                  setSelectedLocker(locker);
                  onOpen();
                }}
              >
                Transfer Funds Between Lockers
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setCurrentFunction(TokenLockerFunctions.EMPTY_LOCKER);
                  setSelectedLocker(locker);
                  onOpen();
                }}
              >
                Empty Locker
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setCurrentFunction(TokenLockerFunctions.REMOVE_FROM_LOCKER);
                  setSelectedLocker(locker);
                  onOpen();
                }}
              >
                Remove From Locker
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setCurrentFunction(TokenLockerFunctions.DELETE_LOCKER);
                  setSelectedLocker(locker);
                  onOpen();
                }}
              >
                Delete Locker
              </MenuItem>
            </>
          )}
        </MenuList>
      </Menu>
    );
  };

  return (
    <Container
      maxW="5xl"
      bg={useColorModeValue("gray.100", "gray.900")}
      h="90%"
    >
      <Flex justify="space-between" my="1rem" align="center">
        <Heading as="h3" size="sm" color="white">
          {locker.name}
        </Heading>
        {menuItems()}
      </Flex>
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
        <Fragment>
          <Flex
            w="100%"
            justify="space-between"
            alignItems="center"
            cursor="pointer"
          >
            <Stack spacing={0} direction="row" alignItems="center">
              <Flex p={4}>
                <Avatar
                  size="md"
                  name={locker.name}
                  src={"/logos/pig_logo.png"}
                />
              </Flex>
              <Flex direction="column" p={2}>
                <Text fontSize="sm">DefiDollars</Text>
                <Text fontSize={{ base: "sm", sm: "md" }}>{locker.amount}</Text>
              </Flex>
            </Stack>

            <Flex direction="column" p={2}>
              <Badge
                colorScheme={isLocked ? "red" : "green"}
                variant="outline"
                fontSize={{ base: "xs", sm: "sm" }}
                py={1}
                px={2}
                borderRadius={5}
                mr={5}
              >
                {isLocked ? `${locker.lockTimeRemaining} days ` : "Unlocked"}
              </Badge>
            </Flex>
          </Flex>
          <Divider m={0} />
        </Fragment>
      </VStack>
    </Container>
  );
};

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
} from "@chakra-ui/react";
import { Locker } from "@/data-schema/types";
import { ChevronDownIcon } from "@chakra-ui/icons";

export const TokenLockerCard = ({ locker }: { locker: Locker }) => {
  let mainText = useColorModeValue("gray.800", "white");
  let secondaryText = useColorModeValue("gray.400", "gray.400");

  return (
    <Flex
      borderRadius="20px"
      border="1px solid #E2E8F0"
      h="auto"
      w={{ base: "315px", md: "345px" }}
      alignItems="center"
      direction="column"
    >
      <Image
        src="/images/Vault-Wallpaper.jpeg"
        maxW="100%"
        borderRadius="20px"
        borderBottomRadius={0}
        alt="vault-wallpaper"
      />

      <Flex flexDirection="column" mb="10px">
        <Text
          fontWeight="600"
          color={mainText}
          textAlign="center"
          fontSize="xl"
          mt={3}
        >
          {locker.name}
        </Text>
        <Text
          color={secondaryText}
          textAlign="center"
          fontSize="sm"
          fontWeight="500"
        >
          {`Status: ${
            !locker.lockTimeRemaining
              ? "Unlocked"
              : `${locker.lockTimeRemaining} days remaining`
          }`}
        </Text>
      </Flex>
      <Flex flexDirection="row" align="baseline">
        <Text
          fontWeight="600"
          color={mainText}
          fontSize="5xl"
          textAlign="center"
        >
          {locker.amount}
        </Text>
        <Text color={secondaryText} fontWeight="500" textAlign="center" ml={2}>
          DFD
        </Text>
      </Flex>
      <Flex
        justifyContent="flex-end"
        alignItems="center"
        direction="column"
        w="100%"
        my={5}
      >
        <Menu>
          <MenuButton
            as={Button}
            size="xs"
            colorScheme="blue"
            rightIcon={<ChevronDownIcon />}
          >
            Actions
          </MenuButton>
          <MenuList>
            <MenuItem>Add to Locker</MenuItem>
            <MenuItem>Apply New Lock</MenuItem>
            <MenuItem>Empty Locker</MenuItem>
            <MenuItem>Remove From Locker</MenuItem>
            <MenuItem>Delete Locker</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

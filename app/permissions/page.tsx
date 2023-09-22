"use client";

import {
  Center,
  Flex,
  Box,
  Heading,
  Grid,
  GridItem,
  Avatar,
  Text,
  useColorModeValue,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Switch,
  HStack,
  Badge,
  Icon,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  FormControl,
  FormLabel,
  Select,
  Container,
  VStack,
} from "@chakra-ui/react";
import Navbar from "@/components/Navbar";
import { useWindowSize } from "usehooks-ts";
import { useState } from "react";
import { BiUserCircle, BiText } from "react-icons/bi";
import { AiOutlineMail } from "react-icons/ai";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useAuthStore } from "@/store/auth/authStore";
import shallow from "zustand/shallow";
import { UserPermissions } from "@/data-schema/types";

interface Member {
  userName: string;
  userAvatar: string;
}

const members: Member[] = [
  {
    userName: "Dan Abrahmov",
    userAvatar: "https://bit.ly/dan-abramov",
  },
  {
    userName: "Kent Dodds",
    userAvatar: "https://bit.ly/kent-c-dodds",
  },

  {
    userName: "Jena Karlis",
    userAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=334&q=80",
  },
];

const Permissions = () => {
  const { width } = useWindowSize();

  const [selectedUser, setSelectedUser] = useState<Member | null>(null);
  const isMobileSize = width < 768;

  const generaldata = [
    {
      name: "Avatar",
      description: "This is the main avatar for the users profile.",
      color: "green",
      icon: <Icon as={BiUserCircle} fontSize="25px" verticalAlign="middle" />,
    },
    {
      name: "Email",
      description: "This is the main email for the users profile.",
      color: "green",
      icon: <Icon as={AiOutlineMail} fontSize="25px" verticalAlign="middle" />,
    },
    {
      name: "Username",
      description: "This is the main username for the users profile.",
      color: "red",
      icon: <Icon as={BiText} fontSize="25px" verticalAlign="middle" />,
    },
  ];

  const generalPermissions = () => {
    return generaldata.map((item, index) => (
      <Menu key={index}>
        {({ isOpen }) => (
          <>
            <MenuButton
              isActive={isOpen}
              as={Button}
              colorScheme={item.color}
              w="100%"
            >
              {item.name}
            </MenuButton>
            <MenuList>
              <MenuItem>Enable</MenuItem>
              <MenuItem>Disable</MenuItem>
              <MenuItem>Family Id Required</MenuItem>
            </MenuList>
          </>
        )}
      </Menu>
    ));
  };

  const { userDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
    }),
    shallow
  );

  return (
    <Box height="100vh" bgGradient={["linear(to-b, black,#4F1B7C)"]}>
      <Navbar />
      <Center pt="8rem">
        <Heading size="xl" color="white" m={3}>
          Permissions
        </Heading>
      </Center>

      <Center pb="2rem">
        <Flex align="center">
          <Badge
            px="2"
            borderRadius="full"
            colorScheme="green"
            fontSize="0.8rem"
          >
            Enabled
          </Badge>
          <Badge
            borderRadius="full"
            px="2"
            colorScheme="red"
            fontSize="0.8rem"
            mx={2}
          >
            Disabled
          </Badge>
          <Badge
            borderRadius="full"
            px="2"
            colorScheme="purple"
            fontSize="0.8rem"
          >
            Family Id Required
          </Badge>
        </Flex>
      </Center>
      <VStack>
        <Container size="lg" px="1rem">
          <Flex justify="center" py={4}></Flex>
          <Flex justify="space-between" p={4} bg="gray.800" borderRadius="10px">
            <FormControl>
              <Heading size="md" color="white" pb={3}>
                Users
              </Heading>
              <Select placeholder="Select user">
                {members.map((member, index) => (
                  <option key={index}>{member.userName}</option>
                ))}
              </Select>
            </FormControl>
          </Flex>
          <Box bg="gray.800" mt={5}>
            <Heading size="md" color="white" p={4}>
              General
            </Heading>
            <Flex justify="space-between" px={4} pb={4} bg="gray.800">
              <VStack spacing="24px" w="100%">
                {generalPermissions()}
              </VStack>
            </Flex>
          </Box>
        </Container>
      </VStack>
    </Box>
  );
};

export default Permissions;

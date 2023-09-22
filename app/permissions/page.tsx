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
import { MdArrowDropDown } from "react-icons/md";
import Navbar from "@/components/Navbar";
import { useWindowSize } from "usehooks-ts";
import { useCallback, useEffect, useState } from "react";
import { BiUserCircle, BiText } from "react-icons/bi";
import { AiOutlineMail } from "react-icons/ai";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useAuthStore } from "@/store/auth/authStore";
import shallow from "zustand/shallow";
import { User, UserPermissions } from "@/data-schema/types";
import axios from "axios";
import { ethers } from "ethers";
import { PermissionType } from "@/data-schema/enums";

interface Member {
  userName: string;
  userAvatar: string;
}

const Permissions = () => {
  const { width } = useWindowSize();

  const [members, setMembers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>();
  const isMobileSize = width < 768;

  useEffect(() => {
    const fetchMembers = async () => {
      const familyMembers = [] as User[];
      //@ts-ignore
      for (const memberAddress of userDetails.children) {
        try {
          const response = await axios.get(
            `/api/vercel/get-json?key=${memberAddress}`
          );
          const user = response.data;

          if (ethers.utils.isAddress(user.wallet)) {
            familyMembers.push(user);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
      setMembers(familyMembers);
    };

    fetchMembers();
  }, []);

  const generalUserData = useCallback(() => {
    const data = members.flatMap((member) => {
      const generalPermissions = member.permissions?.general;

      if (generalPermissions) {
        return Object.entries(generalPermissions).map(([feature, status]) => ({
          feature,
          status,
        }));
      }

      return [];
    });

    return data;
  }, [members]);

  const handleColor = (status: string) => {
    switch (status) {
      case PermissionType.ENABLED:
        return "green";
      case PermissionType.DISABLED:
        return "red";
      case PermissionType.FAMILY_ID_REQUIRED:
        return "purple";
      default:
        return "green";
    }
  };

  const togglePermission = async (
    category: string,
    selectedDetails: {
      feature: string;
      status: string;
    },
    updatedStatus: string
  ) => {
    console.log(category, selectedDetails, updatedStatus);
    if (selectedDetails.status === updatedStatus) return;

    const body = {
      ...selectedUser,
      permissions: {
        [category]: {
          ...selectedUser?.permissions?.[category],
          [selectedDetails.feature]: updatedStatus,
        },
      },
    };

    const payload = {
      key: selectedUser?.wallet,
      value: body,
    };

    await axios.post(`/api/vercel/set-json`, payload);
    setMembers((prevMembers) => {
      const updatedMembers = [...prevMembers];
      const userIndex = updatedMembers.findIndex(
        (user) => user.wallet === selectedUser?.wallet
      );
      if (userIndex !== -1) {
        updatedMembers[userIndex] = body;
      }
      return updatedMembers;
    });
  };

  const generalPermissions = () => {
    return generalUserData().map((item, index) => (
      <Menu key={index}>
        {({ isOpen }) => (
          <>
            <MenuButton
              isActive={isOpen}
              as={Button}
              colorScheme={handleColor(item.status)}
              w="100%"
            >
              {item.feature}
            </MenuButton>
            <MenuList>
              <MenuItem
                onClick={() => {
                  togglePermission("general", item, PermissionType.ENABLED);
                }}
              >
                Enable
              </MenuItem>
              <MenuItem
                onClick={() => {
                  togglePermission("general", item, PermissionType.DISABLED);
                }}
              >
                Disable
              </MenuItem>
              <MenuItem
                onClick={() => {
                  togglePermission(
                    "general",
                    item,
                    PermissionType.FAMILY_ID_REQUIRED
                  );
                }}
              >
                Family Id Required
              </MenuItem>
            </MenuList>
          </>
        )}
      </Menu>
    ));
  };

  const { userDetails, setUserDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
      setUserDetails: state.setUserDetails,
    }),
    shallow
  );

  useEffect(() => {
    const fetchMembers = async () => {
      const familyMembers = [] as User[];
      //@ts-ignore
      for (const memberAddress of userDetails.children) {
        try {
          const response = await axios.get(
            `/api/vercel/get-json?key=${memberAddress}`
          );
          const user = response.data;

          if (ethers.utils.isAddress(user.wallet)) {
            familyMembers.push(user);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
      setMembers(familyMembers);
    };

    fetchMembers();
  }, []);

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
              <Select
                placeholder="Select user"
                icon={<MdArrowDropDown />}
                onChange={(e) => {
                  const selectedUsername = e.target.value;
                  const selectedUser = members.find(
                    (member) => member.username === selectedUsername
                  );
                  setSelectedUser(selectedUser);
                }}
              >
                {members.map((member) => (
                  <option key={member.username}>{member.username}</option>
                ))}
              </Select>
            </FormControl>
          </Flex>

          {/* General */}
          {selectedUser && selectedUser.username && (
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
          )}
        </Container>
      </VStack>
    </Box>
  );
};

export default Permissions;

"use client";

import {
  Center,
  Flex,
  Box,
  Heading,
  Badge,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  FormControl,
  Select,
  Container,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { MdArrowDropDown } from "react-icons/md";
import Navbar from "@/components/LandingNavbar";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";
import { User } from "@/data-schema/types";
import { PermissionType, UserType } from "@/data-schema/enums";
import { WalletNotFound } from "@/components/WalletNotFound";
import { Restricted } from "@/components/Restricted";
import { useAccount } from "wagmi";
import { getFamilyMembersByAccount } from "@/BFF/mongo/getFamilyMembersByAccount";
import { editPermissions } from "@/services/mongo/routes/permission";

const Permissions = () => {
  const [members, setMembers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>();

  const { address } = useAccount();
  const toast = useToast();

  const { userDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
    }),
    shallow
  );

  useEffect(() => {
    if (!userDetails?.wallet) return;

    const fetchMembers = async () => {
      const members = (await getFamilyMembersByAccount(
        userDetails.accountId!
      )) as User[];
      console.log(members);
      setMembers(members);
    };

    fetchMembers();
  }, [userDetails?.wallet]);

  const handleColor = (item: string) => {
    const status = selectedUser?.permissions?.find(
      (permission) => permission === item
    );
    if (status) return "green";
    return "red";
  };

  const togglePermission = async (permission: PermissionType) => {
    let userPermissions = selectedUser?.permissions as PermissionType[];
    if (userPermissions?.includes(permission)) {
      userPermissions = userPermissions.filter((p) => p !== permission);
    } else {
      userPermissions?.push(permission);
    }

    setMembers((prevMembers) => {
      const updatedMembers = [...prevMembers];
      const userIndex = updatedMembers.findIndex(
        (user) => user.wallet === selectedUser?.wallet
      );
      if (userIndex !== -1) {
        updatedMembers[userIndex].permissions = userPermissions;
      }
      return updatedMembers;
    });

    toast({
      title: "Success",
      description: `${permission.toLowerCase()} updated`,
      status: "success",
    });

    const { accountId, wallet } = selectedUser as User;
    await editPermissions(accountId!, wallet, userPermissions);
  };

  const generalPermissions = () => {
    return Object.values(PermissionType).map((item, index) => (
      <Button
        key={index}
        w={"100%"}
        colorScheme={handleColor(item)}
        onClick={() => {
          togglePermission(item);
        }}
      >
        {item}
      </Button>
      // <Menu key={index}>
      //   {({ isOpen }) => (
      //     <>
      //       <MenuButton
      //         isActive={isOpen}
      //         as={Button}
      //         colorScheme={handleColor(item)}
      //         w="100%"
      //       >
      //         {item}
      //       </MenuButton>
      //       <MenuList>
      //         <MenuItem
      //           onClick={() => {
      //             togglePermission(item);
      //           }}
      //         >
      //           Enable
      //         </MenuItem>
      //         <MenuItem
      //           onClick={() => {
      //             togglePermission(item);
      //           }}
      //         >
      //           Disable
      //         </MenuItem>
      //       </MenuList>
      //     </>
      //   )}
      // </Menu>
    ));
  };

  if (!address) {
    return <WalletNotFound />;
  }

  if (!userDetails?.wallet && !userDetails.username) {
    return <></>;
  }

  if (userDetails?.wallet && userDetails.userType !== UserType.PARENT) {
    return <Restricted />;
  }

  return (
    <Box height="100vh" bgGradient={["linear(to-b, black,#4F1B7C)"]}>
      <Navbar />
      <Center pt="8rem">
        <Heading size="xl" color="white" m={3}>
          Permissions
        </Heading>
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

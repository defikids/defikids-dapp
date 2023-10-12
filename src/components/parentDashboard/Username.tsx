"use client";

import { Avatar, Flex, Heading, Text } from "@chakra-ui/react";
import { useAuthStore } from "@/store/auth/authStore";
import shallow from "zustand/shallow";

const Username = () => {
  const { userDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
      setUserDetails: state.setUserDetails,
    }),
    shallow
  );
  return (
    <Flex align="center" mt={2 || 0} ml={4}>
      <Avatar
        size="md"
        name={userDetails.username}
        sx={{
          fontFamily: "Slackey",
          bgColor: "purple.500",
        }}
      />
      <Flex direction="column" ml={2}>
        <Heading fontSize="lg" display="flex">
          {userDetails.username}
        </Heading>
        <Text fontSize="md">{userDetails.userType}</Text>
      </Flex>
    </Flex>
  );
};

export default Username;

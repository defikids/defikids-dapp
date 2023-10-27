"use client";

import { Avatar, Flex } from "@chakra-ui/react";
import { User } from "@/data-schema/types";
import { useAuthStore } from "@/store/auth/authStore";
import shallow from "zustand/shallow";

const DashboardAvatar = () => {
  const { userDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
    }),
    shallow
  );
  return (
    <Flex align="center" mt="4rem" justify="center" ml={4}>
      <Avatar
        size="2xl"
        name={userDetails?.avatarURI}
        sx={{
          bgColor: `${!userDetails?.avatarURI && "purple.500"}`,
        }}
        src={userDetails?.avatarURI || "/images/placeholder-avatar.jpeg"}
      />
    </Flex>
  );
};

export default DashboardAvatar;

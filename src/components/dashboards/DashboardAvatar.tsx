"use client";

import { Avatar, Flex } from "@chakra-ui/react";
import { User } from "@/data-schema/types";

const DashboardAvatar = ({ user }: { user: User }) => {
  return (
    <Flex align="center" mt="4rem" justify="center" ml={4}>
      <Avatar
        size="2xl"
        name={user?.avatarURI}
        sx={{
          bgColor: `${!user?.avatarURI && "purple.500"}`,
        }}
        src={user?.avatarURI || "/images/placeholder-avatar.jpeg"}
      />
    </Flex>
  );
};

export default DashboardAvatar;

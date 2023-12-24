"use client";

import { User } from "@/data-schema/types";
import { Avatar, Flex, Heading, Text } from "@chakra-ui/react";

const Username = ({ user }: { user: User }) => {
  return (
    <Flex align="center" mt={2 || 0} ml={4}>
      <Avatar
        size="md"
        name={user?.username}
        sx={{
          fontFamily: "Slackey",
          bgColor: "purple.500",
        }}
      />
      <Flex direction="column" ml={2}>
        <Heading fontSize="lg" display="flex">
          {user?.username}
        </Heading>
        <Text fontSize="md">{user?.userType}</Text>
      </Flex>
    </Flex>
  );
};

export default Username;

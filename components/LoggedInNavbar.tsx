import React, { useState } from "react";
import { Box, Flex, Heading, Avatar, Text } from "@chakra-ui/react";
import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";

export default function LoggedInNavBar() {
  //=============================================================================
  //                               HOOKS
  //============================================================================

  const { userDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
    }),
    shallow
  );

  //=============================================================================
  //                             STATE
  //=============================================================================

  //=============================================================================
  //                             FUNCTIONS
  //=============================================================================

  return (
    <>
      <Box
        zIndex={5}
        bgGradient={["linear(to-b, black,#4F1B7C)"]}
        position="fixed"
        left={0}
        right={0}
        p={2}
      >
        <Flex
          h={16}
          alignItems={"center"}
          justifyContent={"space-between"}
          mx={2}
        >
          <Flex direction="column" ml={3}>
            <Heading fontSize="lg">{userDetails?.username}</Heading>
            <Text fontSize="md">{userDetails?.userType}</Text>
          </Flex>

          <Avatar
            size="md"
            name={userDetails?.username}
            src={
              userDetails?.avatarURI
                ? userDetails?.avatarURI
                : "/images/placeholder-avatar.png"
            }
          />
        </Flex>
      </Box>
    </>
  );
}

"use client";

import React, { useState } from "react";
import { Box, Flex, Heading, Avatar, Text, Slide } from "@chakra-ui/react";
import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";
import { useWindowSize } from "usehooks-ts";

export default function LoggedInNavBar() {
  //=============================================================================
  //                               HOOKS
  //============================================================================

  const { userDetails, mobileMenuOpen, setMobileMenuOpen } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
      mobileMenuOpen: state.mobileMenuOpen,
      setMobileMenuOpen: state.setMobileMenuOpen,
    }),
    shallow
  );

  const { width, height } = useWindowSize();

  const isMobileSize = width < 768;

  //=============================================================================
  //                             STATE
  //=============================================================================

  //=============================================================================
  //                             FUNCTIONS
  //=============================================================================
  if (mobileMenuOpen || !isMobileSize) return null;
  return (
    <Slide in={!mobileMenuOpen} direction={"top"}>
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
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
            }}
          />
        </Flex>
      </Box>
    </Slide>
  );
}

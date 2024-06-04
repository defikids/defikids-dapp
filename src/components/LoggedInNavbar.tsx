"use client";

import { Box, Flex, Heading, Avatar, Text, Slide } from "@chakra-ui/react";
import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";
import { useWindowSize } from "usehooks-ts";
import { useEffect, useState } from "react";
import { getUserByWalletAddress } from "@/services/mongo/routes/user";
import { getSignerAddress } from "@/blockchain/utils";
import { User } from "@/data-schema/types";

export default function LoggedInNavBar() {
  const [user, setUser] = useState({} as User);

  const { mobileMenuOpen, setMobileMenuOpen } = useAuthStore(
    (state) => ({
      mobileMenuOpen: state.mobileMenuOpen,
      setMobileMenuOpen: state.setMobileMenuOpen,
    }),
    shallow
  );

  useEffect(() => {
    const init = async () => {
      // Get the user details
      const user = await getUserByWalletAddress(await getSignerAddress());
      setUser(user);
    };
    init();
  }, []);

  const { width } = useWindowSize();
  const isMobileSize = width < 768;

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
            <Heading fontSize="lg">{user?.username}</Heading>
            <Text fontSize="md">{user?.userType}</Text>
          </Flex>

          <Avatar
            size="md"
            name={user?.username}
            src={
              user?.avatarURI
                ? user?.avatarURI
                : "/images/placeholder-avatar.jpeg"
            }
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            cursor="pointer"
          />
        </Flex>
      </Box>
    </Slide>
  );
}

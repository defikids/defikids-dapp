"use client";

import { Avatar, Flex, Heading, Slide, Text } from "@chakra-ui/react";
import { useAuthStore } from "@/store/auth/authStore";
import shallow from "zustand/shallow";

export const CollapsedDashboardMenu = ({
  onToggleCollapsedMenu,
  onToggleExtendedMenu,
  isOpenCollapsedMenu,
  isMobileSize,
}: {
  onToggleCollapsedMenu: () => void;
  onToggleExtendedMenu: () => void;
  isOpenCollapsedMenu: boolean;
  isMobileSize: boolean;
}) => {
  const { userDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
    }),
    shallow
  );
  return (
    <Slide
      in={isOpenCollapsedMenu}
      direction="left"
      style={{
        width: "auto",
        height: "12vh",
        position: "absolute",
      }}
    >
      <Flex
        bgGradient={["linear(to-b, #4F1B7C, black)"]}
        ml="1rem"
        mt={5}
        p={5}
        borderRadius="1.5rem"
        justify="space-between"
        align="center"
        cursor={isOpenCollapsedMenu ? "pointer" : "default"}
        _hover={{ transform: `${isMobileSize && "scale(1.1)"}` }}
        onClick={() => {
          if (isMobileSize) {
            console.log("mobile size");
            return;
          }
          onToggleCollapsedMenu();
          setTimeout(() => {
            onToggleExtendedMenu();
          }, 500);
        }}
      >
        <Flex align="center">
          <Avatar
            size="lg"
            name={userDetails?.username}
            sx={{
              fontFamily: "Slackey",
              bgColor: `${
                userDetails?.avatarURI ? "transparent" : "purple.500"
              }`,
            }}
            src={userDetails?.avatarURI || "/images/placeholder-avatar.jpeg"}
          />
          <Flex direction="column" ml={3}>
            <Heading fontSize="lg">{userDetails?.username}</Heading>
            <Text fontSize="md">{userDetails?.userType}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Slide>
  );
};

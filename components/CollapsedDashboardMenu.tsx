import { Avatar, Flex, Heading, Slide, Text } from "@chakra-ui/react";
import { useAuthStore } from "@/store/auth/authStore";
import shallow from "zustand/shallow";

export const CollapsedDashboardMenu = ({
  onToggleCollapsedMenu,
  onToggleExtendedMenu,
  isOpenCollapsedMenu,
}: {
  onToggleCollapsedMenu: () => void;
  onToggleExtendedMenu: () => void;
  isOpenCollapsedMenu: boolean;
}) => {
  const { userDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
    }),
    shallow
  );
  return (
    <Slide in={isOpenCollapsedMenu} direction="left">
      <Flex
        position={!isOpenCollapsedMenu ? "fixed" : "absolute"}
        bgGradient={["linear(to-b, #4F1B7C, black)"]}
        width="auto"
        height="12vh"
        ml="1rem"
        mt={5}
        pr={5}
        borderRadius="1.5rem"
        justify="space-between"
        align="center"
        cursor={isOpenCollapsedMenu ? "pointer" : "default"}
        _hover={{ transform: "scale(1.1)" }}
        onClick={() => {
          onToggleCollapsedMenu();
          setTimeout(() => {
            onToggleExtendedMenu();
          }, 500);
        }}
      >
        <Flex align="center" ml={4}>
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

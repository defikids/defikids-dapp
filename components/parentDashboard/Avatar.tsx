import { Avatar, Flex, Tooltip } from "@chakra-ui/react";
import { User } from "@/data-schema/types";
import { useAuthStore } from "@/store/auth/authStore";
import shallow from "zustand/shallow";

const ParentAvatar = ({ familyDetails }: { familyDetails: User }) => {
  const { userDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
    }),
    shallow
  );
  return (
    <Flex align="center" mt="4rem" justify="center" ml={4}>
      <Tooltip label="Edit" aria-label="Edit">
        <Avatar
          size="2xl"
          name={userDetails?.avatarURI}
          sx={{
            bgColor: `${!userDetails?.avatarURI && "purple.500"}`,
          }}
          _hover={{ cursor: "pointer", transform: "scale(1.1)" }}
          src={userDetails?.avatarURI || "/images/placeholder-avatar.jpeg"}
        />
      </Tooltip>
    </Flex>
  );
};

export default ParentAvatar;

import { Avatar, Flex, Tooltip } from "@chakra-ui/react";
import { User } from "@/dataSchema/types";

const ParentAvatar = ({ familyDetails }: { familyDetails: User }) => {
  return (
    <Flex align="center" mt="4rem" justify="center" ml={4}>
      <Tooltip label="Edit" aria-label="Edit">
        <Avatar
          size="2xl"
          name={familyDetails?.avatarURI}
          sx={{
            bgColor: `${!familyDetails?.avatarURI && "purple.500"}`,
          }}
          _hover={{ cursor: "pointer", transform: "scale(1.1)" }}
          src={familyDetails?.avatarURI || "/images/placeholder-avatar.jpeg"}
        />
      </Tooltip>
    </Flex>
  );
};

export default ParentAvatar;

import { Avatar, Flex, Heading, Text } from "@chakra-ui/react";
import { User } from "@/dataSchema/types";

const Username = ({ familyDetails }: { familyDetails: User }) => {
  return (
    <Flex align="center" mt="2rem" ml={4}>
      <Avatar
        size="md"
        name={familyDetails.username}
        sx={{
          fontFamily: "Slackey",
          bgColor: "purple.500",
        }}
      />
      <Flex direction="column" ml={2}>
        <Heading fontSize="lg">{familyDetails.username}</Heading>
        <Text fontSize="md">{familyDetails.userType}</Text>
      </Flex>
    </Flex>
  );
};

export default Username;

import { Avatar, Flex, Heading, Text } from "@chakra-ui/react";
import { User } from "@/data-schema/types";

const Username = ({
  familyDetails,
  mt,
}: {
  familyDetails: User;
  mt?: number;
}) => {
  return (
    <Flex align="center" mt={mt || 0} ml={4}>
      <Avatar
        size="md"
        name={familyDetails.username}
        sx={{
          fontFamily: "Slackey",
          bgColor: "purple.500",
        }}
      />
      <Flex direction="column" ml={2}>
        <Heading fontSize="lg" display="flex">
          {familyDetails.username}
        </Heading>
        <Text fontSize="md">{familyDetails.userType}</Text>
      </Flex>
    </Flex>
  );
};

export default Username;

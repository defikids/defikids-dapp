import React from "react";
import { Box, Flex, Heading, Text, Image } from "@chakra-ui/react";

export const Section = ({ title, description, imageSrc }) => {
  return (
    <Box p={4} boxShadow="lg" borderRadius="md" bg="white">
      <Image src={imageSrc} alt={title} boxSize="200px" mx="auto" mb={4} />
      <Heading as="h2" fontSize="xl" mb={4}>
        {title}
      </Heading>
      <Text>{description}</Text>
    </Box>
  );
};

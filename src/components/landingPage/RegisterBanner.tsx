"use client";

import { Badge, Flex, Text } from "@chakra-ui/react";

export const RegisterBanner = ({
  onRegisterOpen,
}: {
  onRegisterOpen: () => void;
}) => {
  return (
    <Flex
      position="fixed"
      top="0"
      left="0"
      width="100%"
      zIndex="100"
      bgGradient="linear(to-r, #7928CA, #FF0080)"
      justify="center"
      alignItems="center"
      py={2}
    >
      <Text>Start earning rewards!</Text>
      <Badge
        variant="outline"
        colorScheme="twitter"
        fontSize="md"
        fontWeight="bold"
        onClick={onRegisterOpen}
        style={{
          cursor: "pointer",
          backgroundColor: "none",
          marginLeft: "10px",
        }}
      >
        Register
      </Badge>
    </Flex>
  );
};

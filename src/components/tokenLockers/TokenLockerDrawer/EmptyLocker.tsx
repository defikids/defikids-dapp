import { Heading, VStack, Text, Box, Button } from "@chakra-ui/react";

export const EmptyLocker = ({ selectedLocker }: { selectedLocker: any }) => {
  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Heading fontSize={"xl"} mb={1}>
          Emptying A Locker
        </Heading>
        <Text fontSize={"md"} mb={1}>
          By creating a locker, you will be able to lock your tokens for a
          period of time.
        </Text>

        <Text fontSize={"md"} mb={1}>
          You will by require to permit the Defikids core contract to transfer
          your token on your behalf.
        </Text>
      </VStack>
      <Button mt={4} colorScheme="blue" onClick={() => {}}>
        Continue
      </Button>
    </Box>
  );
};

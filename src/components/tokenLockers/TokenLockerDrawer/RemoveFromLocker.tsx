import {
  Heading,
  VStack,
  Text,
  Box,
  FormControl,
  Input,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";

export const RemoveFromLocker = () => {
  const [amountToRemove, setAmountToRemove] = useState("");

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Heading fontSize={"xl"} mb={1}>
          Removing From A Locker
        </Heading>
        <Text fontSize={"md"} mb={1}>
          By creating a locker, you will be able to lock your tokens for a
          period of time.
        </Text>

        <Text fontSize={"md"} mb={1}>
          You will by require to permit the Defikids core contract to transfer
          your token on your behalf.
        </Text>

        <FormControl>
          <Input
            placeholder="Amount to remove"
            value={amountToRemove}
            onChange={(e) => setAmountToRemove(e.target.value)}
            style={{
              border: "1px solid lightgray",
            }}
            sx={{
              "::placeholder": {
                color: "gray.400",
              },
            }}
          />
        </FormControl>
      </VStack>
      <Button mt={4} colorScheme="blue" onClick={() => {}}>
        Continue
      </Button>
    </Box>
  );
};

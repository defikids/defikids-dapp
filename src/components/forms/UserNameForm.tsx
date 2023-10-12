"use client";

import { useAuthStore } from "@/store/auth/authStore";
import {
  Flex,
  useToast,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import shallow from "zustand/shallow";
import { transactionErrors } from "@/utils/errorHanding";
import { editUser } from "@/services/mongo/routes/user";

export const EditUsername = () => {
  const [username, setUsername] = useState("");

  const { userDetails, setUserDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
      setUserDetails: state.setUserDetails,
    }),
    shallow
  );

  const toast = useToast();

  const handleSubmit = async () => {
    try {
      if (!username) {
        toast({
          title: "Error",
          description: "Username cannot be empty",
          status: "error",
        });
        return;
      }

      const payload = {
        ...userDetails,
        username,
      };

      await editUser(userDetails.accountId!, payload);
      setUserDetails(payload);
      setUsername("");

      toast({
        title: "Username successfully updated",
        status: "success",
      });
    } catch (e) {
      const errorDetails = transactionErrors(e);
      toast(errorDetails);
    }
  };

  return (
    <>
      <Flex
        direction="column"
        justify="center"
        align="center"
        borderRadius={10}
      >
        <FormControl>
          <FormLabel>New Username</FormLabel>
          <Input
            placeholder={userDetails?.username || ""}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              border: "1px solid #809193",
            }}
            sx={{
              "::placeholder": {
                color: "gray.600",
              },
            }}
          />
        </FormControl>
        <Button
          colorScheme="blue"
          variant="solid"
          size={"sm"}
          onClick={handleSubmit}
          mt={4}
        >
          Submit
        </Button>
      </Flex>
    </>
  );
};

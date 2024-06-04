"use client";

import {
  Flex,
  useToast,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { transactionErrors } from "@/utils/errorHanding";
import { editUser } from "@/services/mongo/routes/user";
import { User } from "@/data-schema/types";

export const EditUsername = ({
  user,
  setUser,
}: {
  user: User;
  setUser: (user: User) => void;
}) => {
  const [username, setUsername] = useState("");

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
        ...user,
        username,
      };

      await editUser(user.accountId!, payload);
      setUser(payload);
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
            placeholder={user?.username}
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

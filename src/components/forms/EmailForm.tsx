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
import axios from "axios";
import { User } from "@/data-schema/types";

export const EditEmail = ({
  user,
  setUser,
}: {
  user: User;
  setUser: (user: User) => void;
}) => {
  const [email, setEmail] = useState("");

  const toast = useToast();

  const handleSubmit = async () => {
    try {
      if (!email) {
        toast({
          title: "Error",
          description: "Email cannot be empty",
          status: "error",
        });
        return;
      }

      const payload = {
        ...user,
        email,
        emailVerified: false,
      };

      await editUser(user.accountId!, payload);
      setUser(payload);
      setEmail("");

      const { username, wallet } = user;
      const emailPayload = {
        username,
        email,
        walletAddress: wallet,
      };

      await axios.post(`/api/emails/confirm-email-address`, emailPayload);

      toast({
        title: "Email successfully updated",
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
          <FormLabel>Edit email</FormLabel>
          <Input
            placeholder={user?.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <Button colorScheme="blue" size={"sm"} onClick={handleSubmit} mt={4}>
          Submit
        </Button>
      </Flex>
    </>
  );
};

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
import { shallow } from "zustand/shallow";
import { transactionErrors } from "@/utils/errorHanding";
import { editUser } from "@/services/mongo/routes/user";
import axios from "axios";

export const EditEmail = () => {
  const [email, setEmail] = useState("");

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
      if (!email) {
        toast({
          title: "Error",
          description: "Email cannot be empty",
          status: "error",
        });
        return;
      }

      const payload = {
        ...userDetails,
        email,
        emailVerified: false,
      };

      await editUser(userDetails.accountId!, payload);
      setUserDetails(payload);
      setEmail("");

      const { username, wallet } = userDetails;
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
            placeholder={userDetails?.email}
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

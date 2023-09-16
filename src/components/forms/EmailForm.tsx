"use client";

import { User } from "@/data-schema/types";
import { useAuthStore } from "@/store/auth/authStore";
import {
  Flex,
  useToast,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import shallow from "zustand/shallow";
import { transactionErrors } from "@/utils/errorHanding";

export const EditEmail = ({
  familyDetails,
  fetchFamilyDetails,
}: {
  familyDetails: User;
  fetchFamilyDetails: () => void;
}) => {
  //=============================================================================
  //                               STATE
  //=============================================================================
  const [email, setEmail] = useState("");

  //=============================================================================
  //                               HOOKS
  //=============================================================================

  const { userDetails, setUserDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
      setUserDetails: state.setUserDetails,
    }),
    shallow
  );

  const toast = useToast();

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================

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

      const body = {
        ...familyDetails,
        email,
        emailVerified: false,
      };

      const payload = {
        key: userDetails?.wallet,
        value: body,
      };

      await axios.post(`/api/vercel/set-json`, payload);
      setUserDetails(body);
      fetchFamilyDetails();
      setEmail("");

      toast({
        title: "Email successfully updated",
        status: "success",
      });
    } catch (e) {
      const errorDetails = transactionErrors(e);
      toast(errorDetails);
    }
  };

  console;

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
            placeholder={familyDetails?.email}
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

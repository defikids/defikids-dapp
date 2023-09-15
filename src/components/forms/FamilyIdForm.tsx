"use client";

import { User } from "@/data-schema/types";
import { useAuthStore } from "@/store/auth/authStore";
import {
  Flex,
  useToast,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import shallow from "zustand/shallow";
import { transactionErrors } from "@/utils/errorHanding";
import { ethers } from "ethers";

export const EditFamilyId = ({
  familyDetails,
  fetchFamilyDetails,
}: {
  familyDetails: User;
  fetchFamilyDetails: () => void;
}) => {
  //=============================================================================
  //                               STATE
  //=============================================================================
  const [familyId, setFamilyId] = useState("");

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
      if (!familyId) {
        toast({
          title: "Error",
          description: "Family Id cannot be empty",
          status: "error",
        });
        return;
      }

      const hashedFamilyId = ethers.utils.keccak256(familyId);

      const body = {
        ...familyDetails,
        familyId: hashedFamilyId,
      };

      const payload = {
        key: userDetails?.wallet,
        value: body,
      };

      await axios.post(`/api/vercel/set-json`, payload);
      setUserDetails(body);
      fetchFamilyDetails();
      setFamilyId("");

      toast({
        title: "Family Id successfully updated",
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
          <FormLabel>New Family Id</FormLabel>
          <Input
            type="password"
            value={familyId}
            onChange={(e) => setFamilyId(e.target.value)}
            style={{
              border: "1px solid lightgray",
            }}
          />
        </FormControl>
        <Button
          variant="outline"
          colorScheme="blue"
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

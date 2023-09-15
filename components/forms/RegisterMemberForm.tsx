"use client";

import React, { useState } from "react";
import {
  Box,
  FormControl,
  Input,
  Button,
  FormErrorMessage,
  useToast,
  Flex,
  Switch,
  FormLabel,
} from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import axios from "axios";
import { transactionErrors } from "@/utils/errorHanding";
import { Explaination, UserType } from "@/data-schema/enums";
import { useAuthStore } from "@/store/auth/authStore";
import shallow from "zustand/shallow";
import { ExplainSandbox } from "@/components/explainations/Sandbox";
import { User } from "@/data-schema/types";

export const RegisterMemberForm = ({ onClose }: { onClose: () => void }) => {
  //=============================================================================
  //                             STATE
  //=============================================================================

  const [emailAddress, setEmailAddress] = useState("");
  const [sandboxMode, setSandboxMode] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const isEmailAddressError = emailAddress === "";

  const [showExplanation, setShowExplanation] = useState(false);
  const [explaination, setExplaination] = useState(Explaination.NONE);

  //=============================================================================
  //                             HOOKS
  //=============================================================================

  const toast = useToast();

  const { userDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
    }),
    shallow
  );

  //=============================================================================
  //                             FUNCTIONS
  //=============================================================================
  const storeInvitation = async (email: string) => {
    try {
      let response = await axios.get(
        `/api/vercel/get-json?key=${userDetails.wallet}`
      );

      const user = response.data as User;

      if (user.invitations && !user.invitations.includes(email)) {
        const body = {
          ...user,
          invitations: [...user.invitations, email],
        };

        const payload = {
          key: user.wallet,
          value: body,
        };

        await axios.post(`/api/vercel/set-json`, payload);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendEmailInvite = async () => {
    const { wallet, familyName, familyId } = userDetails;
    try {
      const payload = {
        email: emailAddress,
        parentAddress: wallet,
        familyName: familyName,
        sandboxMode,
        familyId,
      };

      await axios.post(`/api/emails/invite-member`, payload);
      await storeInvitation(emailAddress);

      toast({
        title: "Member Invite Email Sent",
        status: "success",
      });

      return true;
    } catch (e) {
      const errorDetails = transactionErrors(e);
      toast(errorDetails);
    }
  };

  const handleSubmit = async () => {
    setHasSubmitted(true);

    if (isEmailAddressError) {
      return;
    }

    try {
      const emailSent = await sendEmailInvite();

      if (!emailSent) {
        toast({
          title: "Error",
          description: "An error occured while sending the invite.",
          status: "error",
        });
        return;
      }

      onClose();
    } catch (e) {
      console.log(e);
      onClose();
    }
  };

  if (showExplanation) {
    return (
      <ExplainSandbox
        explaination={explaination}
        setShowExplanation={setShowExplanation}
      />
    );
  }

  return (
    <Box textAlign="left" px={3}>
      <form>
        {/* Email Address */}
        <FormControl isInvalid={isEmailAddressError && hasSubmitted} my={4}>
          <Input
            type="text"
            color="black"
            placeholder="Email Address"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            borderColor={
              isEmailAddressError && hasSubmitted ? "red.500" : "black"
            }
            _hover={{
              borderColor: "gray.300",
            }}
            _focus={{
              borderColor: "blue.500",
            }}
            sx={{
              "::placeholder": {
                color: "gray.400",
              },
            }}
          />
          {isEmailAddressError && hasSubmitted && (
            <FormErrorMessage color="red.500">
              Email address is required.
            </FormErrorMessage>
          )}
        </FormControl>

        <Flex
          direction="row"
          justify="space-between"
          my={4}
          alignItems="center"
        >
          <Flex pr={2} alignItems="center">
            <QuestionOutlineIcon
              mr={2}
              cursor="pointer"
              onClick={() => {
                setExplaination(Explaination.SANDBOX);
                setShowExplanation(true);
              }}
            />
            <FormLabel mt="7px">
              {`Sandbox mode ${sandboxMode ? "enabled" : "disabled"}`}
            </FormLabel>
          </Flex>
          <Switch
            isChecked={sandboxMode}
            colorScheme="blue"
            variant="outline"
            size="lg"
            onChange={(e) => setSandboxMode(e.target.checked)}
          />
        </Flex>

        <Button
          variant="solid"
          colorScheme="blue"
          onClick={handleSubmit}
          w="100%"
          _hover={{
            bgColor: "blue.600",
          }}
        >
          Invite
        </Button>
      </form>
    </Box>
  );
};

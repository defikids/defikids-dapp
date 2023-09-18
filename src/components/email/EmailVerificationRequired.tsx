"use client";

import { User } from "@/data-schema/types";
import { Button, Flex, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

export const EmailVerificationRequired = ({
  userDetails,
}: {
  userDetails: User | User;
}) => {
  const [emailSent, setEmailSent] = useState(false);
  const toast = useToast();

  const resendEmail = async () => {
    try {
      const { username, email, wallet } = userDetails;
      const payload = {
        username,
        email,
        walletAddress: wallet,
      };

      const { data } = await axios.post(
        `/api/emails/confirm-email-address`,
        payload
      );

      if (!data.error) {
        setEmailSent(true);
      } else {
        toast({
          title: "Error",
          description: `Error sending email confirmation request to ${userDetails?.email}.`,
          status: "error",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (emailSent) {
    return (
      <Flex direction="column">
        <Text mb={3}>{`Email Sent to ${userDetails?.email}.`}</Text>
        <Text mb={3}>{`If you don't see it, check your spam folder.`}</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column">
      <Text mb={5}>
        In order to add members to your family you will first have to verify
        your email address.
      </Text>
      <Text mb={5}>Check your inbox for an email from us.</Text>
      <Button colorScheme="blue" onClick={resendEmail}>
        Resend Email
      </Button>
    </Flex>
  );
};

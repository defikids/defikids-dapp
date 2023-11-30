"use client";

import { User } from "@/data-schema/types";
import { Button, Flex, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

export const EmailVerificationRequired = ({
  user,
  isUpdated,
}: {
  user: User;
  isUpdated: boolean;
}) => {
  console.log("user", user);
  const [emailSent, setEmailSent] = useState(false);
  const toast = useToast();

  const resendEmail = async () => {
    try {
      const { username, email, wallet } = user;
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
          description: `Error sending email confirmation request to ${user?.email}.`,
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
        <Text mb={3}>{`Email Sent to ${user?.email}.`}</Text>
        <Text
          mb={3}
        >{`Note: If you don't see it, check your spam folder.`}</Text>
      </Flex>
    );
  }

  if (isUpdated) {
    return (
      <Flex direction="column">
        <Text mb={3}>{`Your email has been updated to ${user?.email}.`}</Text>
        <Text
          mb={3}
        >{`You will first have to verify your email address.`}</Text>
        <Text mb={3}>{`Check your inbox for an email from us.`}</Text>
        <Button colorScheme="blue" onClick={resendEmail}>
          Resend Email
        </Button>
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

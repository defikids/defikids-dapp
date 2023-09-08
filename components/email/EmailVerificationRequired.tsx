import { ChildDetails, User } from "@/dataSchema/types";
import { Button, Flex, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

export const EmailVerificationRequired = ({
  userDetails,
}: {
  userDetails: User | ChildDetails;
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
        <Text mb={3}>Email Sent.</Text>
        <Text mb={3}>{`If you don't see it, check your spam folder.`}</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column">
      <Text mb={3}>
        Please verify your email address before continuing. Check your inbox for
        an email from us.
      </Text>
      <Button colorScheme="blue" onClick={resendEmail}>
        Resend Email
      </Button>
    </Flex>
  );
};

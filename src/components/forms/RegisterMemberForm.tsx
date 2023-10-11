"use client";

import React, { useState } from "react";
import {
  Box,
  FormControl,
  Input,
  Button,
  FormErrorMessage,
  Flex,
  Switch,
  FormLabel,
  Divider,
} from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { Explaination } from "@/data-schema/enums";
import { ExplainSandbox } from "@/components/explainations/Sandbox";

export const RegisterMemberForm = ({
  setShowRegisterMemberForm,
  hasSubmitted,
  handleSubmit,
  emailAddress,
  setEmailAddress,
  sandboxMode,
  setSandboxMode,
}: {
  setShowRegisterMemberForm: (show: boolean) => void;
  hasSubmitted: boolean;
  handleSubmit: () => void;
  emailAddress: string;
  setEmailAddress: (emailAddress: string) => void;
  sandboxMode: boolean;
  setSandboxMode: (sandboxMode: boolean) => void;
}) => {
  const isEmailAddressError = emailAddress === "";

  const [showExplanation, setShowExplanation] = useState(false);
  const [explaination, setExplaination] = useState(Explaination.NONE);

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
          onClick={() => {
            if (isEmailAddressError) {
              return;
            }
            handleSubmit();
            setShowRegisterMemberForm(false);
          }}
          w="100%"
          _hover={{
            bgColor: "blue.600",
          }}
        >
          Invite
        </Button>
      </form>
      <Divider
        mt={4}
        sx={{
          "::before": {
            content: '" "',
            display: "block",
            width: "100%",
            height: "1px",
            backgroundColor: "gray.300",
          },
        }}
      />
    </Box>
  );
};

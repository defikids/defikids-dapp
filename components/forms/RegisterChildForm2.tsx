import React, { useState } from "react";
import {
  Box,
  FormControl,
  Input,
  Button,
  FormErrorMessage,
  useToast,
  Flex,
  Text,
  Switch,
  Link,
  FormLabel,
} from "@chakra-ui/react";
import axios from "axios";
import { transactionErrors } from "@/utils/errorHanding";
import { User, AccountDetails, ChildDetails } from "@/dataSchema/types";
import NextLink from "next/link";
import {
  UserType,
  AccountPackage,
  Explaination,
  AccountStatus,
} from "@/dataSchema/enums";
import { hashedFamilyId } from "@/utils/web3";
import { v4 as uuidv4 } from "uuid";
import { timestampInSeconds } from "@/utils/dateTime";
import { useAuthStore } from "@/store/auth/authStore";
import shallow from "zustand/shallow";
import router from "next/router";
import { ExplainSandbox } from "@/components/explainations/Sandbox";

export const RegisterChildForm = ({ onClose }: { onClose: () => void }) => {
  //=============================================================================
  //                             STATE
  //=============================================================================

  const [username, setUsername] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [sandboxMode, setSandboxMode] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const isNameError = username === "";
  const isWalletAddressError = walletAddress === "";
  const isEmailAddressError = emailAddress === "";

  const [showExplanation, setShowExplanation] = useState(false);
  const [explaination, setExplaination] = useState(Explaination.NONE);

  //=============================================================================
  //                             HOOKS
  //=============================================================================

  const toast = useToast();

  const { userDetails, setUserDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
      setUserDetails: state.setUserDetails,
    }),
    shallow
  );

  //=============================================================================
  //                             FUNCTIONS
  //=============================================================================

  const handleSubmit = async () => {
    setHasSubmitted(true);

    if (isWalletAddressError || isEmailAddressError || isNameError) {
      return;
    }

    try {
      // const body = {
      //   familyId: userDetails?.familyId || "",
      //   email: emailAddress,
      //   wallet: walletAddress,
      //   avatarURI: "",
      //   backgroundURI: "",
      //   opacity: {
      //     background: 1,
      //     card: 1,
      //   },
      //   username,
      //   userType: UserType.CHILD,
      // } as ChildDetails;

      // const payload = {
      //   key: walletAddress,
      //   value: body,
      // };

      // console.log("payload", payload);

      const { email, firstName, lastName, familyId } = req.body;

      const payload = {
        email,
        firstName: "",
        lastName: "",
        familyId: hashedFamilyId(familyId),
      };

      await axios.post(`/api/emails/invite-member`, payload);
      // await axios.post(`/api/vercel/set-json`, payload);

      // setUserDetails(body);

      toast({
        title: "Member Invite Sent",
        description: "The member must accept the invite to join the family.",
        status: "success",
      });

      onClose();
      // router.push("/parent");
    } catch (e) {
      const errorDetails = transactionErrors(e);
      toast(errorDetails);
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
        {/* Name and avatar */}
        <Flex direction="row" align="center" mt={5}>
          {/* Name */}
          <FormControl isInvalid={isNameError && hasSubmitted}>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              borderColor={isNameError && hasSubmitted ? "red.500" : "black"}
              _hover={{
                borderColor: "gray.300",
              }}
              _focus={{
                borderColor: "blue.500",
              }}
              sx={{
                "::placeholder": {
                  color: "gray.400", // Set the placeholder text color to gray
                },
              }}
            />
            {isNameError && hasSubmitted && (
              <FormErrorMessage color="red.500">
                Name is required
              </FormErrorMessage>
            )}
          </FormControl>
        </Flex>

        {/* Wallet Address */}
        <FormControl isInvalid={isWalletAddressError && hasSubmitted} mt={5}>
          <Input
            type="text"
            color="black"
            placeholder="Wallet Address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            borderColor={
              isWalletAddressError && hasSubmitted ? "red.500" : "black"
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
          {isWalletAddressError && hasSubmitted && (
            <FormErrorMessage color="red.500">
              Wallet address is required.
            </FormErrorMessage>
          )}
        </FormControl>

        {/* Email Address */}
        <FormControl isInvalid={isEmailAddressError && hasSubmitted} mt={5}>
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

        {/* Sandbox mode toggle switch */}
        <Flex direction="row" justify="flex-end" align="center" mt={5}>
          <Text fontSize="xs" ml={3}>
            <Link
              as={NextLink}
              color="blue.500"
              href="#"
              onClick={() => {
                setExplaination(Explaination.SANDBOX);
                setShowExplanation(true);
              }}
            >
              What is this?
            </Link>
          </Text>
        </Flex>

        <Flex direction="row" justify="space-between" align="center" mb={4}>
          <FormLabel pr={2} pt={2}>
            {`Sandbox mode ${sandboxMode ? "enabled" : "disabled"}`}
          </FormLabel>
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
          Register
        </Button>
      </form>
    </Box>
  );
};

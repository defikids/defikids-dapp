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
  Text,
  Switch,
  Link,
} from "@chakra-ui/react";
import axios from "axios";
import { transactionErrors } from "@/utils/errorHanding";
import NextLink from "next/link";
import {
  UserType,
  AccountPackage,
  Explaination,
  AccountStatus,
  PermissionType,
} from "@/data-schema/enums";
import { convertTimestampToSeconds } from "@/utils/dateTime";
import { ExplainFamilyName } from "@/components/explainations/ExplainFamilyName";
import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { TestnetNetworks, NetworkType } from "@/data-schema/enums";
import { createUser } from "@/services/mongo/routes/user";
import { createAccount } from "@/services/mongo/routes/account";
import { createActivity } from "@/services/mongo/routes/activity";
import { IUser } from "@/models/User";
import { IAccount } from "@/models/Account";

export const RegisterParentForm = ({ onClose }: { onClose: () => void }) => {
  //=============================================================================
  //                             STATE
  //=============================================================================

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const isNameError = username === "";
  const isEmailError = email === "";
  const isFamilyNameError = familyName === "";

  const [showExplanation, setShowExplanation] = useState(false);
  const [explaination, setExplaination] = useState(Explaination.NONE);

  //=============================================================================
  //                             HOOKS
  //=============================================================================

  const toast = useToast();
  const { address } = useAccount();
  const router = useRouter();

  const { setIsLoggedIn } = useAuthStore(
    (state) => ({
      setIsLoggedIn: state.setIsLoggedIn,
    }),
    shallow
  );

  //=============================================================================
  //                             FUNCTIONS
  //=============================================================================

  const sendEmailConfirmation = async () => {
    try {
      const payload = {
        username,
        email,
        walletAddress: address,
      };

      await axios.post(`/api/emails/confirm-email-address`, payload);
      return true;
    } catch (e) {
      const errorDetails = transactionErrors(e);
      toast(errorDetails);
    }
  };

  const handleSubmit = async () => {
    setHasSubmitted(true);

    if (!termsAgreed) {
      toast({
        description: "Please agree to the terms and conditions.",
        status: "error",
      });
      return;
    }

    if (isNameError || isEmailError || isFamilyNameError) {
      return;
    }

    const wallet = address;

    const accountPayload = {
      status: AccountStatus.ACTIVE,
      memberSince: convertTimestampToSeconds(Date.now()),
      package: AccountPackage.BASIC,
      familyName,
    } as IAccount;

    let userPayload = {
      termsAgreed,
      email,
      defaultNetwork: TestnetNetworks.GOERLI,
      defaultNetworkType: NetworkType.TESTNET,
      wallet,
      username,
      userType: UserType.PARENT,
      sandboxMode: false,
      permissions: [...Object.values(PermissionType)],
    } as IUser;

    try {
      // Create a new account record
      const account = await createAccount(accountPayload, String(address));
      const accountError = account.response?.data?.error || account.error;

      if (accountError) {
        toast({
          description: "Database error. Please try again later.",
          status: "error",
        });
        throw new Error(accountError);
      }

      // Create a new user record
      userPayload.accountId = account._id;
      const user = await createUser(userPayload);
      const error = user.response?.data?.error || user.error;

      await createActivity({
        accountId: account._id,
        wallet,
        date: convertTimestampToSeconds(Date.now()),
        type: "Account Created 🎉",
      });

      if (error) {
        toast({
          description: "Database error. Please try again later.",
          status: "error",
        });
        throw new Error(error);
      }

      setIsLoggedIn(true);

      const emailSent = await sendEmailConfirmation();
      if (!emailSent) {
        return;
      }

      toast({
        title: "Registration successful",
        status: "success",
      });

      onClose();
      router.push("/parent-dashboard");
    } catch (e) {
      const errorDetails = transactionErrors(e);
      toast(errorDetails);
      onClose();
    }
  };

  if (showExplanation && explaination === Explaination.FAMILY_NAME) {
    return (
      <ExplainFamilyName
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

        {/* Email */}
        <FormControl isInvalid={isEmailError && hasSubmitted} my={5}>
          <Input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            borderColor={isEmailError && hasSubmitted ? "red.500" : "black"}
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
          {isEmailError && hasSubmitted && (
            <FormErrorMessage color="red.500">
              Email is required
            </FormErrorMessage>
          )}
        </FormControl>

        {/* Family Name */}
        <FormControl isInvalid={isFamilyNameError && hasSubmitted}>
          <Flex direction="row" justify="flex-end" align="center">
            <Text fontSize="xs" ml={3}>
              <Link
                as={NextLink}
                color="blue.500"
                href="#"
                onClick={() => {
                  setExplaination(Explaination.FAMILY_NAME);
                  setShowExplanation(true);
                }}
              >
                What is this?
              </Link>
            </Text>
          </Flex>

          <Input
            type="text"
            placeholder="Family Name"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            borderColor={
              isFamilyNameError && hasSubmitted ? "red.500" : "black"
            }
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
          {isFamilyNameError && hasSubmitted && (
            <FormErrorMessage color="red.500">
              Family name is required
            </FormErrorMessage>
          )}
        </FormControl>

        <Flex direction="row" justify="flex-start" align="center" mt={4}>
          <Switch
            id="terms"
            isChecked={termsAgreed}
            variant="outline"
            size="md"
            onChange={(e) => setTermsAgreed(e.target.checked)}
          />
          <Text fontSize="xs" ml={3}>
            I agree with{" "}
            <Link as={NextLink} color="blue.500" href="#">
              terms and conditions
            </Link>
          </Text>
        </Flex>
        <Button
          mt="2rem"
          variant="solid"
          colorScheme="blue"
          onClick={handleSubmit}
          w="100%"
          _hover={{
            bgColor: "blue.600",
          }}
        >
          Register Parent
        </Button>
      </form>
    </Box>
  );
};

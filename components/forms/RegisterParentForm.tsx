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
import { User, AccountDetails } from "@/dataSchema/types";
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
import { ExplainFamilyId } from "@/components/explainations/ExplainFamilyId";
import { useAuthStore } from "@/store/auth/authStore";
import shallow from "zustand/shallow";
import router from "next/router";

export const RegisterParentForm = ({ onClose }: { onClose: () => void }) => {
  //=============================================================================
  //                             STATE
  //=============================================================================

  const [username, setUsername] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [familyId, setFamilyId] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const isNameError = username === "";
  const isIdError = familyId === "";

  const [showExplanation, setShowExplanation] = useState(false);
  const [explaination, setExplaination] = useState(Explaination.NONE);

  //=============================================================================
  //                             HOOKS
  //=============================================================================

  const toast = useToast();

  const { userDetails, setUserDetails, walletAddress } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
      setUserDetails: state.setUserDetails,
      walletAddress: state.walletAddress,
    }),
    shallow
  );

  //=============================================================================
  //                             FUNCTIONS
  //=============================================================================

  const handleSubmit = async () => {
    setHasSubmitted(true);

    if (!termsAgreed) {
      toast({
        description: "Please agree to the terms and conditions.",
        status: "error",
      });
      return;
    }

    if (username === "" || isIdError) {
      return;
    }

    try {
      const accountDetails = {
        id: uuidv4(),
        status: AccountStatus.ACTIVE,
        memberSince: timestampInSeconds(Date.now()),
        package: AccountPackage.BASIC,
      } as AccountDetails;

      const body = {
        account: accountDetails,
        familyId: hashedFamilyId(familyId),
        wallet: walletAddress,
        avatarURI: "",
        backgroundURI: "",
        opacity: {
          background: 1,
          card: 1,
        },
        username,
        userType: UserType.PARENT,
        children: [],
      } as User;

      const payload = {
        key: walletAddress,
        value: body,
      };

      console.log("payload", payload);

      await axios.post(`/api/vercel/set-json`, payload);

      setUserDetails(body);

      toast({
        title: "Registration successful",
        status: "success",
      });

      onClose();
      router.push("/parent");
    } catch (e) {
      const errorDetails = transactionErrors(e);
      toast(errorDetails);
      onClose();
    }
  };

  if (showExplanation) {
    return (
      <ExplainFamilyId
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

        {/* Family Id */}
        <FormControl isInvalid={isIdError && hasSubmitted} mt={5}>
          <Flex direction="row" justify="flex-end" align="center">
            <Text fontSize="xs" ml={3}>
              <Link
                as={NextLink}
                color="blue.500"
                href="#"
                onClick={() => {
                  setExplaination(Explaination.FAMILY_ID);
                  setShowExplanation(true);
                }}
              >
                What is this?
              </Link>
            </Text>
          </Flex>

          <Input
            type="text"
            color="black"
            placeholder="Create Family Id"
            value={familyId}
            onChange={(e) => setFamilyId(e.target.value)}
            borderColor={isIdError && hasSubmitted ? "red.500" : "black"}
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
          {isIdError && hasSubmitted && (
            <FormErrorMessage color="red.500">
              Family Id is required.
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

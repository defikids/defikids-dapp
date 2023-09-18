"use client";

import React, { useRef, useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  useToast,
  Flex,
  Switch,
  Divider,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import axios from "axios";
import { useAuthStore } from "@/store/auth/authStore";
import shallow from "zustand/shallow";
import { transactionErrors } from "@/utils/errorHanding";
import {
  AccountPackage,
  AccountStatus,
  NetworkType,
  TestnetNetworks,
  UserType,
} from "@/data-schema/enums";
import { timestampInSeconds } from "@/utils/dateTime";
import { AccountDetails, User } from "@/data-schema/types";

const RegisterChildForm = ({ isLoading }: { isLoading: boolean }) => {
  //=============================================================================
  //                             STATE
  //=============================================================================

  const [username, setUsername] = useState("");
  const [wallet, setWallet] = useState("");

  const [sandboxMode, setSandboxMode] = useState(false);

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const isNameError = username === "";
  const isInvalidWallet = !ethers.utils.isAddress(wallet);

  //=============================================================================
  //                             HOOKS
  //=============================================================================

  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { userDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
    }),
    shallow
  );

  //=============================================================================
  //                             FUNCTIONS
  //=============================================================================
  const handleSubmit = async () => {
    setHasSubmitted(true);

    if (isNameError) {
      return;
    }

    try {
      const accountDetails = {
        id: userDetails.familyId,
        status: AccountStatus.ACTIVE,
        memberSince: timestampInSeconds(Date.now()),
        package: AccountPackage.NONE,
      } as AccountDetails;

      const body = {
        account: accountDetails,
        familyName: userDetails.familyName,
        email: "",
        defaultNetwork: TestnetNetworks.GOERLI,
        defaultNetworkType: NetworkType.TESTNET,
        familyId: userDetails.familyId,
        wallet,
        avatarURI: "",
        backgroundURI: "",
        opacity: {
          background: 1,
          card: 1,
        },
        username,
        userType: UserType.PARENT,
        children: [],
        invitations: [],
      } as User;

      const payload = {
        key: address,
        value: body,
      };

      await axios.post(`/api/vercel/set-json`, payload);
      setUserDetails(body);
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
      await axios.delete(`/api/vercel/delete-json-data?key=${address}`);
      const errorDetails = transactionErrors(e);
      toast(errorDetails);
      onClose();
    }
  };

  return (
    <Box textAlign="left">
      <form>
        <Flex direction="row" align="center">
          {/* Name */}
          <FormControl isInvalid={isNameError && hasSubmitted}>
            <FormLabel>{`Username`}</FormLabel>
            <Input
              type="text"
              placeholder="Kid's Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              borderColor={isNameError && hasSubmitted ? "red.500" : "black"}
              _hover={{
                borderColor: "gray.300",
              }}
              _focus={{
                borderColor: "blue.500",
              }}
            />
            {isNameError && hasSubmitted && (
              <FormErrorMessage color="red.500">
                Name is required
              </FormErrorMessage>
            )}
          </FormControl>
        </Flex>

        {/* Wallet */}
        <FormControl isInvalid={isInvalidWallet && hasSubmitted} mt={5}>
          <FormLabel>Wallet Address</FormLabel>
          <Input
            type="text"
            placeholder="Wallet"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            borderColor={isInvalidWallet && hasSubmitted ? "red.500" : "black"}
            _hover={{
              borderColor: "gray.300",
            }}
            _focus={{
              borderColor: "blue.500",
            }}
          />
          {isInvalidWallet && hasSubmitted && (
            <FormErrorMessage color="red.500">
              Invalid wallet address.
            </FormErrorMessage>
          )}
        </FormControl>

        <Divider mt={5} mb={5} borderColor="black" />

        {/* Sandbox mode toggle switch */}
        <Flex
          direction="row"
          justify="space-between"
          align="center"
          mt={4}
          mb={4}
        >
          <FormLabel pr={2} pt={2}>
            {`Sandbox mode ${sandboxMode ? "enabled" : "disabled"}`}
          </FormLabel>
          <Switch
            id="sandbox"
            isChecked={sandboxMode}
            colorScheme="blue"
            variant="outline"
            size="lg"
            onChange={(e) => setSandboxMode(e.target.checked)}
          />
        </Flex>

        {/* Avatar input toggle switch */}

        <Divider mt={5} mb={5} borderColor="black" />

        {/* Submit Child Button */}
        <Button
          isLoading={isLoading}
          width="full"
          size="lg"
          mt={4}
          bgColor="blue.500"
          color="white"
          _hover={{
            bgColor: "blue.600",
          }}
          onClick={handleSubmit}
        >
          Add Member
        </Button>
      </form>
    </Box>
  );
};

export default RegisterChildForm;

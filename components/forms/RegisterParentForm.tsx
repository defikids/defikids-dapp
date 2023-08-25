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
  Divider,
  Avatar,
  useSteps,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import axios from "axios";
import {
  TransactionStepper,
  steps,
} from "@/components/steppers/TransactionStepper";
import router from "next/router";
import { useAuthStore } from "@/store/auth/authStore";
import { useContractStore } from "@/store/contract/contractStore";
import shallow from "zustand/shallow";
import HostContract from "@/services/contract";
import { AvatarSelection } from "@/components/forms/AvatarSelection";
import { StepperContext } from "@/dataSchema/enums";
import { transactionErrors } from "@/utils/errorHanding";
import { TransactionResponse } from "@ethersproject/abstract-provider";

export const RegisterParentForm = ({
  onClose,
  loading,
  setIsLoading,
}: {
  onClose: () => void;
  loading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}) => {
  //=============================================================================
  //                             STATE
  //=============================================================================

  const [username, setUsername] = useState("");
  const [wallet, setWallet] = useState("");
  const [avatarURI, setAvatarURI] = useState("");
  const [uploadURI, setUploadURI] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [familyId, setFamilyId] = useState("");

  const [provideUrl, setProvideUrl] = useState(false);

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const isNameError = username === "";
  const isIdError = familyId === "";
  const isInvalidWallet = !ethers.utils.isAddress(wallet);

  //=============================================================================
  //                             HOOKS
  //=============================================================================

  const toast = useToast();
  const fileInputRef = useRef(null);
  const inputUrlRef = useRef(null);

  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });

  const { walletAddress } = useAuthStore(
    (state) => ({
      walletAddress: state.walletAddress,
    }),
    shallow
  );

  const { connectedSigner } = useContractStore(
    (state) => ({
      connectedSigner: state.connectedSigner,
    }),
    shallow
  );

  //=============================================================================
  //                             FUNCTIONS
  //=============================================================================

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const uploadToIpfs = async () => {
    try {
      const response = await axios.post(
        `/api/ipfs/upload-to-ipfs`,
        selectedFile,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (e) {
      console.error(e as Error);
      return {
        validationError: "",
        ifpsHash: "",
      };
    }
  };

  const handleSubmit = async () => {
    setHasSubmitted(true);

    if (username === "" || wallet === "" || isIdError || isInvalidWallet) {
      return;
    }

    setIsLoading(true);
    setActiveStep(0);

    let ipfsImageHash = "";

    if (selectedFile) {
      const { validationError, ifpsHash } = (await uploadToIpfs()) as {
        validationError: string;
        ifpsHash: string;
      };

      if (validationError) {
        toast({
          title: "Error",
          description: validationError,
          status: "error",
        });
        return;
      }
      ipfsImageHash = ifpsHash;
    }

    const ifpsURI = `https://ipfs.io/ipfs/${ipfsImageHash}`;
    const avatar = ipfsImageHash ? ifpsURI : avatarURI;

    const contract = await HostContract.fromProvider(connectedSigner);

    try {
      setActiveStep(1);
      const tx = (await contract.registerParent(
        familyId,
        wallet,
        avatar,
        username
      )) as TransactionResponse;

      setActiveStep(2);
      await tx.wait();

      localStorage.setItem("defi-kids.family-id", familyId);
      toast({
        title: "Child successfully added",
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

  // https://v2-liveart.mypinata.cloud/ipfs/QmVkmX5pGfMuBEbBbWJiQAUcQjAqU7zT3jHF6SZTZNoZsY

  if (loading) {
    return (
      <TransactionStepper
        activeStep={activeStep}
        context={StepperContext.AVATAR}
      />
    );
  }

  return (
    <Box textAlign="left">
      <form>
        {/* Name and avatar */}
        <Flex direction="row" align="center">
          <Avatar
            mt={3}
            size="lg"
            name="Defi Kids"
            src={avatarURI ? avatarURI : "/images/placeholder-avatar.jpeg"}
          />

          {/* Name */}
          <FormControl isInvalid={isNameError && hasSubmitted} ml={5}>
            <FormLabel>{`Username`}</FormLabel>
            <Input
              type="text"
              placeholder="Kid's Name"
              value={username}
              disabled={loading}
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
            disabled={loading}
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
        {/* Family Id */}
        <FormControl isInvalid={isIdError && hasSubmitted}>
          <FormLabel mt={3} color="black">{`Family ID`}</FormLabel>
          <Input
            type="text"
            color="black"
            placeholder="Create a family id."
            value={familyId}
            onChange={(e) => setFamilyId(e.target.value)}
            borderColor={isIdError && hasSubmitted ? "red.500" : "black"}
            _hover={{
              borderColor: "gray.300",
            }}
            _focus={{
              borderColor: "blue.500",
            }}
          />
          {isIdError && hasSubmitted && (
            <FormErrorMessage color="red.500">
              Family Id is required.
            </FormErrorMessage>
          )}
        </FormControl>{" "}
        <Divider mt={5} mb={5} borderColor="black" />
        <AvatarSelection
          provideUrl={provideUrl}
          inputUrlRef={inputUrlRef}
          fileInputRef={fileInputRef}
          uploadURI={uploadURI}
          avatarURI={avatarURI}
          setAvatarURI={setAvatarURI}
          setUploadURI={setUploadURI}
          openFileInput={openFileInput}
          setSelectedFile={setSelectedFile}
          setProvideUrl={setProvideUrl}
        />
        <Divider mt={5} mb={5} borderColor="black" />
        {/* Submit Child Button */}
        <Button
          isLoading={loading}
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
          Register Parent
        </Button>
      </form>
    </Box>
  );
};

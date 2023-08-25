import React, { useRef, useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  useToast,
  Text,
  Flex,
  Switch,
  Divider,
  Avatar,
  Heading,
  useSteps,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import HostContract from "@/services/contract";
import axios from "axios";
import {
  TransactionStepper,
  steps,
} from "@/components/steppers/TransactionStepper";
import { useContractStore } from "@/store/contract/contractStore";
import { useAuthStore } from "@/store/auth/authStore";
import shallow from "zustand/shallow";
import { transactionErrors } from "@/utils/errorHanding";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { StepperContext } from "@/dataSchema/enums";

const RegisterChildForm = ({
  onClose,
  onAdd,
  isLoading,
  setIsLoading,
}: {
  onClose: () => void;
  onAdd: () => void;
  isLoading: boolean;
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

  const [sandboxMode, setSandboxMode] = useState(false);
  const [provideUrl, setProvideUrl] = useState(false);

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const isNameError = username === "";
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

  const { connectedSigner } = useContractStore(
    (state) => ({
      connectedSigner: state.connectedSigner,
    }),
    shallow
  );

  const { walletAddress } = useAuthStore(
    (state) => ({
      walletAddress: state.walletAddress,
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

    if (username === "" || wallet === "" || isInvalidWallet) {
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

    const contract = await HostContract.fromProvider(
      connectedSigner,
      walletAddress
    );
    const ifpsURI = `https://ipfs.io/ipfs/${ipfsImageHash}`;
    const avatar = ipfsImageHash ? ifpsURI : avatarURI;

    try {
      setActiveStep(1);
      const tx = (await contract.addChild(
        username,
        avatar,
        wallet,
        sandboxMode
      )) as TransactionResponse;

      setActiveStep(2);
      await tx.wait();

      toast({
        title: "Child successfully added",
        status: "success",
      });
      onAdd();
      onClose();
    } catch (e) {
      const errorDetails = transactionErrors(e);
      toast(errorDetails);
      onClose();
    }
  };

  // https://v2-liveart.mypinata.cloud/ipfs/QmVkmX5pGfMuBEbBbWJiQAUcQjAqU7zT3jHF6SZTZNoZsY

  if (isLoading) {
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
              disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
            id="sandbox"
            isChecked={sandboxMode}
            colorScheme="blue"
            variant="outline"
            size="lg"
            onChange={(e) => setSandboxMode(e.target.checked)}
          />
        </Flex>

        {/* Avatar input toggle switch */}
        <Flex direction="row" justify="space-between" align="center">
          <Text>{`Provide avatar ${!provideUrl ? "url" : "file"}`}</Text>
          <Switch
            disabled={isLoading}
            id="sandbox"
            isChecked={provideUrl}
            colorScheme="blue"
            variant="outline"
            size="lg"
            onChange={(e) => setProvideUrl(e.target.checked)}
          />
        </Flex>

        <Divider mt={5} mb={5} borderColor="black" />

        {/* Avatar upload options */}
        <FormControl>
          <Flex direction="row" justify="space-between" align="center" my={5}>
            <Heading size="xs">{`Profile avatar ${
              provideUrl ? "url" : "file"
            }`}</Heading>

            {/* Clear avatar values */}
            <Button
              colorScheme="blue"
              size="sm"
              onClick={() => {
                setAvatarURI("");
                setUploadURI("");
                // inputUrlRef.current.value = "";
              }}
            >
              Clear
            </Button>
          </Flex>

          {!provideUrl ? (
            <>
              {/* Avatar Action */}
              <Button
                colorScheme="blue"
                size="md"
                mt={2}
                onClick={openFileInput}
                w="100%"
              >
                Upload File
              </Button>

              {/* hidden file input */}
              <input
                type="file"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={(e) => {
                  e.preventDefault();
                  const files = e.target.files;
                  if (!files) return;

                  const validTypes = ["image/png", "image/jpg", "image/jpeg"];

                  if (
                    files &&
                    files.length > 0 &&
                    !validTypes.includes(files[0].type)
                  ) {
                    toast({
                      title: "Error",
                      description:
                        "Invalid file type. Only accept images with .png, .jpg or .jpeg extensions.",
                      status: "error",
                    });
                  }

                  if (files && files.length > 0) {
                    const file = files[0];
                    const reader = new FileReader();

                    reader.onloadend = () => {
                      console.log(reader.result);
                      setAvatarURI(reader.result as string);
                    };

                    reader.readAsDataURL(file);

                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("description", "child_avatar");
                    setSelectedFile(formData);
                  } else {
                    console.log("User canceled file selection");
                  }
                }}
              />
            </>
          ) : (
            // URL input field and upload button
            <Flex
              direction="column"
              justify="center"
              align="center"
              w="100%"
              mt={5}
            >
              <Input
                type="text"
                color="black"
                ref={inputUrlRef}
                variant="outline" // Change the variant to "outline"
                placeholder="Provide image url"
                value={provideUrl ? uploadURI : avatarURI}
                disabled={isLoading}
                onChange={(e) => {
                  setUploadURI(e.target.value);
                }}
                borderColor="black"
                _hover={{
                  borderColor: "gray.300",
                }}
                _focus={{
                  borderColor: "blue.500",
                }}
              />
              <Button
                colorScheme="blue"
                size="md"
                my={5}
                px={5}
                w="100%"
                onClick={async () => {
                  try {
                    const response = await axios.get(uploadURI);
                    if (response.status === 200) {
                      setAvatarURI(uploadURI);
                    }
                  } catch (e) {
                    console.error(e);
                    toast({
                      title: "Error",
                      description: "Invalid image url",
                      status: "error",
                    });
                  }
                }}
              >
                Upload Image URL
              </Button>
            </Flex>
          )}
        </FormControl>

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
          Add Child
        </Button>
      </form>
    </Box>
  );
};

export default RegisterChildForm;

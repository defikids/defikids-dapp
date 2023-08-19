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
} from "@chakra-ui/react";
import { ethers } from "ethers";
import sequence from "@/services/sequence";
import HostContract from "@/services/contract";
import axios from "axios";

export const RegisterChildForm = ({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: () => void;
}) => {
  //=============================================================================
  //                             STATE
  //=============================================================================

  const [username, setUsername] = useState("");
  const [wallet, setWallet] = useState("");
  const [avatarURI, setAvatarURI] = useState("");
  const [uploadURI, setUploadURI] = useState("");

  const [sandboxMode, setSandboxMode] = useState(false);
  const [provideUrl, setProvideUrl] = useState(false);

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isNameError = username === "";
  const isInvalidWallet = !ethers.utils.isAddress(wallet);

  //=============================================================================
  //                             HOOKS
  //=============================================================================

  const toast = useToast();
  const fileInputRef = useRef(null);
  const inputUrlRef = useRef(null);

  //=============================================================================
  //                             FUNCTIONS
  //=============================================================================

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async () => {
    setHasSubmitted(true);

    if (username === "" || wallet === "" || isInvalidWallet) {
      return;
    }

    const signer = sequence.wallet.getSigner();
    const contract = await HostContract.fromProvider(signer);

    try {
      setIsLoading(true);
      const familyId = localStorage.getItem("defi-kids.family-id");
      const tx = await contract.addChild(
        familyId,
        username,
        avatarURI,
        wallet,
        sandboxMode
      );
      const txReceipt = await tx.wait();

      if (txReceipt.status === 1) {
        toast({
          title: "Child successfully added",
          status: "success",
        });
        onClose();
        onAdd();
      }
    } catch (e) {
      setIsLoading(false);
      if (e.code === 4001) {
        toast({
          title: "Transaction Error",
          description: "User rejected transaction",
          status: "error",
        });
        return;
      }

      toast({
        title: "Error",
        description: "Network error",
        status: "error",
      });

      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  // https://v2-liveart.mypinata.cloud/ipfs/QmVkmX5pGfMuBEbBbWJiQAUcQjAqU7zT3jHF6SZTZNoZsY
  return (
    <>
      {
        <Box textAlign="left">
          <form>
            {/* Name and avatar */}
            <Flex direction="row" align="center">
              <Avatar
                mt={3}
                size="lg"
                name="Defi Kids"
                src={avatarURI ? avatarURI : "./pig_logo.png"}
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
                  borderColor={
                    isNameError && hasSubmitted ? "red.500" : "black"
                  }
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
                borderColor={
                  isInvalidWallet && hasSubmitted ? "red.500" : "black"
                }
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
              <Flex
                direction="row"
                justify="space-between"
                align="center"
                my={5}
              >
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
                    inputUrlRef.current.value = "";
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
                      console.log(files);
                      console.log(files[0].type);
                      const validTypes = [
                        "image/png",
                        "image/jpg",
                        "image/jpeg",
                      ];

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
      }
    </>
  );
};

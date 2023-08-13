import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  useToast,
  Spinner,
  Text,
  Container,
  Flex,
  Switch,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import sequence from "@/services/sequence";
import HostContract from "@/services/contract";

export const RegisterChildForm = ({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: () => void;
}) => {
  const [name, setName] = useState("");
  const [wallet, setWallet] = useState("");
  const [sandboxMode, setSandboxMode] = useState(false);

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isNameError = name === "";
  const isInvalidWallet = !ethers.utils.isAddress(wallet);

  const toast = useToast();

  const handleSubmit = async () => {
    setHasSubmitted(true);

    if (name === "" || wallet === "" || isInvalidWallet) {
      return;
    }

    const signer = sequence.wallet.getSigner();
    const contract = await HostContract.fromProvider(signer);

    try {
      setIsLoading(true);
      const tx = await contract.addChild(wallet, name, sandboxMode);
      const txReceipt = await tx.wait();

      if (txReceipt.status === 1) {
        toast({
          title: "Child Added",
          description: "Child successfully added.",
          status: "success",
        });
      }
    } catch (e) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Error adding child.",
        status: "success",
      });
    } finally {
      setIsLoading(false);
      onAdd();
      onClose();
    }
  };

  return (
    <>
      {isLoading ? (
        <Container maxW="2xl" centerContent paddingBottom={4}>
          <Text fontSize="3xl" paddingBottom={4} align="center">
            Transaction in progress...
          </Text>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Container>
      ) : (
        <Box textAlign="left">
          <form>
            {/* Name */}
            <FormControl isInvalid={isNameError && hasSubmitted}>
              <FormLabel>{`Your kid's name`}</FormLabel>
              <Input
                type="text"
                placeholder="Kid's Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                  Name is required.
                </FormErrorMessage>
              )}
            </FormControl>

            {/* Wallet */}
            <FormControl isInvalid={isInvalidWallet && hasSubmitted} mt={3}>
              <FormLabel>Wallet Address</FormLabel>
              <Input
                type="text"
                placeholder="Wallet"
                value={wallet}
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

            {/* Submit */}
            <Button
              width="full"
              my={4}
              bgColor="blue.500"
              color="white"
              _hover={{
                bgColor: "blue.600",
              }}
              onClick={handleSubmit}
            >
              Add
            </Button>
          </form>
        </Box>
      )}
    </>
  );
};

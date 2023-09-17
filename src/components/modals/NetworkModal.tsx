"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  ModalFooter,
  Button,
  useToast,
  Heading,
  Box,
  Select,
  Flex,
  Text,
  Switch,
  Container,
} from "@chakra-ui/react";
import { useState } from "react";
import shallow from "zustand/shallow";
import { useAuthStore } from "@/store/auth/authStore";
import {
  MainnetNetworks,
  TestnetNetworks,
  NetworkType,
} from "@/data-schema/enums";
import { transactionErrors } from "@/utils/errorHanding";
import axios from "axios";

export const NetworkModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  //=============================================================================
  //                               STATE
  //=============================================================================
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedNetworkType, setSelectedNetworkType] = useState(
    NetworkType.MAINNET
  );
  const [isLoading, setIsLoading] = useState(false);

  //=============================================================================
  //                               HOOKS
  //=============================================================================
  const { userDetails, setUserDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
      setUserDetails: state.setUserDetails,
    }),
    shallow
  );

  const toast = useToast();

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================

  const handleSubmit = async () => {
    try {
      if (!selectedNetwork) {
        toast({
          title: "Error",
          description: "Selected network cannot be empty",
          status: "error",
        });
        return;
      }

      const body = {
        ...userDetails,
        defaultNetwork: selectedNetwork,
        defaultNetworkType: selectedNetworkType,
      };

      const payload = {
        key: userDetails?.wallet,
        value: body,
      };

      await axios.post(`/api/vercel/set-json`, payload);
      // @ts-ignore
      setUserDetails(body);

      toast({
        title: "Default network successfully updated",
        status: "success",
      });
    } catch (e) {
      const errorDetails = transactionErrors(e);
      toast(errorDetails);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      onCloseComplete={() => {
        setIsLoading(false);
      }}
      isCentered
    >
      <ModalOverlay
        bg="none"
        backdropFilter="auto"
        backdropInvert="10%"
        backdropBlur="4px"
      />
      <ModalContent>
        <ModalHeader>
          <Heading fontSize="sm">Change Default Network</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Flex direction="row" justify="flex-end" align="center" my={3}>
              <Text>{NetworkType.MAINNET}</Text>
              <Switch
                mx={3}
                size="md"
                value={selectedNetworkType}
                onChange={() => {
                  selectedNetworkType === NetworkType.TESTNET
                    ? setSelectedNetworkType(NetworkType.MAINNET)
                    : setSelectedNetworkType(NetworkType.TESTNET);
                }}
              />
              <Text>{NetworkType.TESTNET}</Text>
            </Flex>
            <FormControl>
              {NetworkType.TESTNET === selectedNetworkType && (
                <Select
                  placeholder="Select a testnet network"
                  value={selectedNetwork}
                  onChange={(e) => setSelectedNetwork(e.target.value)}
                  style={{
                    border: "1px solid lightgray",
                    marginBottom: "10px",
                  }}
                  sx={{
                    "::placeholder": {
                      color: "gray.100",
                    },
                  }}
                >
                  {Object.keys(TestnetNetworks).map((networkKey) => (
                    <option
                      key={networkKey}
                      value={TestnetNetworks[networkKey]}
                    >
                      {TestnetNetworks[networkKey]}
                    </option>
                  ))}
                </Select>
              )}

              {NetworkType.MAINNET === selectedNetworkType && (
                <Select
                  placeholder="Select a mainnet network"
                  value={selectedNetwork}
                  onChange={(e) => setSelectedNetwork(e.target.value)}
                  style={{
                    border: "1px solid lightgray",
                    marginBottom: "10px",
                  }}
                  sx={{
                    "::placeholder": {
                      color: "gray.400",
                    },
                  }}
                >
                  {Object.keys(MainnetNetworks).map((networkKey) => (
                    <option
                      key={networkKey}
                      value={MainnetNetworks[networkKey]}
                    >
                      {MainnetNetworks[networkKey]}
                    </option>
                  ))}
                </Select>
              )}

              <Container
                maxW="container.sm"
                p={5}
                mt={2}
                style={{
                  border: "1px solid lightgray",
                  borderRadius: "5px",
                }}
              >
                <Heading fontSize="sm" mb={1}>
                  Current Defaults
                </Heading>
                <Text>{`Network Type: ${userDetails.defaultNetworkType}`}</Text>
                <Text>{`Network Name: ${userDetails.defaultNetwork} `}</Text>
              </Container>

              <Heading textAlign="center" fontSize="md" mt={5} color="purple">
                {userDetails.defaultNetworkType === NetworkType.TESTNET ? (
                  <span>You are currently in sandbox mode</span>
                ) : (
                  <span>Selecting a test network will enable sandbox mode</span>
                )}
              </Heading>
            </FormControl>
          </Box>
        </ModalBody>
        <ModalFooter>
          {!isLoading && (
            <Button colorScheme="blue" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

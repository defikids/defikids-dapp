"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  Stack,
  Flex,
  Text,
  Link,
  Heading,
} from "@chakra-ui/react";
import { shallow } from "zustand/shallow";
import { useAuthStore } from "@/store/auth/authStore";
import NextLink from "next/link";
import { Explaination } from "@/data-schema/enums";
import { useState } from "react";
import { ExplainBlockchain } from "@/components/explainations/ExplainBlockchain";
import { useNetwork } from "wagmi";
import { DEFIKIDS_PROXY_ADDRESS } from "@/blockchain/contract-addresses";
import { validChainId } from "@/config";

export const EtherscanModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  //=============================================================================
  //                               HOOKS
  //=============================================================================

  const { userDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
    }),
    shallow
  );

  const { chain } = useNetwork();

  //=============================================================================
  //                               STATE
  //=============================================================================

  const [showExplanation, setShowExplanation] = useState(false);
  const [explaination, setExplaination] = useState(Explaination.NONE);

  const showBlockchainExplaination = () => {
    return (
      <ExplainBlockchain
        explaination={explaination}
        setShowExplanation={setShowExplanation}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const showBlockchainOptions = () => {
    return (
      <>
        <Flex direction="row" justify="flex-end" align="center" mb={3}>
          <Text fontSize="xs" ml={3}>
            <Link
              as={NextLink}
              color="blue.500"
              href="#"
              onClick={() => {
                setExplaination(Explaination.BLOCKCHAIN);
                setShowExplanation(true);
              }}
            >
              What is this?
            </Link>
          </Text>
        </Flex>

        <Stack direction="column" spacing="24px">
          <Button
            colorScheme="blue"
            w="auto"
            h="40px"
            onClick={() => {
              window.open(
                `https://etherscan.io/address/${userDetails?.wallet}`,
                "_blank"
              );
            }}
          >
            My Transaction History
          </Button>
          <Button
            w="auto"
            h="40px"
            colorScheme="blue"
            onClick={() => {
              if (chain?.id === validChainId)
                window.open(
                  `https://goerli.etherscan.io/address/${DEFIKIDS_PROXY_ADDRESS}`,
                  "_blank"
                );
            }}
          >
            DefiDollars Contract
          </Button>
        </Stack>
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      onCloseComplete={() => {}}
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
          <Heading fontSize="sm">Etherscan</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {showExplanation
            ? showBlockchainExplaination()
            : showBlockchainOptions()}
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

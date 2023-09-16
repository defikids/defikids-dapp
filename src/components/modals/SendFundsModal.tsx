"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Button,
  useSteps,
  useToast,
  Heading,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  TransactionStepper,
  steps,
} from "@/components/steppers/TransactionStepper";
import { useContractStore } from "@/store/contract/contractStore";
import shallow from "zustand/shallow";
import { useAuthStore } from "@/store/auth/authStore";
import { StepperContext } from "@/data-schema/enums";
import { transactionErrors } from "@/utils/errorHanding";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { ethers } from "ethers";

export const SendFundsModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  //=============================================================================
  //                               STATE
  //=============================================================================
  const [memberAddress, setMemberAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //=============================================================================
  //                               HOOKS
  //=============================================================================
  const { connectedSigner } = useContractStore(
    (state) => ({
      connectedSigner: state.connectedSigner,
    }),
    shallow
  );

  const toast = useToast();

  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================

  const onSubmit = async () => {
    const recipientAddress = memberAddress;
    const amountToSend = ethers.utils.parseEther(amount);
    setIsLoading(true);

    try {
      setActiveStep(0);
      const tx = (await connectedSigner?.sendTransaction({
        to: recipientAddress,
        value: amountToSend,
      })) as TransactionResponse;

      setActiveStep(1);
      await tx.wait();

      toast({
        title: "Funds sent successfully",
        status: "success",
      });
      onClose();
    } catch (e) {
      const errorDetails = transactionErrors(e);
      toast(errorDetails);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      onCloseComplete={() => {
        setIsLoading(false);
        setMemberAddress("");
        setAmount("");
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
          <Heading fontSize="sm">Send Funds</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading ? (
            <TransactionStepper
              activeStep={activeStep}
              context={StepperContext.DEFAULT}
            />
          ) : (
            <Box>
              <FormControl>
                <Input
                  placeholder="Member wallet address"
                  value={memberAddress}
                  onChange={(e) => setMemberAddress(e.target.value)}
                  style={{
                    border: "1px solid lightgray",
                    marginBottom: "10px",
                  }}
                  sx={{
                    "::placeholder": {
                      color: "gray.400",
                    },
                  }}
                />
              </FormControl>

              <FormControl>
                <Input
                  placeholder="Amount to send"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{
                    border: "1px solid lightgray",
                  }}
                  sx={{
                    "::placeholder": {
                      color: "gray.400",
                    },
                  }}
                />
              </FormControl>
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          {!isLoading && (
            <Button colorScheme="blue" onClick={onSubmit}>
              Send
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

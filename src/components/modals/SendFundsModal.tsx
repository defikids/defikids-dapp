"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  Input,
  ModalFooter,
  Button,
  useSteps,
  useToast,
  Heading,
  Box,
  Text,
  Flex,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  TransactionStepper,
  steps,
} from "@/components/steppers/TransactionStepper";
import shallow from "zustand/shallow";
import { useContractStore } from "@/store/contract/contractStore";
import { useAuthStore } from "@/store/auth/authStore";
import { StepperContext } from "@/data-schema/enums";
import { transactionErrors } from "@/utils/errorHanding";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { ethers } from "ethers";
import Logo from "@/components/Logo";

export const SendFundsModal = ({
  isOpen,
  onClose,
  tokenBalance,
}: {
  isOpen: boolean;
  onClose: () => void;
  tokenBalance: number;
}) => {
  //=============================================================================
  //                               STATE
  //=============================================================================
  const [memberAddress, setMemberAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);

  //=============================================================================
  //                               HOOKS
  //=============================================================================
  const { defiDollarsContractInstance } = useContractStore(
    (state) => ({
      defiDollarsContractInstance: state.defiDollarsContractInstance,
    }),
    shallow
  );

  const { familyMembers } = useAuthStore(
    (state) => ({
      familyMembers: state.familyMembers,
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
    const amountToSend = amount;

    if (!recipientAddress) {
      toast({
        title: "Please select a member",
        status: "error",
      });
      return;
    }

    if (!amountToSend) {
      toast({
        title: "Please enter an amount",
        status: "error",
      });
      return;
    }

    if (!tokenBalance) {
      toast({
        title: "You don't have any Defi Dollars",
        status: "error",
      });
      return;
    }

    try {
      setIsLoading(true);
      setActiveStep(0);

      const tx = (await defiDollarsContractInstance?.transfer(
        recipientAddress,
        ethers.utils.parseEther(amountToSend)
      )) as TransactionResponse;

      setActiveStep(1);
      await tx.wait();

      toast({
        title: "Allowance sent",
        status: "success",
      });

      onClose();
      setAmount("");
      setMemberAddress("");

      setIsLoading(false);
    } catch (e) {
      const errorDetails = transactionErrors(e);
      toast(errorDetails);
      setIsLoading(false);
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
          <Heading fontSize="sm">Send Allowance</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading && (
            <TransactionStepper
              activeStep={activeStep}
              context={StepperContext.DEFAULT}
            />
          )}

          {/* Send allowance */}
          {!isLoading && !showExchangeDialog && (
            <Box>
              <Flex alignItems="center" justify="center">
                <Logo />
                <Flex
                  direction="row"
                  alignItems="baseline"
                  justify="center"
                  my={5}
                  ml={5}
                >
                  <Heading size="2xl" display="flex" alignItems="baseline">
                    {`${Number(tokenBalance).toFixed(4)}`}
                  </Heading>
                  <Text fontSize="sm" ml={2}>
                    DEFI DOLLARS
                  </Text>
                </Flex>
              </Flex>
              <Box>
                <FormControl>
                  <Select
                    mb={2}
                    style={{
                      border: "1px solid lightgray",
                    }}
                    placeholder="Select member"
                    value={memberAddress}
                    onChange={(e) => setMemberAddress(e.target.value)}
                  >
                    {familyMembers.map((member, index) => (
                      <option key={index} value={member.wallet}>
                        {member?.username}
                      </option>
                    ))}
                  </Select>
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
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          {/* Action Buttons */}
          {!isLoading && (
            <Box>
              <Box>
                <Button colorScheme="blue" onClick={onSubmit}>
                  Send Allowance
                </Button>
              </Box>
            </Box>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

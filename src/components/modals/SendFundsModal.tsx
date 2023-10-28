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
import { useEffect, useState } from "react";
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
  const [tokenBalance, setTokenBalance] = useState(0);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const [amountToExchange, setAmountToExchange] = useState("");

  //=============================================================================
  //                               HOOKS
  //=============================================================================
  const { defiDollarsContractInstance } = useContractStore(
    (state) => ({
      defiDollarsContractInstance: state.defiDollarsContractInstance,
    }),
    shallow
  );

  const { userDetails, familyMembers } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
      familyMembers: state.familyMembers,
    }),
    shallow
  );

  const toast = useToast();

  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });

  useEffect(() => {
    const defiDollarsBalance = async () => {
      const balance = await defiDollarsContractInstance?.balanceOf(
        userDetails.wallet
      );
      setTokenBalance(Number(ethers.utils.formatEther(balance)));
    };

    defiDollarsBalance();
  }, [isLoading]);

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================

  const performExchange = async () => {
    if (!amountToExchange) {
      toast({
        title: "Please enter an amount",
        status: "error",
      });
      return;
    }

    try {
      setIsLoading(true);

      setActiveStep(0);

      const tx = (await defiDollarsContractInstance?.deposit({
        value: ethers.utils.parseEther(amountToExchange),
      })) as TransactionResponse;

      setActiveStep(1);
      await tx.wait();

      setShowExchangeDialog(false);

      toast({
        title: "Exchange successful",
        status: "success",
      });
      setIsLoading(false);
      setAmountToExchange("");
    } catch (e) {
      const errorDetails = transactionErrors(e);
      toast(errorDetails);
      setIsLoading(false);
      setAmountToExchange("");
    }
  };

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

      setShowExchangeDialog(false);

      toast({
        title: "Allowance sent",
        status: "success",
      });
      setAmount("");
      setMemberAddress("");

      setIsLoading(false);
    } catch (e) {
      const errorDetails = transactionErrors(e);
      toast(errorDetails);
      setIsLoading(false);
      setAmountToExchange("");
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
          <Heading fontSize="sm">
            {!showExchangeDialog
              ? "Send Allowance"
              : "Exchange ETH for Defi Dollars"}
          </Heading>
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
              <Text fontSize="xs" mt="3">
                All members require Defi Dollars. You need to exchange your ETH
                for Defi Dollars before you can send funds.
              </Text>
            </Box>
          )}

          {/* Exchange */}
          {!isLoading && showExchangeDialog && (
            <Box>
              <Text fontSize="xs" my="3">
                Defi Dollars are tokens that are used by members to interact
                with the features of the platform. You can exchange your ETH for
                Defi Dollars at a rate of 1:1.
              </Text>

              <FormControl>
                <Input
                  placeholder="Amount to exchange"
                  value={amountToExchange}
                  onChange={(e) => setAmountToExchange(e.target.value)}
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
          {/* Action Buttons */}
          {!isLoading && (
            <Box>
              {!showExchangeDialog ? (
                <Box>
                  <Button
                    colorScheme="black"
                    variant="outline"
                    mr="3"
                    onClick={() => setShowExchangeDialog(true)}
                  >
                    Exchange ETH
                  </Button>
                  <Button colorScheme="blue" onClick={onSubmit}>
                    Send Allowance
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Button
                    colorScheme="red"
                    mr="3"
                    onClick={() => {
                      setShowExchangeDialog(false);
                      setAmountToExchange("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button colorScheme="blue" mr="3" onClick={performExchange}>
                    Perform Exchange
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

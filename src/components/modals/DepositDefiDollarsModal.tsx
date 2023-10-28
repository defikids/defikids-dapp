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
  Link,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  TransactionStepper,
  steps,
} from "@/components/steppers/TransactionStepper";
import shallow from "zustand/shallow";
import { useContractStore } from "@/store/contract/contractStore";
import { useAuthStore } from "@/store/auth/authStore";
import { Explaination, StepperContext } from "@/data-schema/enums";
import { transactionErrors } from "@/utils/errorHanding";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { ethers } from "ethers";
import Logo from "@/components/Logo";
import { DepositDefiDollars } from "@/components/DepositDefiDollars";
import { ExplainDefiDollars } from "@/components/explainations/ExplainDefiDollars";

export const DepositDefiDollarsModal = ({
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
  const [showExplanation, setShowExplanation] = useState(false);
  const [explaination, setExplaination] = useState(Explaination.NONE);

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

  const performDeposit = async () => {
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

  const showDefiDollarsExplaination = () => {
    return (
      <ExplainDefiDollars
        explaination={explaination}
        setShowExplanation={setShowExplanation}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const depositComponent = () => {
    return (
      <>
        {isLoading && (
          <TransactionStepper
            activeStep={activeStep}
            context={StepperContext.DEFAULT}
          />
        )}

        {!isLoading && (
          <DepositDefiDollars
            onClose={onClose}
            setShowExplanation={setShowExplanation}
            setExplaination={setExplaination}
          />
        )}
      </>
    );
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
          <Heading fontSize="sm">Deposit DefiDollars</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {showExplanation ? showDefiDollarsExplaination() : depositComponent()}
        </ModalBody>

        <ModalFooter m={0} p="3px" />
      </ModalContent>
    </Modal>
  );
};

"use client";

import {
  FormControl,
  Input,
  Button,
  useSteps,
  useToast,
  Box,
  Text,
  Flex,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  TransactionStepper,
  steps,
} from "@/components/steppers/TransactionStepper";
import { shallow } from "zustand/shallow";
import { useContractStore } from "@/store/contract/contractStore";
import { Explaination, StepperContext } from "@/data-schema/enums";
import { transactionErrors } from "@/utils/errorHanding";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { ethers } from "ethers";
import NextLink from "next/link";
import DefiDollarsContract from "@/blockchain/defiDollars";

export const DepositDefiDollars = ({
  onClose,
  setShowExplanation,
  setExplaination,
}: {
  onClose: () => void;
  setShowExplanation: (show: boolean) => void;
  setExplaination: (explaination: Explaination) => void;
}) => {
  //=============================================================================
  //                               STATE
  //=============================================================================
  const [isLoading, setIsLoading] = useState(false);
  const [amountToExchange, setAmountToExchange] = useState("");

  //=============================================================================
  //                               HOOKS
  //=============================================================================

  const toast = useToast();

  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================

  const handleDeposit = async () => {
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

      //@ts-ignore
      const provider = new ethers.BrowserProvider(window.ethereum);
      const defiDollarsInstance = await DefiDollarsContract.fromProvider(
        provider
      );
      //!FIX
      const tx = (await defiDollarsInstance?.deposit({
        value: ethers.parseEther(amountToExchange),
      })) as TransactionResponse;

      setActiveStep(1);
      await tx.wait();

      toast({
        title: "Deposit Successful",
        status: "success",
      });
      onClose();
      setIsLoading(false);
      setAmountToExchange("");
    } catch (e) {
      const errorDetails = transactionErrors(e);
      toast(errorDetails);
      setIsLoading(false);
      setAmountToExchange("");
    }
  };

  return (
    <Box>
      {isLoading && (
        <TransactionStepper
          activeStep={activeStep}
          context={StepperContext.DEFAULT}
        />
      )}

      {!isLoading && (
        <Box>
          <Flex direction="row" justify="flex-end" align="center" mb={3}>
            <Text fontSize="xs" ml={3}>
              <Link
                as={NextLink}
                color="blue.500"
                href="#"
                onClick={() => {
                  setExplaination(Explaination.DEFI_DOLLARS);
                  setShowExplanation(true);
                }}
              >
                What is this?
              </Link>
            </Text>
          </Flex>

          <FormControl>
            <Input
              placeholder="Amount to deposit"
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

          <Flex justifyContent="flex-end">
            <Button colorScheme="blue" onClick={handleDeposit} mt={3}>
              Deposit
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

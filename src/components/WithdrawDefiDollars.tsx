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

export const WithdrawDefiDollars = ({
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
  const [amountToWithdraw, setAmountToWithdraw] = useState("");

  //=============================================================================
  //                               HOOKS
  //=============================================================================
  const { defiDollarsContractInstance } = useContractStore(
    (state) => ({
      defiDollarsContractInstance: state.defiDollarsContractInstance,
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

  const handleWithdraw = async () => {
    if (!amountToWithdraw) {
      toast({
        title: "Please enter an amount",
        status: "error",
      });
      return;
    }

    try {
      setIsLoading(true);

      setActiveStep(0);

      const tx = (await defiDollarsContractInstance?.withdraw(
        ethers.parseEther(amountToWithdraw)
      )) as TransactionResponse;

      setActiveStep(1);
      await tx.wait();

      toast({
        title: "Withdraw Successful",
        status: "success",
      });
      onClose();
      setIsLoading(false);
      setAmountToWithdraw("");
    } catch (e) {
      const errorDetails = transactionErrors(e);
      toast(errorDetails);
      setIsLoading(false);
      setAmountToWithdraw("");
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
              placeholder="Amount to withdraw"
              value={amountToWithdraw}
              onChange={(e) => setAmountToWithdraw(e.target.value)}
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
            <Button colorScheme="blue" onClick={handleWithdraw} mt={3}>
              Withdraw
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

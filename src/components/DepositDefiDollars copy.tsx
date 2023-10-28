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
} from "@chakra-ui/react";
import { useState } from "react";
import {
  TransactionStepper,
  steps,
} from "@/components/steppers/TransactionStepper";
import shallow from "zustand/shallow";
import { useContractStore } from "@/store/contract/contractStore";
import { StepperContext } from "@/data-schema/enums";
import { transactionErrors } from "@/utils/errorHanding";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { ethers } from "ethers";

export const DepositDefiDollars = ({ onClose }: { onClose: () => void }) => {
  //=============================================================================
  //                               STATE
  //=============================================================================
  const [isLoading, setIsLoading] = useState(false);
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

      const tx = (await defiDollarsContractInstance?.deposit({
        value: ethers.utils.parseEther(amountToExchange),
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
          <Text fontSize="xs" my="3">
            Defi Dollars are tokens that are used by members to interact with
            the features of the platform. You can exchange your ETH for Defi
            Dollars at a rate of 1:1
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

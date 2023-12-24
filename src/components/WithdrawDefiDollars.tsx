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
import { Explaination, StepperContext } from "@/data-schema/enums";
import { transactionErrors } from "@/utils/errorHanding";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { ethers, SignatureLike } from "ethers";
import NextLink from "next/link";
import DefiDollarsContract from "@/blockchain/DefiDollars";
import { createPermitMessage } from "@/utils/permit";
import { getParentDetailsByUserAccount } from "@/BFF/mongo/getParentDetailsByUserAccount";
import { User } from "@/data-schema/types";
import { IActivity } from "@/models/Activity";
import { convertTimestampToSeconds } from "@/utils/dateTime";
import { createActivity } from "@/services/mongo/routes/activity";
import { useAuthStore } from "@/store/auth/authStore";
import shallow from "zustand/shallow";

type PermitResult = {
  data?: SignatureLike;
  deadline?: number;
  error?: string;
};

export const WithdrawDefiDollars = ({
  onClose,
  setShowExplanation,
  setExplaination,
  user,
}: {
  onClose: () => void;
  setShowExplanation: (show: boolean) => void;
  setExplaination: (explaination: Explaination) => void;
  user: User;
}) => {
  //=============================================================================
  //                               STATE
  //=============================================================================
  const [isLoading, setIsLoading] = useState(false);
  const [amountToWithdraw, setAmountToWithdraw] = useState("");

  //=============================================================================
  //                               HOOKS
  //=============================================================================

  const toast = useToast();

  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });

  const { setRecentActivity } = useAuthStore(
    (state) => ({
      setRecentActivity: state.setRecentActivity,
    }),
    shallow
  );

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================

  const getParentDetails = async (user: User) => {
    const parentDetails = await getParentDetailsByUserAccount(user?.accountId!);
    const parent = parentDetails[0];
    return parent;
  };

  const handlePermit = async () => {
    setActiveStep(0); // set to signing message

    const totalValueToPermit = ethers.parseEther(
      String(+amountToWithdraw.trim())
    );

    // @ts-ignore
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const defiDollarsInstance = await DefiDollarsContract.fromProvider(
      provider
    );

    const parent = await getParentDetails(user);
    const permitDeadline = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days

    const result = (await createPermitMessage(
      signer,
      parent.wallet,
      totalValueToPermit,
      defiDollarsInstance.contract,
      permitDeadline
    )) as PermitResult;

    console.log("result", result);

    return result;
  };

  const handleTransaction = async (
    deadline: number,
    v: number,
    r: string,
    s: string
  ) => {
    setActiveStep(1); // set to approve transaction

    // @ts-ignore
    const provider = new ethers.BrowserProvider(window.ethereum);

    const DefiDollarsInstance = await DefiDollarsContract.fromProvider(
      provider
    );

    const totalValue = ethers.parseEther(String(+amountToWithdraw.trim()));
    const parent = await getParentDetails(user);

    const tx = (await DefiDollarsInstance.withdrawByMember(
      user?.wallet,
      parent?.wallet,
      totalValue,
      deadline,
      v,
      r,
      s
    )) as TransactionResponse;

    return tx;
  };

  const postTransaction = async () => {
    toast({
      title: "Withdraw request submitted.",
      status: "success",
    });

    const newActivities: IActivity[] = [];

    const newActivity = await createActivity({
      accountId: user?.accountId,
      wallet: user?.wallet,
      date: convertTimestampToSeconds(Date.now()),
      type: `Withdraw request submitted.`,
    });

    newActivities.push(newActivity);

    setRecentActivity(newActivities);
    onClose(); // close drawer
    setAmountToWithdraw("");
  };

  const handleWithdraw = async () => {
    // Validate input
    if (!amountToWithdraw) {
      toast({
        title: "Error.",
        description: "No empty fields allowed.",
        status: "error",
      });
      return;
    }

    try {
      setIsLoading(true); // show transaction stepper

      console.log("handleWithdraw");
      console.log("amountToWithdraw", amountToWithdraw);

      const result = (await handlePermit()) as PermitResult;

      if (result.error) {
        throw new Error(result.error);
      }

      const deadline = result.deadline as number;
      const { r, s, v } = result.data as {
        r: string;
        s: string;
        v: number;
      };

      const tx = await handleTransaction(deadline, v, r, s);

      setActiveStep(2); // set to waiting for confirmation
      await tx.wait();

      await postTransaction();
    } catch (e) {
      const errorDetails = transactionErrors(e);
      toast(errorDetails);
      onClose(); // close drawer
      setAmountToWithdraw("");
    }
  };

  return (
    <Box>
      {isLoading && (
        <TransactionStepper
          activeStep={activeStep}
          context={StepperContext.PERMIT}
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
                  setExplaination(Explaination.MEMBER_WITHDRAW);
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

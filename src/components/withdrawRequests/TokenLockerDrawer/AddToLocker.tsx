import {
  TransactionStepper,
  steps,
} from "@/components/steppers/TransactionStepper";
import { useAuthStore } from "@/store/auth/authStore";
import {
  Heading,
  VStack,
  Text,
  Box,
  FormControl,
  Input,
  Button,
  useToast,
  useSteps,
} from "@chakra-ui/react";
import { ethers, SignatureLike, TransactionResponse } from "ethers";
import { useState } from "react";
import shallow from "zustand/shallow";

import { StepperContext } from "@/data-schema/enums";
import { transactionErrors } from "@/utils/errorHanding";
import { createPermitMessage } from "@/utils/permit";
import { convertTimestampToSeconds } from "@/utils/dateTime";
import { createActivity } from "@/services/mongo/routes/activity";
import { IActivity } from "@/models/Activity";
import TokenLockerContract from "@/blockchain/tokenLockers";
import DefiDollarsContract from "@/blockchain/DefiDollars";
import { getSignerAddress } from "@/blockchain/utils";
import { getUserByWalletAddress } from "@/services/mongo/routes/user";

type PermitResult = {
  data?: SignatureLike;
  deadline?: number;
  error?: string;
};

export const AddToLocker = ({
  selectedLocker,
  onClose,
  setFetchLockers,
}: {
  selectedLocker: any;
  onClose: () => void;
  setFetchLockers: (fetchLockers: boolean) => void;
}) => {
  const [amountToLock, setAmountToLock] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const resetState = () => {
    setIsLoading(false);
    setAmountToLock("");
  };

  const handlePermit = async () => {
    setActiveStep(0); // set to signing message

    const totalValueToPermit = ethers.parseEther(String(+amountToLock.trim()));

    // @ts-ignore
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const defiDollarsInstance = await DefiDollarsContract.fromProvider(
      provider
    );

    const tokenLockerInstance = await TokenLockerContract.fromProvider(
      provider
    );

    const result = (await createPermitMessage(
      signer,
      await tokenLockerInstance.contractAddress(),
      totalValueToPermit,
      defiDollarsInstance.contract
    )) as PermitResult;

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

    const TokenLockerInstance = await TokenLockerContract.fromProvider(
      provider
    );

    const totalValue = ethers.parseEther(String(+amountToLock.trim()));

    const tx = (await TokenLockerInstance.addToLocker(
      totalValue,
      selectedLocker.lockerNumber,
      deadline,
      v,
      r,
      s
    )) as TransactionResponse;

    return tx;
  };

  const postTransaction = async () => {
    toast({
      title: "Fund added to locker.",
      status: "success",
    });

    const address = await getSignerAddress();
    const user = await getUserByWalletAddress(address);
    const accountId = user?.accountId;

    const newActivities: IActivity[] = [];

    const newActivity = await createActivity({
      accountId,
      wallet: address,
      date: convertTimestampToSeconds(Date.now()),
      type: `Added additional funds to TokenLocker (${selectedLocker.lockerName})`,
    });

    newActivities.push(newActivity);

    setRecentActivity(newActivities);
    onClose(); // close drawer
    resetState();
    setFetchLockers(true);
  };

  const handleContinue = async () => {
    // Validate input
    if (!amountToLock) {
      toast({
        title: "Error.",
        description: "No empty fields allowed.",
        status: "error",
      });
      return;
    }

    if (+amountToLock === 0) {
      toast({
        title: "Error.",
        description: "You can't lock 0 tokens.",
        status: "error",
      });
      return;
    }

    try {
      setIsLoading(true); // show transaction stepper

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
      resetState();
    }
  };

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Heading fontSize={"xl"} mb={1}>
          Adding To A Locker
        </Heading>
        <Text fontSize={"md"} mb={1}>
          By creating a locker, you will be able to lock your tokens for a
          period of time.
        </Text>

        <Text fontSize={"md"} mb={1}>
          You will by require to permit the Defikids core contract to transfer
          your token on your behalf.
        </Text>

        <FormControl>
          <Input
            disabled={isLoading}
            placeholder="Amount to lock"
            value={amountToLock}
            onChange={(e) => setAmountToLock(e.target.value)}
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
      </VStack>
      <Button
        isDisabled={isLoading}
        mt={4}
        colorScheme="blue"
        onClick={handleContinue}
      >
        Continue
      </Button>

      {isLoading && (
        <Box>
          <Heading fontSize={"xl"} my={5}>
            Updating the Blockchain
          </Heading>
          <TransactionStepper
            activeStep={activeStep}
            context={StepperContext.PERMIT}
          />
        </Box>
      )}
    </Box>
  );
};

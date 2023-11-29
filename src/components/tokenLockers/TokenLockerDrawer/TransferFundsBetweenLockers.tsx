import {
  Heading,
  VStack,
  Text,
  Box,
  FormControl,
  Button,
  useToast,
  useSteps,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { ethers, TransactionResponse } from "ethers";
import shallow from "zustand/shallow";
import { StepperContext } from "@/data-schema/enums";
import { transactionErrors } from "@/utils/errorHanding";
import { convertTimestampToSeconds } from "@/utils/dateTime";
import { createActivity } from "@/services/mongo/routes/activity";
import { IActivity } from "@/models/Activity";
import {
  TransactionStepper,
  steps,
} from "@/components/steppers/TransactionStepper";
import { useAuthStore } from "@/store/auth/authStore";
import TokenLockerContract from "@/blockchain/TokenLockers";

export const TransferFundsBetweenLockers = ({
  selectedLocker,
  onClose,
  setFetchLockers,
}: {
  selectedLocker: any;
  onClose: () => void;
  setFetchLockers: (fetchLockers: boolean) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lockerNumber, setLockerNumber] = useState("");
  const [recipientLockerNumber, setRecipientLockerNumber] = useState("");
  const [amountToTransfer, setAmountToTransfer] = useState("");

  const toast = useToast();

  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });

  const { userDetails, setRecentActivity } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
      setRecentActivity: state.setRecentActivity,
    }),
    shallow
  );

  const resetState = () => {
    setIsLoading(false);
    setLockerNumber("");
    setRecipientLockerNumber("");
    setAmountToTransfer("");
  };

  const handleTransaction = async () => {
    setActiveStep(0); // set to approve transaction

    // @ts-ignore
    const provider = new ethers.BrowserProvider(window.ethereum);

    const tokenLockerInstance = await TokenLockerContract.fromProvider(
      provider
    );

    const totalValue = ethers.parseEther(String(+amountToTransfer.trim()));

    const tx = (await tokenLockerInstance.transferFundsBetweenLockers(
      +lockerNumber,
      +recipientLockerNumber,
      totalValue
    )) as TransactionResponse;

    return tx;
  };

  const postTransaction = async () => {
    toast({
      title: "Transfer Successful.",
      status: "success",
    });

    const address = userDetails.wallet;
    const accountId = userDetails?.accountId;

    const newActivities: IActivity[] = [];

    const newActivity = await createActivity({
      accountId,
      wallet: address,
      date: convertTimestampToSeconds(Date.now()),
      type: `Transferred funds from TokenLocker (${lockerNumber}) to TokenLocker (${recipientLockerNumber})`,
    });

    newActivities.push(newActivity);

    setRecentActivity(newActivities);
    onClose(); // close drawer
    resetState();
    setFetchLockers(true);
  };

  const handleContinue = async () => {
    // Validate input
    if (!lockerNumber || !recipientLockerNumber || !amountToTransfer) {
      toast({
        title: "Error.",
        description: "No empty fields allowed.",
        status: "error",
      });
      return;
    }

    try {
      setIsLoading(true); // show transaction stepper

      const tx = await handleTransaction();

      setActiveStep(1); // set to waiting for confirmation
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
          Transferring funds between lockers
        </Heading>
        <Text fontSize={"md"} mb={1}>
          When you transfer funds between lockers it allows you to move funds to
          a different locker.
        </Text>

        <Text fontSize={"md"} mb={1}>
          You will only be able to transfer funds from unlocked lockers.
        </Text>
        <FormControl>
          <Input
            disabled={isLoading}
            placeholder="From Locker Number"
            value={lockerNumber}
            onChange={(e) => setLockerNumber(e.target.value)}
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
        <FormControl>
          <Input
            disabled={isLoading}
            placeholder="To Locker Number"
            value={recipientLockerNumber}
            onChange={(e) => setRecipientLockerNumber(e.target.value)}
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
        <FormControl>
          <Input
            disabled={isLoading}
            placeholder="Amount to transfer"
            value={amountToTransfer}
            onChange={(e) => setAmountToTransfer(e.target.value)}
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
            context={StepperContext.DEFAULT}
          />
        </Box>
      )}
    </Box>
  );
};

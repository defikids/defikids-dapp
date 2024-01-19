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
import { useState } from "react";
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
import shallow from "zustand/shallow";
import { TransactionResponse, ethers } from "ethers";
import TokenLockerContract from "@/blockchain/tokenLockers";
import { getSignerAddress } from "@/blockchain/utils";
import { getUserByWalletAddress } from "@/services/mongo/routes/user";

export const RemoveFromLocker = ({
  selectedLocker,
  onClose,
  setFetchLockers,
}: {
  selectedLocker: any;
  onClose: () => void;
  setFetchLockers: (fetchLockers: boolean) => void;
}) => {
  const [amountToRemove, setAmountToRemove] = useState("");
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
    setAmountToRemove("");
  };

  const handleTransaction = async () => {
    setActiveStep(0); // set to approve transaction

    // @ts-ignore
    const provider = new ethers.BrowserProvider(window.ethereum);

    const tokenLockerInstance = await TokenLockerContract.fromProvider(
      provider
    );

    const totalValue = ethers.parseEther(String(+amountToRemove.trim()));

    const tx = (await tokenLockerInstance.removeFromLocker(
      selectedLocker.lockerNumber,
      totalValue
    )) as TransactionResponse;

    return tx;
  };

  const postTransaction = async () => {
    toast({
      title: "Fund removed from locker.",
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
      type: `Removed funds from TokenLocker (${selectedLocker.lockerName})`,
    });

    newActivities.push(newActivity);

    setRecentActivity(newActivities);
    onClose(); // close drawer
    resetState();
    setFetchLockers(true);
  };

  const handleContinue = async () => {
    // Validate input
    if (!amountToRemove) {
      toast({
        title: "Error.",
        description: "No empty fields allowed.",
        status: "error",
      });
      return;
    }

    // check if locktime is greater than now
    if (selectedLocker.lockTimeRemaining > 0) {
      toast({
        title: "Error.",
        description:
          "Cannot remove funds from a locker that is currently locked.",
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
          Removing From A Locker
        </Heading>
        <Text fontSize={"md"} mb={1}>
          By removing funds from a locker, you will be able to transfer them
          freely.
        </Text>

        <Text fontSize={"md"} mb={1}>
          You will only be able to remove funds from a locker if it is unlocked.
        </Text>

        <FormControl>
          <Input
            placeholder="Amount to remove"
            value={amountToRemove}
            onChange={(e) => setAmountToRemove(e.target.value)}
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

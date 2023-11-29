import {
  Heading,
  VStack,
  Text,
  Box,
  Button,
  useToast,
  useSteps,
} from "@chakra-ui/react";
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
import { useState } from "react";
import TokenLockerContract from "@/blockchain/TokenLockers";

export const DeleteLocker = ({
  selectedLocker,
  onClose,
  setFetchLockers,
}: {
  selectedLocker: any;
  onClose: () => void;
  setFetchLockers: (fetchLockers: boolean) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

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
  };

  const handleTransaction = async () => {
    setActiveStep(0); // set to approve transaction

    // @ts-ignore
    const provider = new ethers.BrowserProvider(window.ethereum);

    const tokenLockerInstance = await TokenLockerContract.fromProvider(
      provider
    );

    const tx = (await tokenLockerInstance.deleteLocker(
      selectedLocker.lockerNumber
    )) as TransactionResponse;

    return tx;
  };

  const postTransaction = async () => {
    toast({
      title: "Locker emptied.",
      status: "success",
    });

    const address = userDetails.wallet;
    const accountId = userDetails?.accountId;

    const newActivities: IActivity[] = [];

    const newActivity = await createActivity({
      accountId,
      wallet: address,
      date: convertTimestampToSeconds(Date.now()),
      type: `Deleted TokenLocker (${selectedLocker.lockerName})`,
    });

    newActivities.push(newActivity);

    setRecentActivity(newActivities);
    onClose(); // close drawer
    resetState();
    setFetchLockers(true);
  };

  const handleContinue = async () => {
    if (selectedLocker.amount > 0) {
      toast({
        status: "error",
        description:
          "Cannot delete locker. Locker still has funds in it. Please empty the locker first.",
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
          Deleting A Locker
        </Heading>
        <Text fontSize={"md"} mb={1}>
          By deleting a locker, you will be removing all funds from the locker
          and the locker will be deleted from the blockchain.
        </Text>

        <Text fontSize={"md"} mb={1}>
          You will not be able to delete a locker if it is still locked or if it
          contains funds.
        </Text>
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

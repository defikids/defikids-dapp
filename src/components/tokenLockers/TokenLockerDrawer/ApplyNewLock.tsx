import {
  Heading,
  VStack,
  Text,
  Box,
  FormControl,
  Button,
  Select,
  useToast,
  useSteps,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { MdArrowDropDown } from "react-icons/md";
import { ethers, TransactionResponse } from "ethers";
import shallow from "zustand/shallow";
import { tokenLockersContractInstance } from "@/blockchain/instances";
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

export const ApplyNewLock = ({
  selectedLocker,
  onClose,
  setFetchLockers,
}: {
  selectedLocker: any;
  onClose: () => void;
  setFetchLockers: (fetchLockers: boolean) => void;
}) => {
  const [lockTime, setLockTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const ref = useRef<HTMLSelectElement>(null);

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

  const DAY_IN_SECONDS = 86400;

  const locktimes = [
    {
      value: 7 * DAY_IN_SECONDS,
      label: "7 days",
    },
    {
      value: 14 * DAY_IN_SECONDS,
      label: "14 days",
    },
    {
      value: 30 * DAY_IN_SECONDS,
      label: "30 days",
    },
    {
      value: 60 * DAY_IN_SECONDS,
      label: "60 days",
    },
    {
      value: 90 * DAY_IN_SECONDS,
      label: "90 days",
    },
  ];

  const resetState = () => {
    setIsLoading(false);
    setLockTime("");
    if (ref.current) ref.current.value = "";
  };

  const handleTransaction = async () => {
    setActiveStep(0); // set to approve transaction

    // @ts-ignore
    const provider = new ethers.BrowserProvider(window.ethereum);
    const tokenLockerContract = await tokenLockersContractInstance(provider);

    const tx = (await tokenLockerContract.applyNewLock(
      selectedLocker.lockerNumber,
      lockTime
    )) as TransactionResponse;

    return tx;
  };

  const postTransaction = async () => {
    toast({
      title: "Applied new lock time.",
      status: "success",
    });

    const address = userDetails.wallet;
    const accountId = userDetails?.accountId;

    const newActivities: IActivity[] = [];

    const newActivity = await createActivity({
      accountId,
      wallet: address,
      date: convertTimestampToSeconds(Date.now()),
      type: `Applied new lock time to TokenLocker (${selectedLocker.lockerName})`,
    });

    newActivities.push(newActivity);

    setRecentActivity(newActivities);
    onClose(); // close drawer
    resetState();
    setFetchLockers(true);
  };

  const handleContinue = async () => {
    // Validate input
    if (!lockTime) {
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
          "Cannot apply new lock time to a locker that is already locked.",
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
          Applying a lock
        </Heading>
        <Text fontSize={"md"} mb={1}>
          When you apply a lock, you are locking your tokens for a set period of
          time.
        </Text>

        <Text fontSize={"md"} mb={1}>
          You will only be able to withdraw your tokens once the lock time has
          expired.
        </Text>
        <FormControl>
          <Select
            ref={ref}
            disabled={isLoading}
            placeholder="Select lock time"
            style={{
              border: "1px solid lightgray",
            }}
            icon={<MdArrowDropDown />}
            onChange={(e) => {
              const selectedLockTime = e.target.value;
              setLockTime(selectedLockTime);
            }}
          >
            {locktimes.map((locktime) => (
              <option key={locktime.value} value={locktime.value}>
                {locktime.label}
              </option>
            ))}
          </Select>
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

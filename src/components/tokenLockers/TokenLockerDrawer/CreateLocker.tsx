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
  Select,
  Center,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import shallow from "zustand/shallow";
import {
  TransactionStepper,
  steps,
} from "@/components/steppers/TransactionStepper";
import { SignatureLike, TransactionResponse, ethers } from "ethers";
import { createTokenLockersPermitMessage } from "@/utils/permit";
import { createActivity } from "@/services/mongo/routes/activity";
import { convertTimestampToSeconds } from "@/utils/dateTime";
import { useAuthStore } from "@/store/auth/authStore";
import { IActivity } from "@/models/Activity";
import { transactionErrors } from "@/utils/errorHanding";
import { MdArrowDropDown } from "react-icons/md";
import { locktimes } from "@/utils/tokenLockerLockTimes";

import { StepperContext } from "@/data-schema/enums";
import TokenLockerContract from "@/blockchain/TokenLockers";
import DefiDollarsContract from "@/blockchain/defiDollars";

type PermitResult = {
  data?: SignatureLike;
  deadline?: number;
  error?: string;
};

export const CreateLocker = ({
  onClose,
  setFetchLockers,
}: {
  onClose: () => void;
  setFetchLockers: (fetchLockers: boolean) => void;
}) => {
  const [lockerName, setLockerName] = useState("");
  const [amountToLock, setAmountToLock] = useState("");
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

  const resetState = () => {
    setIsLoading(false);
    setAmountToLock("");
    setLockerName("");
    setLockTime("");
    if (ref.current) ref.current.value = "";
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

    const result = (await createTokenLockersPermitMessage(
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

    const tokenLockerInstance = await TokenLockerContract.fromProvider(
      provider
    );

    const totalValue = ethers.parseEther(String(+amountToLock.trim()));

    const tx = (await tokenLockerInstance.createLocker(
      lockerName,
      totalValue,
      +lockTime,
      deadline,
      v,
      r,
      s
    )) as TransactionResponse;

    return tx;
  };

  const postTransaction = async () => {
    toast({
      title: "Locker Successful Created",
      status: "success",
    });

    const address = userDetails.wallet;
    const accountId = userDetails?.accountId;

    const newActivities: IActivity[] = [];

    const newActivity = await createActivity({
      accountId,
      wallet: address,
      date: convertTimestampToSeconds(Date.now()),
      type: `Created TokenLocker (${lockerName})`,
    });

    newActivities.push(newActivity);

    setRecentActivity(newActivities);
    onClose(); // close drawer
    resetState();
    setFetchLockers(true);
  };

  const handleContinue = async () => {
    // Validate input
    if (!lockerName || !amountToLock || !lockTime) {
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
      resetState();
    }
  };

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Heading fontSize={"xl"} mb={1}>
          Creating A Locker
        </Heading>
        <Text fontSize={"md"} mb={1}>
          When creating a locker, you acknowledge your your tokens will be
          locked for a set period of time.
        </Text>

        <Text fontSize={"md"} mb={1}>
          You as the signer acknowledge that Defikids will be permitted to
          transfer your token on your behalf.
        </Text>
        <FormControl>
          <Input
            disabled={isLoading}
            placeholder="Locker Name"
            value={lockerName}
            onChange={(e) => setLockerName(e.target.value)}
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
        <FormControl>
          <Select
            disabled={isLoading}
            ref={ref}
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
            {locktimes.map((locktime, i) => (
              <option key={locktime.value + i} value={locktime.value}>
                {locktime.label}
              </option>
            ))}
          </Select>
        </FormControl>
      </VStack>
      <Button
        my={4}
        colorScheme="blue"
        onClick={handleContinue}
        isDisabled={isLoading}
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

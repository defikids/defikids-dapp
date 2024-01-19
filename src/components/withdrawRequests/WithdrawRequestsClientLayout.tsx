"use client";

import {
  Center,
  Box,
  Heading,
  Text,
  Container,
  Button,
  Flex,
  useDisclosure,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Thead,
  Tr,
  Th,
  Td,
  useSteps,
  useToast,
} from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { useCallback, useState, useEffect } from "react";
import { TransactionResponse, ethers } from "ethers";
import { watchNetwork, getNetwork } from "@wagmi/core";

import { getSignerAddress } from "@/blockchain/utils";
import DefiDollarsContract from "@/blockchain/DefiDollars";
import { validChainId } from "@/config";
import {
  convertTimestampToSeconds,
  formatDateToIsoString,
} from "@/utils/dateTime";
import { WithdrawSettlementModal } from "@/components/modals/WithdrawSettlementModal";
import { useAuthStore } from "@/store/auth/authStore";
import shallow from "zustand/shallow";
import {
  deleteRequest,
  getAllWithdrawRequestsByAccountId,
} from "@/services/mongo/routes/withdraw-request";
import { createActivity } from "@/services/mongo/routes/activity";
import { transactionErrors } from "@/utils/errorHanding";
import { IActivity } from "@/models/Activity";
import { steps } from "@/components/steppers/TransactionStepper";
import { getUserByWalletAddress } from "@/services/mongo/routes/user";

export const WithdrawRequestsClientLayout = ({
  memberAddress,
}: {
  memberAddress: string;
}) => {
  const [requests, setRequests] = useState([]);
  const [isValidChain, setIsValidChain] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getRequests = useCallback(async () => {
    const user = await getUserByWalletAddress(memberAddress);
    const dbRequests = await getAllWithdrawRequestsByAccountId(user.accountId);
    setRequests(dbRequests);
  }, [memberAddress]);

  useEffect(() => {
    getRequests();
  }, [getRequests]);

  const { address: connectedAddress } = useAccount();
  const { isOpen, onOpen, onClose } = useDisclosure();
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

  const checkCurrentChain = useCallback(() => {
    const { chain } = getNetwork();
    if (chain?.id !== validChainId) {
      setIsValidChain(false);
      return false;
    }
    setIsValidChain(true);
    return true;
  }, []);

  watchNetwork((network) => {
    validChainId === network.chain?.id
      ? setIsValidChain(true)
      : setIsValidChain(false);
  });

  const resetState = () => {
    setIsLoading(false);
  };

  const postTransaction = async (request) => {
    toast({
      title: "Withdraw Settled.",
      status: "success",
    });

    const address = await getSignerAddress();
    await deleteRequest(request._id);
    const accountId = request?.accountId;

    const newActivities: IActivity[] = [];

    const newActivity = await createActivity({
      accountId,
      wallet: address,
      date: convertTimestampToSeconds(Date.now()),
      type: `Settled ${request.value} USDC to ${request.owner}`,
    });

    newActivities.push(newActivity);

    setRecentActivity(newActivities);
    onClose(); // close drawer
    resetState();
  };

  const handleTransaction = async (request) => {
    setActiveStep(0); // set to approve transaction

    const { owner, value, deadline, v, r, s } = request;

    //@ts-ignore
    const provider = new ethers.BrowserProvider(window.ethereum);
    const defiDollarsInstance = await DefiDollarsContract.fromProvider(
      provider
    );

    const amountToSettle = ethers.parseEther(String(+value.trim()));

    const tx = (await defiDollarsInstance.settlement(
      owner,
      amountToSettle,
      deadline,
      v,
      r,
      s
    )) as TransactionResponse;

    return tx;
  };

  const handleSettlement = async (request: any) => {
    try {
      setIsLoading(true); // show transaction stepper
      const tx = await handleTransaction(request);
      setActiveStep(1); // set to waiting for confirmation
      await tx.wait();

      await postTransaction(request);
    } catch (e) {
      const errorDetails = transactionErrors(e);
      toast(errorDetails);
      onClose();
      resetState();
    }
  };

  const getTotalRequestedValue = () => {
    let total = 0;
    (requests || []).map((request: any) => {
      total += +request.value;
    });
    return total || 0;
  };

  return (
    <Box>
      <WithdrawSettlementModal
        isOpen={isLoading}
        onClose={onClose}
        activeStep={activeStep}
      />
      {connectedAddress === memberAddress ? (
        <>
          <Flex justifyContent="center" alignItems="center" mx={5}>
            <Container h="90%" mx={5} py={4} borderRadius={"xl"} maxW={"5xl"}>
              <Flex
                justifyContent="space-between"
                alignItems="center"
                mb={5}
                pb={5}
                borderBottom={"1px"}
              >
                <Heading size="md">Withdraw Requests</Heading>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center">
                <Stat>
                  <StatLabel textAlign="center">Requests</StatLabel>
                  <StatNumber textAlign="center">
                    {requests?.length || 0}
                  </StatNumber>
                </Stat>
                <Stat>
                  <StatLabel textAlign="center">
                    {" "}
                    Total Withdraw Value
                  </StatLabel>
                  <StatNumber textAlign="center">
                    {getTotalRequestedValue() || 0} USDC
                  </StatNumber>
                </Stat>
              </Flex>
            </Container>
          </Flex>
          {/* Request Table */}
          <Container maxW="5xl" h="90%" mx="auto" py={4} borderRadius="xl">
            <Table
              variant="simple"
              size="sm"
              colorScheme="blue"
              borderRadius="xl"
            >
              <Thead>
                <Tr>
                  <Th>Amount</Th>
                  <Th>Request Date</Th>
                  <Th>Deadline Date</Th>
                  <Th>Status</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {requests
                  .sort(
                    (a: any, b: any) =>
                      b.deadline - a.deadline || b.requestDate - a.requestDate
                  )
                  .map((request: any) => (
                    <Tr key={request._id}>
                      <Td>{request.value}</Td>
                      <Td>{formatDateToIsoString(request.requestDate)}</Td>
                      <Td>
                        {request.deadline
                          ? formatDateToIsoString(request.deadline)
                          : "-"}
                      </Td>
                      <Td>{request.status}</Td>
                      <Td>
                        {request.deadline && request.deadline > Date.now() ? (
                          <Button
                            size="xs"
                            colorScheme="blue"
                            onClick={() => handleSettlement(request)}
                          >
                            Settle
                          </Button>
                        ) : (
                          <Button
                            size="xs"
                            colorScheme="red"
                            onClick={async () => {
                              await deleteRequest(request._id);
                              await getRequests();
                              toast({
                                title: "Withdraw Request Deleted.",
                                status: "success",
                              });
                            }}
                          >
                            Expired / Delete
                          </Button>
                        )}
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </Container>
        </>
      ) : (
        <Container mt="20rem" maxW="5xl" h="90%">
          <Center height="100%">
            <Heading fontSize={"6xl"}>401</Heading>
          </Center>
          <Center mt="1rem" height="100%">
            <Text fontSize={"2xl"}>
              You are not authorized to view this page
            </Text>
          </Center>
        </Container>
      )}
    </Box>
  );
};

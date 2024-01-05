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
} from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { TokenLockerDrawer } from "@/components/tokenLockers/TokenLockerDrawer";
import { TokenLockerFunctions } from "@/data-schema/enums";
import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { TokenLockerCard } from "@/components/tokenLockers/TokenLockerCard";
import { watchNetwork, getNetwork } from "@wagmi/core";

import { Locker } from "@/data-schema/types";

import TokenLockerContract from "@/blockchain/tokenLockers";
import { getSignerAddress } from "@/blockchain/utils";
import DefiDollarsContract from "@/blockchain/DefiDollars";
import { StableToken } from "../dashboards/parentDashboard/StableToken";
import { validChainId } from "@/config";
import { formatDateToIsoString } from "@/utils/dateTime";

export const WithdrawRequestsClientLayout = ({
  requests,
  memberAddress,
}: {
  requests: any;
  memberAddress: string;
}) => {
  // const [currentFunction, setCurrentFunction] = useState<TokenLockerFunctions>(
  //   TokenLockerFunctions.NONE
  // );
  // const [lockersByUser, setLockersByUser] = useState<Locker[]>([]);
  // const [fetchLockers, setFetchLockers] = useState<boolean>(false);
  // const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  // const [totalValueInLockers, setTotalValueInLockers] =
  //   useState<number>(totalLockerValue);
  // const [defiDollarsBalance, setDefiDollarsBalance] = useState<number>(0);
  const [isValidChain, setIsValidChain] = useState(false);
  const [stableTokenBalance, setStableTokenBalance] = useState(0);

  const { address: connectedAddress } = useAccount();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getStableTokenBalance = useCallback(async () => {
    const valid = checkCurrentChain();
    if (!valid) return;

    //@ts-ignore
    const provider = new ethers.BrowserProvider(window.ethereum);

    const defiDollarsInstance = await DefiDollarsContract.fromProvider(
      provider
    );
    const userAddress = await getSignerAddress();
    const balance = await defiDollarsInstance?.getStableTokenBalance(
      userAddress
    );
    setStableTokenBalance(balance);
  }, []);

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

  //! TODO
  const handleSettlement = async (request: any) => {};

  const getTotalRequestedValue = () => {
    let total = 0;
    console.log(requests);
    requests.forEach((request: any) => {
      total += +request.value;
    });
    return total || 0;
  };

  return (
    <Box>
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
                {/* <Button
                  colorScheme="blue"
                  size="sm"
                  onClick={() => {
                    setCurrentFunction(TokenLockerFunctions.CREATE_LOCKER);
                    onOpen();
                  }}
                >
                  Create Locker
                </Button> */}
              </Flex>
              <Flex justifyContent="space-between" alignItems="center">
                <Stat>
                  <StatLabel textAlign="center">Requests</StatLabel>
                  <StatNumber textAlign="center">
                    {requests.length || 0}
                  </StatNumber>
                </Stat>
                <Stat>
                  <StatLabel textAlign="center"> Total Value</StatLabel>
                  <StatNumber textAlign="center">
                    {getTotalRequestedValue() || 0} USDC
                  </StatNumber>
                </Stat>
                <Stat>
                  <StatLabel textAlign="center">
                    DefiDollars available
                  </StatLabel>
                  <StatNumber textAlign="center">
                    {stableTokenBalance || 0} USDC
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
                {requests.map((request: any) => (
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
                      <Button
                        size="xs"
                        colorScheme="blue"
                        onClick={() => handleSettlement(request)}
                      >
                        Settle
                      </Button>
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

      {/* Drawer */}
      {/* <TokenLockerDrawer
        isOpen={isOpen}
        onClose={onClose}
        placement={"left"}
        currentFunction={currentFunction}
        setFetchLockers={setFetchLockers}
        selectedLocker={selectedLocker}
        refreshBlockchainData={refreshBlockchainData}
      /> */}
    </Box>
  );
};

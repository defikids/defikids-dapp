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
} from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { TokenLockerDrawer } from "@/components/tokenLockers/TokenLockerDrawer";
import { TokenLockerFunctions } from "@/data-schema/enums";
import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { TokenLockerCard } from "@/components/tokenLockers/TokenLockerCard";
import { Locker } from "@/data-schema/types";
import { defiDollarsContractInstance } from "@/blockchain/instances";
import { formattedLocker } from "@/utils/formatLockers";
import TokenLockerContract from "@/blockchain/tokenLockers";
import { getSignerAddress } from "@/blockchain/utils";

export const TokenLockersMemberLayout = ({
  memberAddress,
  totalLockerOwned,
  totalLockerValue,
}: {
  memberAddress: string;
  totalLockerOwned: number;
  totalLockerValue: number;
}) => {
  const [currentFunction, setCurrentFunction] = useState<TokenLockerFunctions>(
    TokenLockerFunctions.NONE
  );
  const [lockersByUser, setLockersByUser] = useState<Locker[]>([]);
  const [fetchLockers, setFetchLockers] = useState<boolean>(false);
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const [totalValueInLockers, setTotalValueInLockers] =
    useState<number>(totalLockerValue);
  const [defiDollarsBalance, setDefiDollarsBalance] = useState<number>(0);

  const { address: connectedAddress } = useAccount();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const getLockers = async () => {
      //@ts-ignore
      const provider = new ethers.BrowserProvider(window.ethereum);

      const tokenLockerInstance = await TokenLockerContract.fromProvider(
        provider
      );

      const defiDollarsContract = await defiDollarsContractInstance();
      const lockersByUser = await tokenLockerInstance.fetchAllLockersByUser();

      const formattedLockers = lockersByUser.map((locker: Locker) =>
        formattedLocker(locker)
      );

      const balance = await defiDollarsContract.balanceOf(memberAddress);

      setLockersByUser(formattedLockers);
      setDefiDollarsBalance(Number(ethers.formatEther(balance)));
    };
    getLockers();
  }, [fetchLockers]);

  const refreshBlockchainData = useCallback(() => {
    const getLockers = async () => {
      //@ts-ignore
      const provider = new ethers.BrowserProvider(window.ethereum);
      const wallet = await getSignerAddress(provider);

      const tokenLockerInstance = await TokenLockerContract.fromProvider(
        provider
      );

      const lockersByUser = await tokenLockerInstance.fetchAllLockersByUser();

      const totalValue = await tokenLockerInstance.getTotalValueLockedByUser(
        wallet
      );
      const formattedLockers = lockersByUser.map((locker: Locker) =>
        formattedLocker(locker)
      );

      const defiDollarsContract = await defiDollarsContractInstance();
      const balance = await defiDollarsContract.balanceOf(wallet);
      setDefiDollarsBalance(Number(ethers.formatEther(balance)));

      setLockersByUser(formattedLockers);
      setTotalValueInLockers(totalValue.toString());
    };
    getLockers();
  }, []);

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
                <Heading size="md">TokenLockers</Heading>
                <Button
                  colorScheme="blue"
                  size="sm"
                  onClick={() => {
                    setCurrentFunction(TokenLockerFunctions.CREATE_LOCKER);
                    onOpen();
                  }}
                >
                  Create Locker
                </Button>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center">
                <Stat>
                  <StatLabel textAlign="center">Lockers</StatLabel>
                  <StatNumber textAlign="center">
                    {totalLockerOwned || 0}
                  </StatNumber>
                </Stat>
                <Stat>
                  <StatLabel textAlign="center"> Total Locked</StatLabel>
                  <StatNumber textAlign="center">
                    {ethers
                      .formatEther(totalValueInLockers.toString())
                      .toString() || 0}{" "}
                    DFD
                  </StatNumber>
                </Stat>
                <Stat>
                  <StatLabel textAlign="center">
                    DefiDollars available
                  </StatLabel>
                  <StatNumber textAlign="center">
                    {defiDollarsBalance || 0} DFD
                  </StatNumber>
                </Stat>
              </Flex>
            </Container>
          </Flex>
          {/* Locker Cards */}
          <Box h="100%" mt={8} mx={5}>
            <Box h="100%">
              <Flex
                flexWrap="wrap"
                justifyContent="center"
                alignItems="center"
                gap={5}
              >
                {lockersByUser?.length > 0 ? (
                  lockersByUser?.map((locker, index) => (
                    <TokenLockerCard
                      key={index}
                      locker={locker}
                      setCurrentFunction={setCurrentFunction}
                      onOpen={onOpen}
                      setSelectedLocker={setSelectedLocker}
                    />
                  ))
                ) : (
                  <Text fontSize={"xl"}>No lockers found</Text>
                )}
              </Flex>
            </Box>
          </Box>
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
      <TokenLockerDrawer
        isOpen={isOpen}
        onClose={onClose}
        placement={"left"}
        currentFunction={currentFunction}
        setFetchLockers={setFetchLockers}
        selectedLocker={selectedLocker}
        refreshBlockchainData={refreshBlockchainData}
      />
    </Box>
  );
};

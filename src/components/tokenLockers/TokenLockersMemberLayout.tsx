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
import { tokenLockersContractInstance } from "@/blockchain/instances";
import { durationInSecondsRemaining, secondsToDays } from "@/utils/dateTime";
import { trimAddress } from "@/utils/web3";

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

  const { address: connectedAddress } = useAccount();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const formattedLocker = (locker: Locker) => {
    return {
      amount: ethers.formatEther(locker[0].toString()),
      lockTime: secondsToDays(locker[1].toString()),
      name: locker[2],
      lockerNumber: locker[3].toString(),
      owner: locker[4],
      lockAppliedAt: locker[5].toString(),
      lockTimeRemaining: durationInSecondsRemaining(
        locker[1].toString(),
        locker[5].toString()
      ),
    };
  };

  useEffect(() => {
    const getLockers = async () => {
      //@ts-ignore
      const provider = new ethers.BrowserProvider(window.ethereum);
      const tokenLockerContract = await tokenLockersContractInstance(provider);
      const lockersByUser = await tokenLockerContract.fetchAllLockersByUser();

      const formattedLockers = lockersByUser.map((locker: Locker) =>
        formattedLocker(locker)
      );

      setLockersByUser(formattedLockers);
    };
    getLockers();
  }, [fetchLockers]);

  const refreshBlockchainData = useCallback(() => {
    const getLockers = async () => {
      //@ts-ignore
      const provider = new ethers.BrowserProvider(window.ethereum);
      const wallet = provider.getSigner().then((signer) => signer.getAddress());

      const tokenLockerContract = await tokenLockersContractInstance(provider);
      const lockersByUser = await tokenLockerContract.fetchAllLockersByUser();

      const totalValue = await tokenLockerContract.getTotalValueLockedByUser(
        wallet
      );
      const formattedLockers = lockersByUser.map((locker: Locker) =>
        formattedLocker(locker)
      );

      console.log("faormatted lockers", formattedLockers);
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
            <Container
              h="90%"
              mx={5}
              py={4}
              borderRadius={"xl"}
              bgColor="gray.700"
              maxW={"5xl"}
            >
              <Flex justifyContent="space-between" alignItems="center" mb={5}>
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
              <Flex justifyContent="space-between" alignItems="center" mx={5}>
                <Stat>
                  <StatLabel>Total Lockers</StatLabel>
                  <StatNumber>{totalLockerOwned || 0}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel> Total Locked Value</StatLabel>
                  <StatNumber>
                    {ethers
                      .formatEther(totalValueInLockers.toString())
                      .toString() || 0}{" "}
                    DFD
                  </StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Owner</StatLabel>
                  <StatNumber>
                    {trimAddress(memberAddress) || "No address found"}
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

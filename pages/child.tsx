import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import Button from "../components/button";
// import { StoreAction, useStore } from "@/services/store";
import { getUSDCXBalance } from "../services/usdcx_contract";
import Plus from "../components/plus";
import Arrow from "../components/arrow";
// import TopUpModal from "../components/topup_modal";
// import WithdrawModal from "../components/withdraw_modal";
import AnimatedNumber from "../components/animated_number";
// import { flowDetails } from "../hooks/useSuperFluid";
import { BigNumber, ethers } from "ethers";
import StakeContract, { IStake, IStakerDetails } from "../services/stake";
// import AllocateModal from "../components/allocate_modal";
// import Allocation from "../components/allocation";
import Logo from "../components/logo";
import { Box, Flex, Heading, VStack, Text, Badge } from "@chakra-ui/react";

const Child: React.FC = () => {
  const [details, setDetails] = useState<IStakerDetails>({
    totalInvested: BigNumber.from(0),
    totalRewards: BigNumber.from(0),
    totalCreatedStakes: BigNumber.from(0),
  });
  const [stakes, setStakes] = useState<IStake[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [netFlow, setNetFlow] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const initStakeContract = async () => {};

  const fetchStakes = async () => {
    try {
      setLoading(true);
      // const newStakes = await stakeContract.fetchStakes();
      // setStakes(newStakes);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  async function fetchStakerDetails(loading = true) {
    try {
      loading && setLoading(true);
      // const details = await stakeContract.fetchStakerDetails();
      setDetails(details);
    } catch (error) {
      console.error(error);
    } finally {
      loading && setLoading(false);
    }
  }

  const updateBalance = () => {
    // getUSDCXBalance(provider, wallet).then((value) => {
    // setBalance(parseFloat(value));
    // });
  };

  // update balance flow
  const updateNetFlow = async () => {
    // const result = await flowDetails(wallet);
    // setNetFlow(parseFloat(ethers.utils.formatEther(result.cfa.netFlow)));
  };
  // useEffect(() => {
  //   if (!provider) {
  //     return;
  //   }
  //   const id = setInterval(() => {
  //     updateBalance();
  //   }, FETCH_BALANCE_INTERVAL);

  //   updateBalance();
  //   updateNetFlow();
  //   return () => clearInterval(id);
  // }, [provider]);

  const handleAllocate = async (transaction: ethers.ContractReceipt) => {
    // fetchStakerDetails(false);
    // fetchStakes();
  };

  const [showAllocate, setShowAllocate] = useState(false);
  const [updateAllocation, setUpdateAllocation] = useState<IStake>();
  const [showTopUp, setShowTopUp] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  // const stakesToShow = useMemo(
  //   () => stakes.filter((s) => s.remainingDays >= 0),
  //   [stakes]
  // );

  return (
    <Box>
      <Heading as="h1" size="2xl" color="blue.700" mb="5vh">
        Welcome Peter
      </Heading>
      <Flex
        bg="blue.900"
        px={6}
        py={8}
        rounded="xl"
        color="white"
        justify="space-between"
        alignItems="flex-end"
      >
        <VStack align="start">
          <Text fontSize="sm" mb={1}>
            AVAILABLE FUNDS
          </Text>
          <Heading size="2xl" mb={6} display="flex" alignItems="flex-end">
            {/* {balance ? <AnimatedNumber value={balance} rate={netFlow} /> : 0} */}
            <Text fontSize="base" ml={2}>
              USDx
            </Text>
          </Heading>
          <Image
            src="https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=018"
            alt="USDC logo"
            width={48}
            height={48}
          />
        </VStack>
        <Flex style={{ height: 130 }}>
          <Button
            size="lg"
            onClick={() => setShowTopUp(true)}
            style={{ marginRight: 20, borderRadius: 100 }}
          >
            <Flex align="center">
              <Text mr={6}>Top up account</Text>
              {/* <ArrowRightIcon /> */}
            </Flex>
          </Button>
          <Button
            size="lg"
            onClick={() => setShowWithdraw(true)}
            style={{
              marginRight: 20,
              borderRadius: 100,
              backgroundColor: "#47a1b5",
            }}
          >
            <Flex align="center">
              <Text mr={6}>Withdraw funds</Text>
              {/* <ArrowDownIcon /> */}
            </Flex>
          </Button>
        </Flex>
      </Flex>
      <Box rounded="lg" borderWidth={2} borderColor="gray.300" mt={6}>
        <Flex p={6}>
          <Image
            src="/placeholder_child.jpg"
            alt="avatar"
            width={64}
            height={64}
          />
          <Box ml={6}>
            <Flex align="center" mb={2}>
              <Heading color="blue.700" fontSize="lg" mr={3}>
                Peter
              </Heading>
              <Badge colorScheme="blue">Withdraws allowed</Badge>
            </Flex>
          </Box>
        </Flex>
        <Flex borderTopWidth={2} borderColor="gray.300">
          <VStack flex={1} p={4} borderBottomWidth={2} borderColor="gray.300">
            <Text fontSize="sm" mb={1}>
              AVAILABLE FUNDS
            </Text>
            <Heading size="lg">
              {Math.floor(balance)}{" "}
              <Text fontSize="base" as="span">
                USDx
              </Text>
            </Heading>
          </VStack>
          <VStack
            pl={4}
            py={4}
            pb={0}
            flex={1}
            borderLeftWidth={2}
            borderColor="gray.300"
          >
            <Text fontSize="sm">YOUR ALLOCATIONS</Text>
            <Box
              flex={1}
              overflow="auto"
              flexDir="column"
              pb={3}
              pr={4}
              maxH={300}
            >
              {/* {stakesToShow.map((a) => (
              <Flex
                align="center"
                cursor="pointer"
                key={a.name}
                onClick={() => setUpdateAllocation({ ...a })}
              >
                <Allocation className="flex-1" key={a.id} {...a} />
                <Button className="ml-4 bg-blue-oil mt-3 text-base" size="sm">
                  Add funds
                </Button>
              </Flex>
            ))} */}
            </Box>
          </VStack>
        </Flex>
      </Box>
      <Button
        className={`text-sm w-full rounded-md flex justify-end mt-4 ${
          loading && "animate-pulse pointer-events-none"
        }`}
        onClick={() => setShowAllocate(true)}
      >
        <Flex align="center">
          {/* <AddIcon /> */}
          <Text ml={6} fontWeight="medium" fontSize="base">
            Allocate your funds
          </Text>
        </Flex>
      </Button>
      {/* Add AllocateModal, TopUpModal, and WithdrawModal components */}
    </Box>
  );
};

export default Child;

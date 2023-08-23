import { BigNumber, ethers } from "ethers";
import React, { useEffect, useMemo, useState } from "react";
import { IChild } from "../services/contract";
import { IStake, IStakeDuration } from "../services/stake";
import { getUSDCXBalance } from "../services/usdcx_contract";
// import Allocation from "./allocation";
import { AiOutlinePlus } from "react-icons/ai";
import { IoIosMore } from "react-icons/io";
import { trimAddress } from "@/lib/web3";

import {
  Box,
  Flex,
  Button,
  Text,
  useBreakpointValue,
  Badge,
  ButtonGroup,
  Container,
  Tooltip,
  useToast,
  Heading,
  Image,
} from "@chakra-ui/react";

// interface IProps extends IChild {
//   details: {
//     totalCreatedStakes: BigNumber;
//     totalInvested: BigNumber;
//     totalRewards: BigNumber;
//   };
//   stakes: IStake[];
//   onTransfer: () => void;
//   onStream: () => void;
// }

export const MOCK_ALLOCATIONS = [
  {
    name: "Playstation 5",
    value: 180,
    duration: 10,
    durationTotal: IStakeDuration.FORTNIGHT,
  },
  {
    name: "New Science Book",
    value: 25,
    duration: 4,
    durationTotal: IStakeDuration.WEEK,
  },
  {
    name: "College fund",
    value: 120,
    duration: 2,
    durationTotal: IStakeDuration.FORTNIGHT,
  },
  {
    name: "Drone",
    value: 200,
    duration: 1,
    durationTotal: IStakeDuration.FORTNIGHT,
  },
];

const Child = ({
  _address,
  username,
  isLocked,
  details,
  stakes = [],
  onTransfer,
  onStream,
}) => {
  const toast = useToast();
  const [balance, setBalance] = useState(0);
  // useEffect(() => {
  //   if (!provider || !_address) {
  //     return;
  //   }
  //   getUSDCXBalance(provider, _address).then((value) => {
  //     setBalance(parseFloat(value));
  //   });
  // }, [provider, _address]);

  const isMobileSize = useBreakpointValue({
    base: true,
    sm: false,
    md: false,
    lg: false,
  });

  const stakesToShow = useMemo(
    () => stakes.filter((s) => s.remainingDays >= 0),
    [stakes]
  );

  return (
    <Container borderRadius="md" overflow="hidden" border="1px solid #E2E8F0">
      <Flex justify={!isLocked && "flex-end"} pt={4} pb={2} alignItems="center">
        {!isLocked && (
          <Badge colorScheme="telegram" size="sm">
            Withdraws allowed
          </Badge>
        )}
      </Flex>

      {/* Profile Header */}
      <Flex pb={6} alignItems="center">
        <Image
          src="/placeholder_child.jpg"
          width={20}
          height={20}
          alt="avatar"
          style={{ borderRadius: "25%" }}
        />
        <Box ml={6}>
          {/* Username */}
          <Flex mb={2}>
            <Text>{username}</Text>
          </Flex>

          <Tooltip label="Click to copy" placement="top">
            <Text
              color="gray"
              cursor="pointer"
              onClick={() => {
                navigator.clipboard.writeText(_address);
                toast({
                  title: "Copied to clipboard",
                  status: "success",
                });
              }}
            >
              {`${isMobileSize ? trimAddress(_address) : _address}`}
            </Text>
          </Tooltip>
        </Box>
      </Flex>

      {/* Action Buttons */}
      <Flex
        justify="flex-start"
        borderTop={2}
        borderBottom={2}
        borderColor={"#E2E8F0"}
      >
        <ButtonGroup>
          {/* Add more funds  */}
          <Button
            borderRadius={0}
            borderRight={2}
            borderColor={"#E2E8F0"}
            boxShadow={"0 0 10px rgba(0,0,0,0.1)"}
            onClick={onTransfer}
          >
            <Flex alignItems="center" padding="0 2px">
              <AiOutlinePlus />
              <span style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                Funds
              </span>
            </Flex>
          </Button>

          {/* Create new stream */}
          <Button
            borderRadius={0}
            borderRight={2}
            borderColor={"#E2E8F0"}
            boxShadow={"0 0 10px rgba(0,0,0,0.1)"}
            onClick={onStream}
          >
            <Flex alignItems="center">
              <AiOutlinePlus />
              <span style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                Stream
              </span>
            </Flex>
          </Button>

          {/* ... */}
          <Button
            borderRadius={0}
            borderRight={2}
            borderColor={"#E2E8F0"}
            boxShadow={"0 0 10px rgba(0,0,0,0.1)"}
          >
            <IoIosMore />
          </Button>
        </ButtonGroup>
      </Flex>

      {/* Allocations */}
      <Box mt={4}>
        <hr />

        <Flex direction="column" textColor={"#E2E8F0"}>
          {/* Available Funds */}
          <Flex
            direction="column"
            justify="space-between"
            alignItems="center"
            p={4}
          >
            <Text fontSize="sm" w="100%">
              AVAILABLE FUNDS
            </Text>
            <Flex justify="flex-end" w="100%">
              <Heading size="xl" pr={2}>
                {/* {parseFloat(balance.toFixed(2))} */}
                23.999
              </Heading>
              <Text pt={2}> USDx</Text>
            </Flex>
          </Flex>

          <hr />

          {/* Invested Funds */}
          <Flex
            direction="column"
            justify="space-between"
            alignItems="center"
            p={4}
          >
            <Text fontSize="sm" w="100%">
              INVESTED FUNDS
            </Text>
            <Flex justify="flex-end" w="100%">
              <Heading size="xl" pr={2}>
                {/* {parseFloat(
                ethers.utils.formatEther(details?.totalInvested ?? 0)
              )} */}
                453.294
              </Heading>
              <Text pt={2}> USDx</Text>
            </Flex>
          </Flex>

          <hr />

          {/* Total Rewards */}
          <Flex
            direction="column"
            justify="space-between"
            alignItems="center"
            p={4}
          >
            <Text fontSize="sm" w="100%">
              TOTAL REWARDS
            </Text>
            <Flex justify="flex-end" w="100%">
              <Heading size="xl" pr={2}>
                {/* {parseFloat(ethers.utils.formatEther(details?.totalRewards ?? 0))} */}
                34
              </Heading>
              <Text pt={2}> USDx</Text>
            </Flex>
          </Flex>

          <hr />
        </Flex>

        <Flex direction="column" textColor={"#E2E8F0"} pl={4} py={4} pb={0}>
          <Text fontSize="sm">STAKED FUNDS</Text>

          <Flex
            flex={1}
            justify="center"
            align="center"
            flexDirection="column"
            py={6}
          >
            {stakesToShow.length === 0 ? (
              <Heading size="sm">No active stakes</Heading>
            ) : (
              <Button
                variant="outline"
                colorScheme="blue"
                size="sm"
                onClick={() => {
                  // setIsShowingAllAllocations(!isShowingAllAllocations);
                }}
              >
                Show Staking Allocations
              </Button>
            )}
          </Flex>
        </Flex>
      </Box>
    </Container>
  );
};

export default Child;

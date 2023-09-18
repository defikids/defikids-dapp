"use client";
/* eslint-disable react/no-children-prop */

import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
  useSteps,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import shallow from "zustand/shallow";
import { useAuthStore } from "@/store/auth/authStore";
import { useContractStore } from "@/store/contract/contractStore";
import { User } from "@/data-schema/types";
import { steps } from "@/components/steppers/TransactionStepper";
import axios from "axios";
import { UsernameModal } from "@/components/modals/UsernameModal";
import { ParentDashboardTabs } from "@/data-schema/enums";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { InfoModal } from "@/components/modals/InfoModal";
import BackgroundDefaults from "@/components/modals/BackgroundDefaults";
import { ExpandedDashboardMenu } from "@/components/ExpandedDashboardMenu";
import { CollapsedDashboardMenu } from "@/components/CollapsedDashboardMenu";
import { useWindowSize } from "usehooks-ts";

import { EtherscanModal } from "@/components/modals/EtherscanModal";
import MemberTable from "@/components/parentDashboard/MemberTable";
import { SendFundsModal } from "@/components/modals/SendFundsModal";
import { NetworkModal } from "@/components/modals/NetworkModal";
import StakingContracts from "@/components/parentDashboard/StakingContracts";
import StatsTable from "@/components/parentDashboard/StatsTable";
import { MembersTableModal } from "@/components/modals/MembersTableModal";

const Parent: React.FC = () => {
  //=============================================================================
  //                               STATE
  //=============================================================================

  const [childKey, setChildKey] = useState<number>(0);
  const [childrenLoading, setChildrenLoading] = useState(false);
  const [children, setChildren] = useState([]);
  const [childrenStakes, setChildrenStakes] = useState({});
  // const [stakeContract, setStakeContract] = useState<StakeContract>();
  const [familyDetails, setFamilyDetails] = useState({} as User);

  const [selectedTab, setSelectedTab] = useState<ParentDashboardTabs>(
    ParentDashboardTabs.DASHBOARD
  );
  const [cardOpacity, setCardOpacity] = useState(0);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0);

  //=============================================================================
  //                               HOOKS
  //=============================================================================

  const { userDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
    }),
    shallow
  );

  const { connectedSigner } = useContractStore(
    (state) => ({
      connectedSigner: state.connectedSigner,
    }),
    shallow
  );

  const { width, height } = useWindowSize();

  const isMobileSize = width < 768;

  const { isOpen: isOpenExtendedMenu, onToggle: onToggleExtendedMenu } =
    useDisclosure();

  const { isOpen: isOpenCollapsedMenu, onToggle: onToggleCollapsedMenu } =
    useDisclosure();

  const {
    isOpen: isAddChildOpen,
    onOpen: onAddChildOpen,
    onClose: onAddChildClose,
  } = useDisclosure();

  const {
    isOpen: isOpenEtherScan,
    onOpen: onOpenEtherScan,
    onClose: onCloseEtherScan,
  } = useDisclosure();

  const {
    isOpen: isOpenChildDetails,
    onOpen: onOpenChildDetails,
    onClose: onCloseChildDetails,
  } = useDisclosure();

  const {
    isOpen: isChangeUsernameOpen,
    onOpen: onChangeUsernameOpen,
    onClose: onChangeUsernameClose,
  } = useDisclosure();

  const {
    isOpen: isOpenBackgroundDefaults,
    onOpen: onOpenBackgroundDefaults,
    onClose: onCloseBackgroundDefaults,
  } = useDisclosure();

  const {
    isOpen: isOpenSettingsModal,
    onOpen: onOpenSettingsModal,
    onClose: onCloseSettingsModal,
  } = useDisclosure();

  const {
    isOpen: isOpenInfoModal,
    onOpen: onOpenInfoModal,
    onClose: onCloseInfoModal,
  } = useDisclosure();

  const {
    isOpen: isOpenSendFundsModal,
    onOpen: onOpenSendFundsModal,
    onClose: onCloseSendFundsModal,
  } = useDisclosure();

  const {
    isOpen: isOpenNetworkModal,
    onOpen: onOpenNetworkModal,
    onClose: onCloseNetworkModal,
  } = useDisclosure();

  const {
    isOpen: isOpenMembersTableModal,
    onOpen: onOpenMembersTableModal,
    onClose: onCloseMembersTableModal,
  } = useDisclosure();

  useEffect(() => {
    fetchFamilyDetails();
    fetchChildren();
  }, []);

  // useEffect(() => {
  //   if (!stakeContract || !children.length) {
  //     setChildrenStakes({});
  //     return;
  //   }
  // }, [stakeContract, children]);

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================

  const fetchFamilyDetails = useCallback(async () => {
    if (!userDetails?.wallet) return;

    const { data } = await axios.get(
      `/api/vercel/get-json?key=${userDetails?.wallet}`
    );

    const user = data as User;
    setFamilyDetails(user);
  }, [userDetails?.wallet]);

  const fetchChildren = useCallback(async () => {
    const getChildren = async () => {
      if (!userDetails?.wallet) return;

      const children = [] as User[];

      familyDetails.children?.forEach(async (walletAddress) => {
        const { data } = await axios.get(
          `/api/vercel/get-json?key=${walletAddress}`
        );

        children.push(data as User);
      });

      if (children.length) {
        const childrenWalletBalances = await axios.post(
          `/api/etherscan/balancemulti`,
          {
            addresses: children.map((c) => c.wallet),
          }
        );

        const childrenWithBalances = children.map((c) => {
          const balance = childrenWalletBalances.data.find(
            (b) => b.account === c.wallet
          );
          return {
            ...c,
            balance: balance ? balance.balance : 0,
          };
        });

        // setChildren(childrenWithBalances);
      } else {
        // setChildren(children);
      }

      setChildrenLoading(false);
    };

    await getChildren();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children.length, userDetails?.wallet]);

  const closeTab = () => {
    setSelectedTab(ParentDashboardTabs.DASHBOARD);
  };

  return (
    <Flex>
      <>
        <Box zIndex={1}>
          <ExpandedDashboardMenu
            familyDetails={familyDetails}
            children={children}
            onAddChildOpen={onAddChildOpen}
            setSelectedTab={setSelectedTab}
            onToggleCollapsedMenu={onToggleCollapsedMenu}
            onToggleExtendedMenu={onToggleExtendedMenu}
            isOpenExtendedMenu={isOpenExtendedMenu}
            onOpenEtherScan={onOpenEtherScan}
            isMobileSize={isMobileSize}
            onOpenSettingsModal={onOpenSettingsModal}
            onOpenInfoModal={onOpenInfoModal}
            onOpenSendFundsModal={onOpenSendFundsModal}
            onOpenNetworkModal={onOpenNetworkModal}
            onOpenMembersTableModal={onOpenMembersTableModal}
          />
        </Box>
        {!isMobileSize && (
          <Box zIndex={100}>
            <CollapsedDashboardMenu
              onToggleCollapsedMenu={onToggleCollapsedMenu}
              onToggleExtendedMenu={onToggleExtendedMenu}
              isOpenCollapsedMenu={isOpenCollapsedMenu}
              isMobileSize={isMobileSize}
            />
          </Box>
        )}
      </>

      {/* handles the background image and opacity */}
      <Flex
        width="100%"
        height="100vh"
        bgPosition="center"
        bgRepeat="no-repeat"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          bgPosition="center"
          bgSize="cover"
          bgImage={
            familyDetails?.backgroundURI
              ? familyDetails?.backgroundURI
              : "/images/backgrounds/city-center.png"
          }
          opacity={backgroundOpacity || familyDetails?.opacity?.background || 1}
          zIndex={-1}
        />

        <Grid
          mt={isMobileSize ? "5rem" : "10rem"}
          w="100%"
          h="600px"
          templateColumns={`${
            isMobileSize ? "repeat(0, 0fr)" : "repeat(8, 1fr)"
          }`}
          templateRows={`${isMobileSize ? "repeat(1, 2fr)" : "repeat(2, 1fr)"}`}
          gap={4}
          mx={isMobileSize ? 0 : 5}
        >
          <GridItem
            rowStart={+`${isMobileSize ? 0 : 1}`}
            rowEnd={+`${isMobileSize ? 0 : 1}`}
            colSpan={+`${isMobileSize ? 0 : 4}`}
            h="320"
            bg={useColorModeValue("gray.100", "gray.900")}
            borderRadius={isMobileSize ? "0" : "10px"}
          >
            <StakingContracts />
          </GridItem>
          <GridItem
            rowSpan={2}
            colStart={+`${isMobileSize ? 0 : 5}`}
            colEnd={+`${isMobileSize ? 0 : 9}`}
            h="100%"
            bg={useColorModeValue("gray.100", "gray.900")}
            borderRadius={isMobileSize ? "0" : "10px"}
          >
            <MemberTable />
          </GridItem>

          <GridItem
            rowStart={+`${isMobileSize ? 0 : 2}`}
            rowEnd={+`${isMobileSize ? 0 : 2}`}
            colSpan={+`${isMobileSize ? 0 : 4}`}
            h="300"
            bg={useColorModeValue("gray.100", "gray.900")}
            borderRadius={isMobileSize ? "0" : "10px"}
          >
            <StatsTable />
          </GridItem>
        </Grid>
      </Flex>

      <UsernameModal
        isOpen={isChangeUsernameOpen}
        onClose={onChangeUsernameClose}
        childKey={childKey}
        children={children}
        familyId={familyDetails.familyId}
        fetchChildren={fetchChildren}
        fetchFamilyDetails={fetchFamilyDetails}
      />

      <BackgroundDefaults
        isOpen={isOpenBackgroundDefaults}
        onClose={onCloseBackgroundDefaults}
        fetchFamilyDetails={fetchFamilyDetails}
      />

      <EtherscanModal isOpen={isOpenEtherScan} onClose={onCloseEtherScan} />

      <SettingsModal
        familyDetails={familyDetails}
        onChangeUsernameOpen={onChangeUsernameOpen}
        fetchFamilyDetails={fetchFamilyDetails}
        onOpenBackgroundDefaults={onOpenBackgroundDefaults}
        setBackgroundOpacity={setBackgroundOpacity}
        setCardOpacity={setCardOpacity}
        cardOpacity={cardOpacity}
        isMobileSize={isMobileSize}
        isOpenExtendedMenu={isOpenExtendedMenu}
        closeTab={closeTab}
        isOpen={isOpenSettingsModal}
        onClose={onCloseSettingsModal}
      />

      <InfoModal
        isOpen={isOpenInfoModal}
        onClose={onCloseInfoModal}
        isOpenExtendedMenu={isOpenExtendedMenu}
      />

      <SendFundsModal
        isOpen={isOpenSendFundsModal}
        onClose={onCloseSendFundsModal}
      />

      <NetworkModal isOpen={isOpenNetworkModal} onClose={onCloseNetworkModal} />

      <MembersTableModal
        isOpen={isOpenMembersTableModal}
        onClose={onCloseMembersTableModal}
      />
    </Flex>
  );
};

export default Parent;

{
  /* <Container maxW="5xl" mt="3rem">
<FeatureStats />
<Flex justify={isMobileSize ? "center" : "flex-end"} mr={2}>

</Container>
<MemberTable /> */
}

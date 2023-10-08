"use client";
/* eslint-disable react/no-members-prop */

import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  useDisclosure,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import shallow from "zustand/shallow";
import { useAuthStore } from "@/store/auth/authStore";
import { useContractStore } from "@/store/contract/contractStore";
import { User } from "@/data-schema/types";
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
import RecentMemberActivity from "@/components/parentDashboard/RecentMemberActivity";
import { SendFundsModal } from "@/components/modals/SendFundsModal";
import { NetworkModal } from "@/components/modals/NetworkModal";
import StakingContracts from "@/components/parentDashboard/StakingContracts";
import FamilyStatistics from "@/components/parentDashboard/FamilyStatistics";
import { MembersTableModal } from "@/components/modals/MembersTableModal";

const Parent: React.FC = () => {
  //=============================================================================
  //                               STATE
  //=============================================================================

  const [childKey, setChildKey] = useState<number>(0);
  const [membersLoading, setMembersLoading] = useState(false);
  const [members, setMembers] = useState<User[]>([]);
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

  const { width } = useWindowSize();

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
    fetchMembers();
  }, []);

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

  const fetchMembers = useCallback(async () => {
    const getMembers = async () => {
      if (!userDetails?.wallet) return;

      const members = [] as User[];

      familyDetails.children?.forEach(async (walletAddress) => {
        const { data } = await axios.get(
          `/api/vercel/get-json?key=${walletAddress}`
        );

        members.push(data as User);
      });

      if (members.length) {
        const membersWalletBalances = await axios.post(
          `/api/etherscan/balancemulti`,
          {
            addresses: members.map((c) => c.wallet),
          }
        );

        const membersWithBalances = members.map((c) => {
          const balance = membersWalletBalances.data.find(
            (b) => b.account === c.wallet
          );
          return {
            ...c,
            balance: balance ? balance.balance : 0,
          };
        });

        setMembers(membersWithBalances);
      } else {
        setMembers(members);
      }

      setMembersLoading(false);
    };

    await getMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members.length, userDetails?.wallet]);

  const closeTab = () => {
    setSelectedTab(ParentDashboardTabs.DASHBOARD);
  };

  return (
    <Box>
      <Flex direction={isMobileSize ? "column" : "row"} height="100vh">
        <Box zIndex={1}>
          <ExpandedDashboardMenu
            familyDetails={familyDetails}
            children={members}
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

        <Grid
          pt={isMobileSize ? "5rem" : "0"}
          pb={!isMobileSize ? "1.3rem" : "0"}
          w="100%"
          h="100%"
          templateColumns={isMobileSize ? "1fr" : "repeat(8, 1fr)"}
          templateRows={isMobileSize ? "auto" : "repeat(3, 1fr)"}
          gap={4}
          px={isMobileSize ? 0 : 5}
          bgPosition="center"
          bgSize="cover"
          bgImage={
            familyDetails?.backgroundURI
              ? familyDetails?.backgroundURI
              : "/images/backgrounds/purple-bg.jpg"
          }
        >
          {!isMobileSize && (
            <GridItem
              rowStart={1}
              rowEnd={1}
              colStart={4}
              colEnd={9}
              h={isMobileSize ? "auto" : "105"}
              mt="1.2rem"
            >
              <Flex justify="flex-end" alignItems="center">
                <Box>
                  <Heading
                    size="4xl"
                    color="white"
                    mt={isMobileSize ? 0 : 6}
                    pr={4}
                  >
                    DefiKids
                  </Heading>
                  <Text align="center">Earn. Save. Stake. Invest.</Text>
                </Box>
              </Flex>
            </GridItem>
          )}

          <GridItem
            rowStart={
              isMobileSize || (isMobileSize && isOpenExtendedMenu) ? 2 : 0
            }
            rowEnd={isMobileSize ? 2 : 0}
            colSpan={isMobileSize ? 1 : 4}
            h={isMobileSize ? "auto" : "320"}
            bg={useColorModeValue("gray.100", "gray.900")}
            borderRadius={isMobileSize ? "0" : "10px"}
          >
            <StakingContracts />
          </GridItem>

          <GridItem
            rowSpan={2}
            colStart={isMobileSize ? 1 : 5}
            colEnd={isMobileSize ? 1 : 9}
            h={isMobileSize ? "auto" : "100%"}
            bg={useColorModeValue("gray.100", "gray.900")}
            borderRadius={isMobileSize ? "0" : "10px"}
          >
            <RecentMemberActivity members={members} />
          </GridItem>

          <GridItem
            rowStart={isMobileSize ? 3 : 0}
            rowEnd={isMobileSize ? 3 : 0}
            colSpan={isMobileSize ? 1 : 4}
            bg={useColorModeValue("gray.100", "gray.900")}
            borderRadius={isMobileSize ? "0" : "10px"}
          >
            <FamilyStatistics />
          </GridItem>
        </Grid>
      </Flex>

      {/* Modals and other components */}
      <UsernameModal
        isOpen={isChangeUsernameOpen}
        onClose={onChangeUsernameClose}
        childKey={childKey}
        children={members}
        familyId={familyDetails.familyId}
        fetchChildren={fetchMembers}
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
    </Box>
  );
};

export default Parent;

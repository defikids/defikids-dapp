"use client";

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
import { User } from "@/data-schema/types";
import axios from "axios";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { InfoModal } from "@/components/modals/InfoModal";
import { ExpandedDashboardMenu } from "@/components/ExpandedDashboardMenu";
import { CollapsedDashboardMenu } from "@/components/CollapsedDashboardMenu";
import { useWindowSize } from "usehooks-ts";
import { EtherscanModal } from "@/components/modals/EtherscanModal";
import { RecentMemberActivity } from "@/components/dashboards/parentDashboard/RecentMemberActivity";
import { SendFundsModal } from "@/components/modals/SendFundsModal";
import StakingContracts from "@/components/dashboards/parentDashboard/StakingContracts";
import FamilyStatistics from "@/components/dashboards/parentDashboard/FamilyStatistics";
import { MembersTableModal } from "@/components/modals/MembersTableModal";
import { AirdropModal } from "@/components/modals/AirdropModal";
import { getFamilyMembersByAccount } from "@/BFF/mongo/getFamilyMembersByAccount";
import { DefiKidsHeading } from "@/components/DefiKidsHeading";

const Parent: React.FC = () => {
  //=============================================================================
  //                               STATE
  //=============================================================================

  const [members, setMembers] = useState<User[]>([]);

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
    isOpen: isOpenEtherScan,
    onOpen: onOpenEtherScan,
    onClose: onCloseEtherScan,
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
    isOpen: isOpenMembersTableModal,
    onOpen: onOpenMembersTableModal,
    onClose: onCloseMembersTableModal,
  } = useDisclosure();

  const {
    isOpen: isOpenAirdropModal,
    onOpen: onOpenAirdropModal,
    onClose: onCloseAirdropModal,
  } = useDisclosure();

  useEffect(() => {
    fetchMembers();
  }, []);

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================

  const fetchMembers = useCallback(async () => {
    const getMembers = async () => {
      if (!userDetails?.wallet) return;

      const members = await getFamilyMembersByAccount(userDetails?.accountId!);

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
    };

    await getMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members.length, userDetails?.wallet]);

  return (
    <Box>
      <Flex direction={isMobileSize ? "column" : "row"} height="100vh">
        <Box zIndex={1}>
          <ExpandedDashboardMenu
            onToggleCollapsedMenu={onToggleCollapsedMenu}
            onToggleExtendedMenu={onToggleExtendedMenu}
            isOpenExtendedMenu={isOpenExtendedMenu}
            onOpenEtherScan={onOpenEtherScan}
            isMobileSize={isMobileSize}
            onOpenSettingsModal={onOpenSettingsModal}
            onOpenInfoModal={onOpenInfoModal}
            onOpenSendFundsModal={onOpenSendFundsModal}
            onOpenMembersTableModal={onOpenMembersTableModal}
            onOpenAirdropModal={onOpenAirdropModal}
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
          bgImage={"/images/backgrounds/purple-bg.jpg"}
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
              <DefiKidsHeading />
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
            <RecentMemberActivity user={userDetails} />
          </GridItem>

          <GridItem
            rowStart={isMobileSize ? 3 : 0}
            rowEnd={isMobileSize ? 3 : 0}
            colSpan={isMobileSize ? 1 : 4}
            bg={useColorModeValue("gray.100", "gray.900")}
            borderRadius={isMobileSize ? "0" : "10px"}
          >
            <FamilyStatistics members={members || []} />
          </GridItem>
        </Grid>
      </Flex>

      {/* Modals and other components */}

      <EtherscanModal isOpen={isOpenEtherScan} onClose={onCloseEtherScan} />

      <SettingsModal
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

      <MembersTableModal
        isOpen={isOpenMembersTableModal}
        onClose={onCloseMembersTableModal}
      />

      <AirdropModal isOpen={isOpenAirdropModal} onClose={onCloseAirdropModal} />
    </Box>
  );
};

export default Parent;

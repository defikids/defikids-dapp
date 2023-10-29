/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  Box,
  Flex,
  GridItem,
  useDisclosure,
  useColorModeValue,
  Grid,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import shallow from "zustand/shallow";
import { useAuthStore } from "@/store/auth/authStore";
import { useContractStore } from "@/store/contract/contractStore";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { InfoModal } from "@/components/modals/InfoModal";
import { ExpandedDashboardMenu } from "@/components/ExpandedDashboardMenu";
import { CollapsedDashboardMenu } from "@/components/CollapsedDashboardMenu";
import { useWindowSize } from "usehooks-ts";
import { EtherscanModal } from "@/components/modals/EtherscanModal";
import StakingContracts from "@/components/dashboards/parentDashboard/StakingContracts";
import { RecentMemberActivity } from "@/components/dashboards/parentDashboard/RecentMemberActivity";
import FamilyStatistics from "@/components/dashboards/parentDashboard/FamilyStatistics";
import { DefiKidsHeading } from "@/components/DefiKidsHeading";
import { WithdrawDefiDollarsModal } from "@/components/modals/WithdrawDefiDollarsModal";

const MemberDashboard: React.FC = () => {
  //=============================================================================
  //                               STATE
  //=============================================================================

  //=============================================================================
  //                               HOOKS
  //=============================================================================
  const { userDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
      familyMembers: state.familyMembers,
      setFamilyMembers: state.setFamilyMembers,
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
    isOpen: isOpenWithdrawDefiDollarsModal,
    onOpen: onOpenWithdrawDefiDollarsModal,
    onClose: onCloseWithdrawDefiDollarsModal,
  } = useDisclosure();

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
            onOpenWithdrawDefiDollarsModal={onOpenWithdrawDefiDollarsModal}
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
            <FamilyStatistics members={[]} />
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

      <WithdrawDefiDollarsModal
        isOpen={isOpenWithdrawDefiDollarsModal}
        onClose={onCloseWithdrawDefiDollarsModal}
      />
    </Box>
  );
};

export default MemberDashboard;

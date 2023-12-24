/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Box, Flex, Grid, GridItem, useDisclosure } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { useWindowSize } from "usehooks-ts";
import { getFamilyMembersByAccount } from "@/BFF/mongo/getFamilyMembersByAccount";
import { ethers, Contract } from "ethers";
import { watchNetwork, getNetwork } from "@wagmi/core";
import { WrongNetwork } from "@/components/WrongNetwork";
import { validChainId } from "@/config";
import { useNetwork } from "wagmi";

// Components
import { ExpandedDashboardMenu } from "@/components/ExpandedDashboardMenu";
import { CollapsedDashboardMenu } from "@/components/CollapsedDashboardMenu";
import { RecentMemberActivity } from "@/components/dashboards/parentDashboard/RecentMemberActivity";
import StakingContracts from "@/components/dashboards/parentDashboard/StakingContracts";
import FamilyStatistics from "@/components/dashboards/parentDashboard/FamilyStatistics";
import { DefiKidsHeading } from "@/components/DefiKidsHeading";
import { StableToken } from "@/components/dashboards/parentDashboard/StableToken";
import { MemberWithdrawRequest } from "@/components/dashboards/parentDashboard/MemberWithdrawRequest";

// Modals
import { SettingsModal } from "@/components/modals/SettingsModal";
import { InfoModal } from "@/components/modals/InfoModal";
import { EtherscanModal } from "@/components/modals/EtherscanModal";
import { SendAllowanceModal } from "@/components/modals/SendAllowanceModal";
import { MembersTableModal } from "@/components/modals/MembersTableModal";
import { DepositDefiDollarsModal } from "@/components/modals/DepositDefiDollarsModal";
import { WithdrawDefiDollarsModal } from "@/components/modals/WithdrawDefiDollarsModal";
import DefiDollarsContract from "@/blockchain/DefiDollars";
import { getSignerAddress } from "@/blockchain/utils";
import { User } from "@/data-schema/types";
import { getUserByWalletAddress } from "@/services/mongo/routes/user";

const ParentDashboardClientLayout = ({ user }: { user: User }) => {
  //=============================================================================
  //                               STATE
  //=============================================================================
  const [isValidChain, setIsValidChain] = useState(false);
  const [stableTokenBalance, setStableTokenBalance] = useState(0);
  const [familyMembers, setFamilyMembers] = useState([] as User[]);
  const [parent, setParent] = useState(user as User);
  const [withdrawRequests, setWithdrawRequests] = useState(0);

  //=============================================================================
  //                               HOOKS
  //=============================================================================

  const { chain } = useNetwork();
  const { width } = useWindowSize();
  const isMobileSize = width < 768;

  watchNetwork((network) => {
    validChainId === network.chain?.id
      ? setIsValidChain(true)
      : setIsValidChain(false);
  });

  const reloadUserData = useCallback(async () => {
    const parent = await getUserByWalletAddress(user.wallet);
    setParent(parent);
  }, []);

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
    isOpen: isOpenSendAllowanceModal,
    onOpen: onOpenSendAllowanceModal,
    onClose: onCloseSendAllowanceModal,
  } = useDisclosure();

  const {
    isOpen: isOpenMembersTableModal,
    onOpen: onOpenMembersTableModal,
    onClose: onCloseMembersTableModal,
  } = useDisclosure();

  const {
    isOpen: isOpenDepositDefiDollarsModal,
    onOpen: onOpenDepositDefiDollarsModal,
    onClose: onCloseDepositDefiDollarsModal,
  } = useDisclosure();

  const {
    isOpen: isOpenWithdrawDefiDollarsModal,
    onOpen: onOpenWithdrawDefiDollarsModal,
    onClose: onCloseWithdrawDefiDollarsModal,
  } = useDisclosure();

  useEffect(() => {
    if (validChainId === chain?.id) {
      setIsValidChain(true);
    }
    fetchMembers();
    getStableTokenBalance();
  }, [onCloseSendAllowanceModal]);

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================

  const getMemberWithdrawRequests = useCallback(
    async (members: User[], defiDollarsInstance: Contract) => {
      let totalWithdrawRequests = 0;

      for (let i = 0; i < members.length; i++) {
        const value = await defiDollarsInstance?.allowance(
          members[i].wallet,
          parent.wallet
        );
        if (value) totalWithdrawRequests++;
      }
      setWithdrawRequests(totalWithdrawRequests);
    },
    []
  );

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

  const fetchMembers = useCallback(async () => {
    const getMembers = async () => {
      const valid = checkCurrentChain();
      if (!valid) return;

      //@ts-ignore
      const provider = new ethers.BrowserProvider(window.ethereum);
      const defiDollarsInstance = await DefiDollarsContract.fromProvider(
        provider
      );

      // Get member withdraw requests
      const members = await getFamilyMembersByAccount(user?.accountId!);
      await getMemberWithdrawRequests(members, defiDollarsInstance);

      if (members.length) {
        // Get balances for each member
        const membersWalletBalances = [] as {
          account: string;
          balance: string;
        }[];

        for (let i = 0; i < members.length; i++) {
          const balance = await defiDollarsInstance?.balanceOf(
            members[i].wallet
          );

          membersWalletBalances.push({
            account: members[i].wallet,
            balance: balance.toString(),
          });
        }

        const membersWithBalances = members.map((c) => {
          const balance = membersWalletBalances.find(
            (b) => b.account === c.wallet
          );
          return {
            ...c,
            balance: balance ? balance.balance : "0",
          };
        });
        setFamilyMembers(membersWithBalances);
      } else {
        setFamilyMembers(members);
      }
    };

    await getMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [familyMembers.length, user.wallet]);

  if (!isValidChain) {
    return <WrongNetwork />;
  }

  return (
    <Box>
      <Flex
        direction={isMobileSize ? "column" : "row"}
        height="100%"
        bgPosition="center"
        bgSize="cover"
        bgImage={"/images/backgrounds/purple-bg.jpg"}
      >
        {/* Menus */}
        <Box zIndex={1}>
          <ExpandedDashboardMenu
            onToggleCollapsedMenu={onToggleCollapsedMenu}
            onToggleExtendedMenu={onToggleExtendedMenu}
            isOpenExtendedMenu={isOpenExtendedMenu}
            onOpenEtherScan={onOpenEtherScan}
            isMobileSize={isMobileSize}
            onOpenSettingsModal={onOpenSettingsModal}
            onOpenInfoModal={onOpenInfoModal}
            onOpenSendAllowanceModal={onOpenSendAllowanceModal}
            onOpenMembersTableModal={onOpenMembersTableModal}
            stableTokenBalance={stableTokenBalance}
            user={parent}
          />
        </Box>
        {!isMobileSize && (
          <Box zIndex={100}>
            <CollapsedDashboardMenu
              onToggleCollapsedMenu={onToggleCollapsedMenu}
              onToggleExtendedMenu={onToggleExtendedMenu}
              isOpenCollapsedMenu={isOpenCollapsedMenu}
              isMobileSize={isMobileSize}
              user={parent}
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
            rowStart={1}
            rowEnd={isMobileSize ? 2 : 1}
            colStart={isMobileSize ? 1 : 1}
            colEnd={isMobileSize ? 1 : 5}
            h={isMobileSize ? "auto" : "105"}
            mt={isMobileSize ? "1.2rem" : "12rem"}
          >
            <StableToken stableTokenBalance={stableTokenBalance} />
          </GridItem>

          <GridItem
            rowStart={1}
            rowEnd={isMobileSize ? 2 : 1}
            colStart={isMobileSize ? 1 : 5}
            colEnd={isMobileSize ? 1 : 9}
            h={isMobileSize ? "auto" : "105"}
            mt={isMobileSize ? "1.2rem" : "12rem"}
          >
            <MemberWithdrawRequest withdrawRequests={withdrawRequests} />
          </GridItem>

          <GridItem
            rowStart={
              isMobileSize || (isMobileSize && isOpenExtendedMenu) ? 2 : 0
            }
            rowEnd={isMobileSize ? 2 : 0}
            colSpan={isMobileSize ? 1 : 4}
            h={isMobileSize ? "auto" : "320"}
            bg="gray.900"
            borderRadius={isMobileSize ? "0" : "10px"}
          >
            <StakingContracts />
          </GridItem>
          <GridItem
            rowSpan={2}
            colStart={isMobileSize ? 1 : 5}
            colEnd={isMobileSize ? 1 : 9}
            h={isMobileSize ? "auto" : "100%"}
            bg="gray.900"
            borderRadius={isMobileSize ? "0" : "10px"}
          >
            <RecentMemberActivity user={parent} setUser={setParent} />
          </GridItem>
          <GridItem
            rowStart={isMobileSize ? 3 : 0}
            rowEnd={isMobileSize ? 3 : 0}
            colSpan={isMobileSize ? 1 : 4}
            bg="gray.900"
            borderRadius={isMobileSize ? "0" : "10px"}
          >
            <FamilyStatistics members={familyMembers || []} />
          </GridItem>
        </Grid>
      </Flex>

      {/* Modals and other components */}

      <EtherscanModal
        isOpen={isOpenEtherScan}
        onClose={onCloseEtherScan}
        user={user}
      />

      <SettingsModal
        isOpen={isOpenSettingsModal}
        onClose={onCloseSettingsModal}
        user={parent}
        setUser={setParent}
      />

      <InfoModal isOpen={isOpenInfoModal} onClose={onCloseInfoModal} />

      <SendAllowanceModal
        isOpen={isOpenSendAllowanceModal}
        onClose={onCloseSendAllowanceModal}
        members={familyMembers}
        stableTokenBalance={stableTokenBalance}
        getStableTokenBalance={getStableTokenBalance}
      />

      <MembersTableModal
        isOpen={isOpenMembersTableModal}
        onClose={onCloseMembersTableModal}
        user={parent}
        setUser={setParent}
        reloadUserData={reloadUserData}
      />

      <DepositDefiDollarsModal
        isOpen={isOpenDepositDefiDollarsModal}
        onClose={onCloseDepositDefiDollarsModal}
      />

      <WithdrawDefiDollarsModal
        isOpen={isOpenWithdrawDefiDollarsModal}
        onClose={onCloseWithdrawDefiDollarsModal}
      />
    </Box>
  );
};

export default ParentDashboardClientLayout;

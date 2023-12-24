/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Box, Flex, GridItem, useDisclosure, Grid } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { InfoModal } from "@/components/modals/InfoModal";
import { ExpandedDashboardMenu } from "@/components/ExpandedDashboardMenu";
import { CollapsedDashboardMenu } from "@/components/CollapsedDashboardMenu";
import { useWindowSize } from "usehooks-ts";
import { EtherscanModal } from "@/components/modals/EtherscanModal";
import { RecentMemberActivity } from "@/components/dashboards/parentDashboard/RecentMemberActivity";
import FamilyStatistics from "@/components/dashboards/parentDashboard/FamilyStatistics";
import { DefiKidsHeading } from "@/components/DefiKidsHeading";
import { WithdrawDefiDollarsModal } from "@/components/modals/WithdrawDefiDollarsModal";
import { watchNetwork, getNetwork } from "@wagmi/core";
import { WrongNetwork } from "@/components/WrongNetwork";
import { validChainId } from "@/config";
import { useNetwork } from "wagmi";
import { DefiDollars } from "@/components/dashboards/parentDashboard/DefiDollars";
import { ethers } from "ethers";
import { TokenLockers } from "@/components/tokenLockers/TokenLockers";
import { Locker, User } from "@/data-schema/types";
import TokenLockerContract from "@/blockchain/tokenLockers";
import DefiDollarsContract from "@/blockchain/DefiDollars";
import { getUserByWalletAddress } from "@/services/mongo/routes/user";

const MemberDashboardClientLayout = ({ user }: { user: User }) => {
  //=============================================================================
  //                               STATE
  //=============================================================================
  const [isValidChain, setIsValidChain] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [lockersByUser, setLockersByUser] = useState<Locker[]>([]);
  const [member, setMember] = useState(user as User);

  //=============================================================================
  //                               HOOKS
  //=============================================================================

  useEffect(() => {
    const init = async () => {
      if (validChainId === chain?.id) {
        setIsValidChain(true);
      }

      //@ts-ignore
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Get the lockers by user
      const TokenLockerInstance = await TokenLockerContract.fromProvider(
        provider
      );
      const lockersByUser = await TokenLockerInstance.fetchAllLockersByUser();
      setLockersByUser(lockersByUser);

      // Get the token balance
      const defiDollarsInstance = await DefiDollarsContract.fromProvider(
        provider
      );
      const balance = await defiDollarsInstance.balanceOf(user?.wallet);
      setTokenBalance(balance);
    };
    init();
  }, []);

  const { chain } = useNetwork();

  watchNetwork((network) => {
    validChainId === network.chain?.id
      ? setIsValidChain(true)
      : setIsValidChain(false);
  });

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

  useEffect(() => {
    if (validChainId === chain?.id) {
      setIsValidChain(true);
    }

    //@ts-ignore
    const provider = new ethers.BrowserProvider(window.ethereum);

    const defiDollarsBalance = async () => {
      const defiDollarsInstance = await DefiDollarsContract.fromProvider(
        provider
      );

      const balance = await defiDollarsInstance?.balanceOf(user?.wallet);
      setTokenBalance(Number(ethers.formatEther(balance)));
    };

    defiDollarsBalance();
  }, [isOpenWithdrawDefiDollarsModal]);

  const reloadUserData = useCallback(async () => {
    const member = await getUserByWalletAddress(user.wallet);
    setMember(member);
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
            stableTokenBalance={tokenBalance}
            user={user}
          />
        </Box>
        {!isMobileSize && (
          <Box zIndex={100}>
            <CollapsedDashboardMenu
              onToggleCollapsedMenu={onToggleCollapsedMenu}
              onToggleExtendedMenu={onToggleExtendedMenu}
              isOpenCollapsedMenu={isOpenCollapsedMenu}
              isMobileSize={isMobileSize}
              user={user}
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
            rowStart={1}
            rowEnd={isMobileSize ? 2 : 1}
            colStart={isMobileSize ? 1 : 1}
            colEnd={isMobileSize ? 1 : 9}
            h={isMobileSize ? "auto" : "105"}
            mt={isMobileSize ? "1.2rem" : "12rem"}
            mb="1.5rem"
          >
            <DefiDollars
              tokenBalance={tokenBalance}
              onOpenWithdrawDefiDollarsModal={onOpenWithdrawDefiDollarsModal}
            />
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
            <TokenLockers
              user={user}
              lockersByUser={lockersByUser}
              isMobileSize={isMobileSize}
            />
          </GridItem>

          <GridItem
            rowSpan={2}
            colStart={isMobileSize ? 1 : 5}
            colEnd={isMobileSize ? 1 : 9}
            h={isMobileSize ? "auto" : "100%"}
            bg="gray.900"
            borderRadius={isMobileSize ? "0" : "10px"}
          >
            <RecentMemberActivity user={member} />
          </GridItem>

          <GridItem
            rowStart={isMobileSize ? 3 : 0}
            rowEnd={isMobileSize ? 3 : 0}
            colSpan={isMobileSize ? 1 : 4}
            bg="gray.900"
            borderRadius={isMobileSize ? "0" : "10px"}
          >
            <FamilyStatistics members={[]} />
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
        user={user}
        setUser={setMember}
      />

      <InfoModal isOpen={isOpenInfoModal} onClose={onCloseInfoModal} />

      <WithdrawDefiDollarsModal
        isOpen={isOpenWithdrawDefiDollarsModal}
        onClose={onCloseWithdrawDefiDollarsModal}
      />
    </Box>
  );
};

export default MemberDashboardClientLayout;

"use client";

import { Button, VStack } from "@chakra-ui/react";
import { ChildDetails } from "@/data-schema/types";
import { ParentDashboardTabs } from "@/data-schema/enums";
import { useAuthStore } from "@/store/auth/authStore";
import shallow from "zustand/shallow";
import { NetworkType } from "@/data-schema/enums";

const ButtonMenu = ({
  onAddChildOpen,
  setSelectedTab,
  onOpenEtherScan,
  onOpenSettingsModal,
  onOpenInfoModal,
  onOpenSendFundsModal,
  onOpenNetworkModal,
  children,
}: {
  onAddChildOpen: () => void;
  setSelectedTab: (tab: ParentDashboardTabs) => void;
  onOpenEtherScan: () => void;
  onOpenSettingsModal: () => void;
  onOpenInfoModal: () => void;
  onOpenSendFundsModal: () => void;
  onOpenNetworkModal: () => void;
  children?: ChildDetails[];
}) => {
  const { userDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
    }),
    shallow
  );

  console.log("userDetails.defaultNetworkType", userDetails.defaultNetworkType);
  console.log("NetworkType.TESTNET", NetworkType.TESTNET);

  return (
    <VStack spacing={4} align="stretch" justify="space-between" mt={10} mx={5}>
      <Button
        variant="outline"
        colorScheme="white"
        _hover={{ borderColor: "gray" }}
        onClick={(e) => {
          e.stopPropagation();
          onOpenSendFundsModal();
        }}
      >
        Send Funds
      </Button>

      <Button
        variant="outline"
        colorScheme="white"
        _hover={{ borderColor: "gray" }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedTab(ParentDashboardTabs.DASHBOARD);
        }}
      >
        Airdrop
      </Button>

      <Button
        variant="outline"
        colorScheme="white"
        _hover={{ borderColor: "gray" }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        Members
      </Button>

      <Button
        variant="outline"
        colorScheme="white"
        _hover={{ borderColor: "gray" }}
        onClick={(e) => {
          e.stopPropagation();
          onOpenNetworkModal();
        }}
      >
        {userDetails.defaultNetworkType === NetworkType.TESTNET
          ? "Sandbox Mode"
          : "Networks"}
      </Button>
    </VStack>
  );
};

export default ButtonMenu;

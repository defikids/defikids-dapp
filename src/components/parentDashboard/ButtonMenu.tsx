"use client";

import { Button, VStack } from "@chakra-ui/react";
import { User } from "@/data-schema/types";
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
  onOpenMembersTableModal,
  onOpenAirdropModal,
  members,
}: {
  onAddChildOpen: () => void;
  setSelectedTab: (tab: ParentDashboardTabs) => void;
  onOpenEtherScan: () => void;
  onOpenSettingsModal: () => void;
  onOpenInfoModal: () => void;
  onOpenSendFundsModal: () => void;
  onOpenNetworkModal: () => void;
  onOpenMembersTableModal: () => void;
  onOpenAirdropModal: () => void;
  members?: User[];
}) => {
  const { userDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
    }),
    shallow
  );

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
          onOpenAirdropModal();
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
          onOpenMembersTableModal();
        }}
      >
        Members
      </Button>
    </VStack>
  );
};

export default ButtonMenu;

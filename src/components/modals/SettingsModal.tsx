"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Heading,
} from "@chakra-ui/react";
import { Settings } from "@/components/Settings";
import { User } from "@/data-schema/types";

export const SettingsModal = ({
  onChangeUsernameOpen,
  familyDetails,
  fetchFamilyDetails,
  onOpenBackgroundDefaults,
  cardOpacity,
  setCardOpacity,
  setBackgroundOpacity,
  isMobileSize,
  isOpenExtendedMenu,
  closeTab,
  isOpen,
  onClose,
}: {
  onChangeUsernameOpen: () => void;
  familyDetails: User;
  fetchFamilyDetails: () => void;
  onOpenBackgroundDefaults: () => void;
  cardOpacity: number;
  setCardOpacity: (value: number) => void;
  setBackgroundOpacity: (value: number) => void;
  isMobileSize: boolean;
  isOpenExtendedMenu: boolean;
  closeTab: () => void;
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      onCloseComplete={() => {}}
      isCentered
    >
      <ModalOverlay
        bg="none"
        backdropFilter="auto"
        backdropInvert="10%"
        backdropBlur="4px"
      />
      <ModalContent bgGradient={["linear(to-r, white, lightgray)"]}>
        <ModalHeader>
          <Heading fontSize="md">Settings</Heading>
        </ModalHeader>
        <ModalCloseButton color="black" />
        <ModalBody bgGradient={["linear(to-r, white, lightgray)"]}>
          <Settings
            onChangeUsernameOpen={onChangeUsernameOpen}
            familyDetails={familyDetails}
            fetchFamilyDetails={fetchFamilyDetails}
            onOpenBackgroundDefaults={onOpenBackgroundDefaults}
            cardOpacity={cardOpacity}
            setCardOpacity={setCardOpacity}
            setBackgroundOpacity={setBackgroundOpacity}
            isMobileSize={isMobileSize}
            isOpenExtendedMenu={isOpenExtendedMenu}
            closeTab={closeTab}
          />
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};
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

export const SettingsModal = ({
  isOpen,
  onClose,
}: {
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
          <Settings />
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

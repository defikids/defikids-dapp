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
  isOpen,
  onClose,
  user,
  setUser,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  setUser: (user: User) => void;
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
          <Settings user={user} setUser={setUser} />
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

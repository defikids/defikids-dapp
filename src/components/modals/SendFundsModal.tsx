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
import { Airdrop } from "@/components/Airdrop";
import { User } from "@/data-schema/types";

export const SendFundsModal = ({
  isOpen,
  onClose,
  tokenBalance,
  members,
}: {
  isOpen: boolean;
  onClose: () => void;
  tokenBalance: number;
  members: User[];
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay
        bg="none"
        backdropFilter="auto"
        backdropInvert="10%"
        backdropBlur="4px"
      />
      <ModalContent>
        <ModalHeader>
          <Heading fontSize="sm">Send Allowance</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Airdrop
            onClose={onClose}
            members={members}
            tokenBalance={tokenBalance}
          />
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

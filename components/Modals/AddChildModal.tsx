import React, { useState } from "react";
import {
  Box,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Modal,
  Heading,
} from "@chakra-ui/react";
import { RegisterChildForm } from "@/components/forms/registerChildForm";

export const AddChildModal = ({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      isCentered
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading size="md">New Kid</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <RegisterChildForm onClose={onClose} onAdd={onAdd} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

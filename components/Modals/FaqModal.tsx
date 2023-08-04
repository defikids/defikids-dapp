import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { FaqAccordian } from "../FaqAccordian";

const FaqModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>FAQ</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FaqAccordian />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FaqModal;

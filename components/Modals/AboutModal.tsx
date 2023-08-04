import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
//   import RegisterVaultForm from "../Forms/RegisterVaultForm";

const AboutModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>About</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{/* <RegisterVaultForm onClose={onClose} /> */}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AboutModal;

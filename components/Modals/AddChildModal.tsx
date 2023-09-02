import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Modal,
  Heading,
  ModalFooter,
  useBreakpointValue,
} from "@chakra-ui/react";
// import RegisterChildForm from "@/components/forms/RegisterChildForm";
import { RegisterChildForm } from "@/components/forms/RegisterChildForm2";
import { useState } from "react";

export const AddChildModal = ({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const isMobileSize = useBreakpointValue({
    base: true,
    sm: false,
    md: false,
    lg: false,
  });
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={isMobileSize ? "6xl" : "md"}
      isCentered
      closeOnOverlayClick={false}
      onCloseComplete={() => {
        setIsLoading(false);
      }}
    >
      <ModalOverlay
        bg="none"
        backdropFilter="auto"
        backdropInvert="10%"
        backdropBlur="4px"
      />
      <ModalContent>
        <ModalHeader>
          <Heading size="md">Register Member</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <RegisterChildForm
            onClose={onClose}
            onAdd={onAdd}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

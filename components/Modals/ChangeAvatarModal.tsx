import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Avatar,
  Flex,
  ModalFooter,
} from "@chakra-ui/react";
import { AvatarSelection } from "@/components/forms/AvatarSelection";
import { useRef, useState } from "react";
import { TransactionStepper } from "../steppers/TransactionStepper";
import { StepperContext } from "@/dataSchema/enums";

export const ChangeAvatarModal = ({
  isOpen,
  onClose,
  activeStep,
  loading,
  handleSubmit,
  familyURI,
  children,
  childKey,
}: {
  isOpen: boolean;
  onClose: () => void;
  activeStep: number;
  loading: boolean;
  handleSubmit: (file: File | null, avatar: string) => void;
  familyURI: string;
  children: any;
  childKey: number;
}) => {
  console.log("ChangeAvatarModal", familyURI);
  const [avatarURI, setAvatarURI] = useState(
    familyURI || "/images/placeholder-avatar.jpeg"
  );
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);

  const openFileInput = () => {
    fileInputRef.current.click();
  };
  console.log("ChangeAvatarModal - avatarURI", avatarURI);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={loading ? "md" : "xs"}
      isCentered
      closeOnOverlayClick={false}
      onCloseComplete={() => {
        setAvatarURI("");
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Avatar</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {loading ? (
            <TransactionStepper
              activeStep={activeStep}
              context={StepperContext.AVATAR}
            />
          ) : (
            <>
              <AvatarSelection
                fileInputRef={fileInputRef}
                avatarURI={familyURI}
                openFileInput={openFileInput}
                setSelectedFile={setSelectedFile}
                setAvatarURI={setAvatarURI}
              />

              <Button
                disabled={avatarURI === familyURI}
                width="full"
                size="md"
                mt={4}
                bgColor="blue.500"
                color="white"
                _hover={{
                  bgColor: "blue.600",
                }}
                onClick={() => {
                  handleSubmit(selectedFile, avatarURI);
                }}
              >
                Update
              </Button>
            </>
          )}
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

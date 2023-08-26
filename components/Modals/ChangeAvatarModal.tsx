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
  const [provideUrl, setProvideUrl] = useState(false);
  const [avatarURI, setAvatarURI] = useState("");
  const [uploadURI, setUploadURI] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);
  const inputUrlRef = useRef(null);

  const openFileInput = () => {
    fileInputRef.current.click();
  };

  const displayAvatar = () => {
    if (avatarURI) return avatarURI;

    if (children[childKey]?.avatarURI) {
      return children[childKey]?.avatarURI;
    }

    if (familyURI) {
      return familyURI;
    }

    return "/images/placeholder-avatar.jpeg";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      isCentered
      closeOnOverlayClick={false}
      onCloseComplete={() => {
        setAvatarURI("");
        setUploadURI("");
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
              <Flex direction="row" align="center" justify="center">
                <Avatar
                  mt={3}
                  mb={6}
                  size="2xl"
                  name="Defi Kids"
                  src={displayAvatar()}
                />
              </Flex>

              <AvatarSelection
                provideUrl={provideUrl}
                inputUrlRef={inputUrlRef}
                fileInputRef={fileInputRef}
                uploadURI={uploadURI}
                avatarURI={avatarURI}
                setAvatarURI={setAvatarURI}
                setUploadURI={setUploadURI}
                openFileInput={openFileInput}
                setSelectedFile={setSelectedFile}
                setProvideUrl={setProvideUrl}
              />

              <Button
                // disabled={currentAvatar === avatarURI}
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

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
import { RegisterChildStepper } from "../steppers/RegisterChildStepper";

export const ChangeAvatarModal = ({
  isOpen,
  onClose,
  activeStep,
  loading,
  handleSubmit,
  currentAvatar,
}: {
  isOpen: boolean;
  onClose: () => void;
  activeStep: number;
  loading: boolean;
  handleSubmit: (file: File | null, avatar: string) => void;
  currentAvatar: string;
}) => {
  const [provideUrl, setProvideUrl] = useState(false);
  const [avatarURI, setAvatarURI] = useState(currentAvatar);
  const [uploadURI, setUploadURI] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);
  const inputUrlRef = useRef(null);

  const openFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      isCentered
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Avatar</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {loading ? (
            <RegisterChildStepper activeStep={activeStep} />
          ) : (
            <>
              <Flex direction="row" align="center" justify="center">
                <Avatar
                  mt={3}
                  mb={6}
                  size="2xl"
                  name="Defi Kids"
                  src={
                    avatarURI ? avatarURI : "/images/placeholder-avatar.jpeg"
                  }
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
                disabled={currentAvatar === avatarURI}
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

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
import { AvatarSelection } from "@/components/forms/AvatarSelection";
import { useRef, useState } from "react";

export const ChangeAvatarModal = ({ isOpen, onClose }) => {
  const [provideUrl, setProvideUrl] = useState(false);
  const [avatarURI, setAvatarURI] = useState("");
  const [uploadURI, setUploadURI] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setIsLoading] = useState(false);

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
        <ModalBody>
          <AvatarSelection
            provideUrl={provideUrl}
            inputUrlRef={inputUrlRef}
            fileInputRef={fileInputRef}
            uploadURI={uploadURI}
            avatarURI={avatarURI}
            isLoading={loading}
            setAvatarURI={setAvatarURI}
            setUploadURI={setUploadURI}
            openFileInput={openFileInput}
            setSelectedFile={setSelectedFile}
            setProvideUrl={setProvideUrl}
          />
        </ModalBody>
        <ModalCloseButton />
        <ModalBody>{/* <RegisterVaultForm onClose={onClose} /> */}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

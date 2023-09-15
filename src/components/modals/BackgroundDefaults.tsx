"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Grid,
  Box,
  ModalFooter,
  Image,
  useToast,
} from "@chakra-ui/react";
import { images } from "@/data/defaultBackgrounds";
import { transactionErrors } from "@/utils/errorHanding";
import { useAuthStore } from "@/store/auth/authStore";
import shallow from "zustand/shallow";
import axios from "axios";

const BackgroundDefaults = ({
  isOpen,
  onClose,
  fetchFamilyDetails,
}: {
  isOpen: boolean;
  onClose: () => void;
  fetchFamilyDetails: () => void;
}) => {
  const toast = useToast();

  const { userDetails, setUserDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
      setUserDetails: state.setUserDetails,
    }),
    shallow
  );

  const handleSelectedBackground = async (src: string) => {
    try {
      const body = {
        ...userDetails,
        backgroundURI: src,
      };

      const payload = {
        key: userDetails?.wallet,
        value: body,
      };

      await axios.post(`/api/vercel/set-json`, payload);
      setUserDetails(body);
      fetchFamilyDetails();
      onClose();

      toast({
        title: "Background successfully updated",
        status: "success",
      });
    } catch (e) {
      const errorDetails = transactionErrors(e);
      toast(errorDetails);
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onCloseComplete={() => {}}
      size="2xl"
      isCentered
      closeOnOverlayClick={false}
    >
      <ModalOverlay
        bg="none"
        backdropFilter="auto"
        backdropInvert="10%"
        backdropBlur="4px"
      />
      <ModalContent>
        <ModalHeader>Default Backgrounds</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Grid
              templateColumns={{
                base: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(2, 1fr)",
                lg: "repeat(2, 1fr)",
              }}
              gap={6}
              columnGap={6}
              mx={2}
              gridAutoRows="1fr" // Distribute height evenly
            >
              {images.map((image, index) => (
                <Image
                  key={index}
                  src={image.src}
                  alt={image.alt}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                  borderRadius="10px"
                  cursor="pointer"
                  _hover={{
                    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
                  }}
                  onClick={() => {
                    handleSelectedBackground(image.src);
                  }}
                />
              ))}
            </Grid>
          </Box>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

export default BackgroundDefaults;

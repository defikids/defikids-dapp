"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Flex,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useWindowSize } from "usehooks-ts";

const SandboxModal = ({ isOpen, onClose, learnMoreContent }) => {
  const { width } = useWindowSize();

  const handleSize = () => {
    if (width < 600) return "full";
    if (width < 768) return "xl";
    else return "2xl";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={handleSize()}>
      <ModalOverlay
        bg="none"
        backdropFilter="auto"
        backdropInvert="10%"
        backdropBlur="4px"
      />
      <ModalContent
        sx={{
          opacity: "0.9",
        }}
      >
        <ModalHeader>{learnMoreContent.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody
          sx={{
            borderRadius: "10px",
            maxHeight: "80vh",
            overflow: "scroll",
          }}
        >
          <Flex align="center" justify="center" bgColor="white">
            <Grid
              templateColumns="repeat(5, 1fr)"
              templateRows="repeat(1, 1fr)"
              gap={4}
              pt={2}
              px={10}
            >
              <GridItem rowSpan={1} colSpan={5} overflowY="scroll">
                {learnMoreContent.description.map(
                  (text: string, index: number) => (
                    <Text mb={5} color="black" fontSize="lg" key={index}>
                      {text}
                    </Text>
                  )
                )}
              </GridItem>
            </Grid>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SandboxModal;

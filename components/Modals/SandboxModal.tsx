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
  useBreakpointValue,
} from "@chakra-ui/react";
import { useState } from "react";

const SandboxModal = ({ isOpen, onClose, learnMoreContent }) => {
  const isMobileSize = useBreakpointValue({
    base: true,
    sm: false,
    md: false,
    lg: false,
  });

  const Overlay = () => (
    <ModalOverlay
      bg="blackAlpha.300"
      backdropFilter="blur(10px) hue-rotate(90deg)"
    />
  );

  const [overlay] = useState(<Overlay />);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={isMobileSize ? "full" : "4xl"}
      isCentered
    >
      {overlay}
      <ModalContent>
        <ModalHeader>{learnMoreContent.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody
          sx={{
            overflow: "scroll",
            borderRadius: "10px",
          }}
        >
          <Flex align="center" justify="center" bgColor="white">
            <Grid
              templateColumns="repeat(5, 1fr)"
              templateRows="repeat(1, 1fr)"
              gap={4}
              pt={2}
              px={10}
              sx={{
                overflow: "scroll",
              }}
            >
              <GridItem rowSpan={1} colSpan={5}>
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

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Grid,
  GridItem,
  Box,
  ModalFooter,
  useBreakpointValue,
} from "@chakra-ui/react";

const BackgroundDefaults = ({ isOpen, onClose }) => {
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
      onCloseComplete={() => {}}
      size="full"
      isCentered
      closeOnOverlayClick={false}
    >
      <ModalOverlay
        bg="none"
        backdropFilter="auto"
        backdropInvert="10%"
        backdropBlur="4px"
      />
      <ModalContent
        style={{ maxHeight: "calc(100vh - 40px)" }} // Adjust as needed
      >
        <ModalHeader>Register</ModalHeader>
        <ModalCloseButton />
        <ModalBody h="100vh">
          <Box h="100vh" overflowY="scroll">
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
            >
              <GridItem
                w="100%"
                h="20rem"
                minH={isMobileSize ? "auto" : "375px"} // Adjust for mobile
                bgImage="/images/backgrounds/egypt.jpeg"
                bgSize="cover"
                bgRepeat="no-repeat"
                cursor="pointer"
                style={{
                  borderRadius: "10px",
                }}
              />
              <GridItem
                w="100%"
                h="20rem"
                minH={isMobileSize ? "auto" : "375px"} // Adjust for mobile
                bgImage="/images/backgrounds/synthwave.jpeg"
                bgSize="cover"
                bgRepeat="no-repeat"
                cursor="pointer"
                style={{
                  borderRadius: "10px",
                }}
              />
              <GridItem
                w="100%"
                h="20rem"
                minH={isMobileSize ? "auto" : "375px"} // Adjust for mobile
                bgImage="/images/backgrounds/technology.jpeg"
                bgSize="cover"
                bgRepeat="no-repeat"
                cursor="pointer"
                style={{
                  borderRadius: "10px",
                }}
              />
              <GridItem
                w="100%"
                h="20rem"
                minH={isMobileSize ? "auto" : "375px"} // Adjust for mobile
                bgImage="/images/backgrounds/urban.jpeg"
                bgSize="cover"
                bgRepeat="no-repeat"
                cursor="pointer"
                style={{
                  borderRadius: "10px",
                }}
              />
            </Grid>
          </Box>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

export default BackgroundDefaults;

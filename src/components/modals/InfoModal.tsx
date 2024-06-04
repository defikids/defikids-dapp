"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Heading,
  Text,
  Container,
  Flex,
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  AccordionIcon,
  Box,
  Button,
  ModalFooter,
} from "@chakra-ui/react";
import { menuCards } from "@/data/landingPage/menuCards";
import { useRouter } from "next/navigation";

export const InfoModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  //=============================================================================
  //                             HOOKS
  //=============================================================================

  const router = useRouter();
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay
        bg="none"
        backdropFilter="auto"
        backdropInvert="10%"
        backdropBlur="4px"
      />
      <ModalContent bgGradient={["linear(to-r, white, lightgray)"]}>
        <ModalHeader>
          <Heading size="sm">General</Heading>
        </ModalHeader>
        <ModalCloseButton color="black" />
        <ModalBody bgGradient={["linear(to-r, white, lightgray)"]}>
          <Container zIndex={2} overflowY="scroll" my="1rem">
            <Flex
              direction="column"
              justify="center"
              alignContent="center"
              mt="1rem"
              mb="2rem"
            >
              <Accordion allowToggle>
                {menuCards.map(({ title, description, link }) => (
                  <AccordionItem key={title}>
                    <h2>
                      <AccordionButton borderBottom="1px">
                        <Box as="span" flex="1" textAlign="left">
                          <Heading as="h3" size="md" color="black">
                            {title}
                          </Heading>
                        </Box>
                        <AccordionIcon color="black" />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel>
                      <Box>
                        <Text> {description}</Text>
                        <Flex justify="flex-end">
                          <Button
                            size="sm"
                            colorScheme="blue"
                            onClick={() => {
                              router.push(link);
                            }}
                            mt={5}
                          >
                            {`Learn More`}
                          </Button>
                        </Flex>
                      </Box>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </Flex>
          </Container>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

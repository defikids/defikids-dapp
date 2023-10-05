"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Card,
  Stack,
  CardBody,
  CardFooter,
  useDisclosure,
  Center,
  Container,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import SandboxMenu from "@/components/landingPage/SandboxMenu";
import { sandboxLearnMore } from "@/data/landingPage/sandboxLearnMore";
import RegisterModal from "@/components/modals/RegisterModal";
import SandboxModal from "@/components/modals/SandboxModal";
import { useWindowSize } from "usehooks-ts";

const Sandbox = () => {
  //=============================================================================
  //                               STATE
  //=============================================================================

  const [sandboxContent, setSandboxContent] = useState({
    title: "Risk-Free",
    description:
      "Explore the world of blockchain and cryptocurrency with confidence in our risk-free sandbox designed exclusively for kids. The sandbox environment provides a secure and controlled space for children to learn about blockchain technology and interact with various blockchain-based applications. With no exposure to real cryptocurrency markets, our sandbox ensures a risk-free learning experience, putting parents minds at ease.",
  });

  const [isActive, setIsActive] = useState({
    riskFree: true,
    handsOn: false,
    educational: false,
    realistic: false,
  });

  const [learnMoreContent, setLearnMoreContent] = useState(
    sandboxLearnMore.riskFree
  );

  //=============================================================================
  //                               HOOKS
  //=============================================================================

  const { width } = useWindowSize();
  const isMobile = width <= 768;

  const sectionRef = useRef(null);

  const {
    isOpen: isSandboxOpen,
    onOpen: onOpenSandbox,
    onClose: onCloseSandbox,
  } = useDisclosure();

  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onClose: onRegisterClose,
  } = useDisclosure();

  useEffect(() => {
    if (isActive.riskFree) {
      setLearnMoreContent(sandboxLearnMore.riskFree);
    }

    if (isActive.handsOn) {
      setLearnMoreContent(sandboxLearnMore.handsOn);
    }

    if (isActive.educational) {
      setLearnMoreContent(sandboxLearnMore.educational);
    }

    if (isActive.realistic) {
      setLearnMoreContent(sandboxLearnMore.realistic);
    }
  }, [isActive]);

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================
  const handleSetSandBoxContent = (content: any) => {
    setSandboxContent(content);
    if (isMobile) onOpenSandbox();
  };

  const handleSetActive = (active: any) => {
    setIsActive(active);
  };

  return (
    <Box
      ref={sectionRef}
      as="section"
      pt="20rem"
      bgGradient={["linear(to-b, black, #4F1B7C)"]}
      id="Sandbox"
    >
      <Container maxW="container.xl">
        {/* Section Title  */}
        <Flex direction="column" align="center" justify="center">
          <Text color="white" fontSize="xl" textAlign="center" px={12}>
            Through our carefully curated sandbox, kids can engage in hands-on
            learning, earn interest, and even receive rewards—all while
            understanding the fundamentals of blockchain and smartcontracts.
          </Text>
        </Flex>

        {/* Menu Bar */}
        <SandboxMenu
          isActive={isActive}
          handleSetActive={handleSetActive}
          handleSetSandBoxContent={handleSetSandBoxContent}
        />

        {!isMobile && (
          <Card
            direction={{ base: "column", sm: "row" }}
            overflow="hidden"
            bg="white"
            mt={5}
            mx={10}
            style={{
              borderRadius: "20px",
            }}
          >
            <Stack>
              <CardBody>
                <Text color="#82add9" fontSize="xl">
                  {sandboxContent.description}
                </Text>
              </CardBody>

              <CardFooter>
                <Flex justify="flex-end" w="100%">
                  <Button
                    variant="solid"
                    colorScheme="blue"
                    onClick={onOpenSandbox}
                  >
                    {`${sandboxContent.title} continued...`}
                  </Button>
                </Flex>
              </CardFooter>
            </Stack>
          </Card>
        )}
      </Container>

      {/* Section Title  */}
      <Flex
        direction="column"
        align="center"
        justify="center"
        py={isMobile ? "4rem" : "25rem"}
      >
        <Center mb="3rem">
          <Box
            style={{
              color: "#82add9",
            }}
          >
            <Heading size={isMobile ? "3xl" : "4xl"} textAlign="center" pb={3}>
              Join our
            </Heading>
            <Heading
              size={isMobile ? "3xl" : "4xl"}
              textAlign="center"
              pb={3}
              bgGradient="linear(to-l, #7928CA, #FF0080)"
              bgClip="text"
            >
              risk-free
            </Heading>
            <Heading size={isMobile ? "3xl" : "4xl"} textAlign="center" pb={3}>
              sandbox today.
            </Heading>
          </Box>
        </Center>

        <Button
          variant="solid"
          size="lg"
          colorScheme="blue"
          onClick={onRegisterOpen}
        >
          Sign Up
        </Button>
      </Flex>

      {/* Modals */}

      <SandboxModal
        isOpen={isSandboxOpen}
        onClose={onCloseSandbox}
        learnMoreContent={learnMoreContent}
      />

      <RegisterModal isOpen={isRegisterOpen} onClose={onRegisterClose} />
    </Box>
  );
};

export default Sandbox;

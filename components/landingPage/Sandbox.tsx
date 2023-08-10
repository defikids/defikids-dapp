import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useBreakpointValue,
  Card,
  Stack,
  CardBody,
  CardFooter,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import SandboxMenu from "@/components/landingPage/SandboxMenu";
import { sandboxLearnMore } from "@/data/landingPage/sandboxLearnMore";
import RegisterModal from "@/components/Modals/RegisterModal";
import SandboxModal from "@/components/Modals/SandBoxModal";

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
  const isMobileSize = useBreakpointValue({
    base: true,
    sm: false,
    md: false,
    lg: false,
  });

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
  };

  const handleSetActive = (active: any) => {
    setIsActive(active);
  };

  return (
    <Box
      ref={sectionRef}
      as="section"
      pt="12rem"
      bgGradient={["linear(to-b, black, #4F1B7C)"]}
      id="Sandbox"
    >
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

      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        bg="white"
        mt={5}
        mx={10}
        style={{
          borderRadius: "20px",
        }}
        h={isMobileSize ? "auto" : "350px"}
      >
        <Image
          objectFit="cover"
          maxW={{ base: "100%", sm: "400px" }}
          src="/images/sandbox-laptop.jpg"
          alt="kids-on-computers"
        />

        <Stack>
          <CardBody>
            <Heading size="lg" color="#82add9">
              {sandboxContent.title}
            </Heading>

            <Text py="2" color="#82add9" fontSize="xl">
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
                Learn More
              </Button>
            </Flex>
          </CardFooter>
        </Stack>
      </Card>

      {/* Section Title  */}
      <Flex direction="column" align="center" justify="center" py="25rem">
        <Heading size="xl" color="#82add9" pb={10}>
          Join our risk-free blockchain sandbox today
        </Heading>
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

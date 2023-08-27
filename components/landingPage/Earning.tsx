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
import SandboxModal from "@/components/Modals/SandboxModal";

//=============================================================================
//                               STATE
//=============================================================================

const Earning = () => {
  const [sandboxContent, setSandboxContent] = useState({
    title: "Earning",
    description:
      "Earning through investing in cryptocurrencies involves purchasing digital assets with the expectation that their value will increase over time, allowing you to profit from the price appreciation. ",
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
      id="Earning"
    >
      {/* Section Title  */}
      <Flex direction="column" align="center" justify="center">
        <Text color="white" fontSize="xl" textAlign="center" px={12}>
          Explore the world of crypto and unlock new earning opportunities. With
          select platforms, including DefiKids, you can earn interest on your
          cryptocurrency holdings, allowing your assets to grow while you HODL.
          Discover the potential of decentralized finance (DeFi) and let your
          crypto work for you through innovative interest-earning solutions.
        </Text>
      </Flex>

      {/* Menu Bar */}

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

export default Earning;

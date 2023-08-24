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
import SandboxModal from "@/components/Modals/SandBoxModal";
import { sandboxLearnMore } from "@/data/landingPage/sandboxLearnMore";
import NavBar from "../navbar";

const Earning = () => {
  const sectionRef = useRef(null);

  const {
    isOpen: isEarninOpen,
    onOpen: onOpenEarning,
    onClose: onCloseEarning,
  } = useDisclosure();

  const isMobileSize = useBreakpointValue({
    base: true,
    sm: false,
    md: false,
    lg: false,
  });

  const [earningContent, setEarningContent] = useState({
    title: "Earning",
    description:
      "Earning through investing in cryptocurrencies involves purchasing digital assets with the expectation that their value will increase over time, allowing you to profit from the price appreciation. ",
  });

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
          src="/images/three-monitors-defikids.jpg"
          alt="three-monitors"
        />

        <Stack>
          <CardBody>
            <Heading size="lg" color="#1f6ef6">
              {earningContent.title}
            </Heading>

            <Text py="2" color="#1f6ef6" fontSize="xl">
              {earningContent.description}
            </Text>
          </CardBody>

          <CardFooter>
            <Flex justify="flex-end" w="100%">
              <Button
                variant="solid"
                colorScheme="blue"
                onClick={onOpenEarning}
              >
                Learn More
              </Button>
            </Flex>
          </CardFooter>
        </Stack>
      </Card>

      {/* Section Title  */}
      <Flex direction="column" align="center" justify="center" py="25rem">
        <Heading size="xl" color="#1f6ef6" pb={10}>
          Stake and earn!
        </Heading>
      </Flex>

      {/* Modals */}

      {/* <SandboxModal
        isOpen={isSandboxOpen}
        onClose={onCloseSandbox}
        learnMoreContent={learnMoreContent}
      /> */}
    </Box>
  );
};
export default Earning;

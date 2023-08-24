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

const Staking = () => {
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

  const [stakingContent, setStakingContent] = useState({
    title: "Staking",
    description:
      "Staking in crypto involves participating in a Proof-of-Stake (PoS) blockchain network by holding and staking a certain amount of a specific cryptocurrency in a compatible wallet or platform. This helps secure the network and validate transactions. In return for your participation, you earn rewards in the form of additional cryptocurrency. To stake, acquire the supported cryptocurrency, choose a reputable staking platform or wallet, transfer your coins, and engage in the staking process according to platform instructions. Staking provides a way to earn passive income and support the blockchain ecosystem simultaneously. However, it's important to research thoroughly, as staking involves risks and considerations unique to each cryptocurrency and platform.",
  });

  return (
    <Box
      ref={sectionRef}
      as="section"
      pt="12rem"
      bgGradient={["linear(to-b, black, #4F1B7C)"]}
      id="Staking"
    >
      {/* Section Title  */}
      <Flex direction="column" align="center" justify="center">
        <Text color="white" fontSize="xl" textAlign="center" px={12}>
          Staking in the context of cryptocurrency can produce passive income by
          allowing you to earn rewards in the form of additional cryptocurrency
          tokens without actively trading or engaging in complex investment
          strategies.
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
          src="/images/smartphone-city.png"
          alt="kids-on-computers"
        />

        <Stack>
          <CardBody>
            <Heading size="lg" color="#2719b2">
              {stakingContent.title}
            </Heading>

            <Text py="2" color="#2719b2" fontSize="xl">
              {stakingContent.description}
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
        <Heading size="xl" color="#82add9" pb={10}>
          Earn passive income!
        </Heading>
      </Flex>

      {/* Modals */}
    </Box>
  );
};
export default Staking;

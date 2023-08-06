import { useAuthStore } from "@/store/auth/authStore";
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  useColorModeValue,
  useDisclosure,
  Fade,
  ScaleFade,
  Slide,
  SlideFade,
  Collapse,
  CloseButton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import shallow from "zustand/shallow";

type State = {
  riskFree: boolean;
  handsOn: boolean;
  educational: boolean;
  realistic: boolean;
};

const animatedBorderBottom = {
  position: "relative",
  _before: {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "0",
    height: "1px",
    backgroundColor: "#FF0080",
    transition: "width 0.3s ease-in-out",
  },
  "&:hover:before": {
    width: "90%",
  },
};

export default function Main() {
  //=============================================================================
  //                               HOOKS
  //=============================================================================

  const { setNavigationSection } = useAuthStore(
    (state) => ({
      setNavigationSection: state.setNavigationSection,
    }),
    shallow
  );

  useEffect(() => {
    // Function to handle scrolling and update the active section
    const handleScroll = () => {
      // Get all sections in the page
      const sections = document.querySelectorAll("section");

      // Find the section that is currently in view
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (
          rect.top <= window.innerHeight * 0.5 &&
          rect.bottom >= window.innerHeight * 0.5
        ) {
          // setActiveSection(section.id);
          setNavigationSection(section.id);
          break;
        }
      }
    };

    // Add event listener for scrolling
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //=============================================================================
  //                               STATES
  //=============================================================================
  const { isOpen, onToggle } = useDisclosure();
  const [isActive, setIsActive] = useState({
    riskFree: true,
    handsOn: false,
    educational: false,
    realistic: false,
  });

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================
  const handleClick = (key: keyof State) => {
    console.log(key);
    setIsActive((prevState) => {
      const newState: State = { ...prevState };
      // Set all keys to false
      Object.keys(newState).forEach((k) => {
        newState[k as keyof State] = false;
      });
      // Set the specified key to true
      newState[key] = true;
      return newState;
    });
  };

  //=============================================================================
  //                               VARIABLES
  //=============================================================================

  return (
    <>
      {/* Landing Section */}
      <Flex
        direction="column"
        align="center"
        height="100vh"
        width="100vw"
        bgImage="url('/images/Chains_Wallpaper.jpeg')"
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
        style={{
          boxShadow: "inset 0 0 0 1000px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          as="section"
          id="DefiKids"
          mt="12rem"
          style={{
            color: "#82add9",
          }}
        >
          <Heading size="4xl" textAlign="center" pb={3}>
            Earn, save,
          </Heading>
          <Heading size="4xl" textAlign="center" pb={3}>
            stake and invest
          </Heading>
          <Flex align="center" justify="center">
            <Heading size="4xl" textAlign="center" pb={3} pr={6}>
              your
            </Heading>
            <Heading
              size="4xl"
              textAlign="center"
              pb={3}
              bgGradient="linear(to-l, #7928CA, #FF0080)"
              bgClip="text"
            >
              allowance
            </Heading>
          </Flex>
        </Box>
        <Text fontSize="2xl" fontWeight="bold" mt={5}>
          A safe and secure platform
        </Text>
        <Text fontSize="2xl" fontWeight="bold">
          for kids to learn crypto.
        </Text>
      </Flex>

      {/* Sandbox Environment */}
      <Box
        position="relative"
        as="section"
        p={6}
        h="60rem"
        bgGradient={["linear(to-b, black, #4F1B7C)"]}
        id="Sandbox"
      >
        {/* Menu Bar */}
        <Flex align="center" justify="center" mt={25}>
          <Heading
            size="lg"
            textAlign="center"
            p={3}
            bgGradient={
              isActive.riskFree ? "linear(to-l, #8527C3,#82add9)" : "none"
            }
            bgColor={isActive.riskFree ? "none" : "#A0AEBF"}
            bgClip="text"
            cursor="pointer"
            // onClick={() => handleClick("riskFree")}
            onClick={onToggle}
            sx={{
              ...animatedBorderBottom,
            }}
          >
            Risk-Free
          </Heading>

          <Heading
            size="lg"
            textAlign="center"
            p={3}
            bgGradient={
              isActive.handsOn ? "linear(to-l, #8527C3,#82add9)" : "none"
            }
            bgColor={isActive.handsOn ? "none" : "#A0AEBF"}
            bgClip="text"
            cursor="pointer"
            onClick={() => handleClick("handsOn")}
            sx={{
              ...animatedBorderBottom,
            }}
          >
            Hands-On
          </Heading>

          <Heading
            size="lg"
            textAlign="center"
            p={3}
            bgGradient={
              isActive.educational ? "linear(to-l, #8527C3,#82add9)" : "none"
            }
            bgColor={isActive.educational ? "none" : "#A0AEBF"}
            bgClip="text"
            cursor="pointer"
            onClick={() => handleClick("educational")}
            sx={{
              ...animatedBorderBottom,
            }}
          >
            Educational
          </Heading>

          <Heading
            size="lg"
            textAlign="center"
            p={3}
            bgGradient={
              isActive.realistic ? "linear(to-l, #8527C3,#82add9)" : "none"
            }
            bgColor={isActive.realistic ? "none" : "#A0AEBF"}
            bgClip="text"
            cursor="pointer"
            onClick={() => handleClick("realistic")}
            sx={{
              ...animatedBorderBottom,
            }}
          >
            Realistic
          </Heading>
        </Flex>

        {/* Menu Bar - Risk Free*/}
        {/* {isOpen && ( */}
        <Slide direction="bottom" in={isOpen} style={{ zIndex: 100 }}>
          <Box bgColor="white" p={2}>
            <CloseButton
              size="md"
              onClick={onToggle}
              sx={{
                color: "black",
              }}
            />

            <Heading
              size="lg"
              textAlign="center"
              px={3}
              bgGradient="linear(to-l, #8527C3, #82add9)"
              bgClip="text"
            >
              Risk-Free
            </Heading>
          </Box>

          <Flex align="center" justify="center" bgColor="white">
            <Grid
              h="540px"
              templateColumns="repeat(5, 1fr)"
              templateRows="repeat(1, 1fr)"
              gap={4}
              pt={2}
              px={10}
            >
              <GridItem rowSpan={1} colSpan={5}>
                <Flex align="center" justify="center">
                  <Heading size="md" textAlign="center" color="#82add9">
                    Introducing a
                  </Heading>
                  <Heading
                    size="md"
                    textAlign="center"
                    px={3}
                    bgGradient="linear(to-l, #7928CA, #FF0080)"
                    bgClip="text"
                  >
                    safe
                  </Heading>
                  <Heading size="md" textAlign="center" color="#82add9">
                    blockchain sandbox for Kids.
                  </Heading>
                </Flex>

                <Heading size="md" textAlign="center" color="#82add9">
                  the real-world applications of blockchain technology.
                </Heading>
              </GridItem>

              <GridItem rowSpan={1} colSpan={5}>
                <Text mb={5} color="black">
                  Explore the world of blockchain and cryptocurrency with
                  confidence in our risk-free sandbox designed exclusively for
                  kids. The sandbox environment provides a secure and controlled
                  space for children to learn about blockchain technology and
                  interact with various blockchain-based applications. With no
                  exposure to real cryptocurrency markets, our sandbox ensures a
                  risk-free learning experience, putting parents minds at ease.
                </Text>

                <Text mb={5} color="black">
                  Through our carefully curated sandbox, kids can engage in
                  hands-on learning, earn interest, and even receive rewards—all
                  while understanding the fundamentals of blockchain and smart
                  contracts. Funds within the sandbox are solely virtual and
                  used for educational purposes, providing an excellent
                  opportunity for children to develop their financial literacy
                  in a controlled and safe setting.
                </Text>

                <Text mb={5} color="black">
                  Our sandbox empowers kids to explore various blockchain
                  concepts, such as decentralized finance (DeFi) and
                  non-fungible tokens (NFTs), in an educational and entertaining
                  manner. Parents remain in full control, managing any payouts
                  to fiat currency, enabling them to reward their child&apos;s
                  achievements.
                </Text>

                <Text mb={5} color="black">
                  Join our risk-free blockchain sandbox today and let your child
                  embark on an exciting journey into the world of blockchain
                  technology, where learning and fun go hand in hand!
                </Text>
              </GridItem>
            </Grid>
          </Flex>
        </Slide>
        {/* )} */}

        {/* Menu Bar - Hands-On*/}
        {isActive.handsOn && (
          <Flex align="center" justify="center">
            <Grid
              h="200px"
              templateColumns="repeat(5, 1fr)"
              templateRows="repeat(2, 1fr)"
              gap={4}
              p={10}
            >
              <GridItem rowSpan={1} colSpan={5}>
                <Flex align="center" justify="center">
                  <Heading size="md" textAlign="center" color="#82add9">
                    Children get to actively
                  </Heading>
                  <Heading
                    size="md"
                    textAlign="center"
                    px={3}
                    bgGradient="linear(to-l, #7928CA, #FF0080)"
                    bgClip="text"
                  >
                    engage
                  </Heading>
                  <Heading size="md" textAlign="center" color="#82add9">
                    with blockchain technology,
                  </Heading>
                </Flex>

                <Heading size="md" textAlign="center" color="#82add9">
                  exploring its fascinating features in a controlled and safe
                  setting.
                </Heading>
              </GridItem>

              <GridItem rowSpan={2} colSpan={5}>
                <Text mb={5}>
                  Our hands-on approach enables kids to interact directly with
                  various blockchain-based applications, smart contracts, and
                  decentralized finance (DeFi) protocols. By participating in
                  educational activities and simulations, children learn the ins
                  and outs of blockchain without any real-world financial risks.
                </Text>

                <Text mb={5}>
                  Within the sandbox, kids can create and manage virtual assets,
                  trade non-fungible tokens (NFTs), and even experiment with
                  blockchain-powered games and educational applications. They
                  can witness firsthand how blockchain transactions work and
                  understand the power of decentralization.
                </Text>

                <Text mb={5}>
                  Parents can rest assured that our hands-on sandbox ensures a
                  risk-free environment, protecting children from exposure to
                  real cryptocurrency markets. Funds within the sandbox are
                  purely virtual, emphasizing learning and skill-building
                  without any actual financial implications.
                </Text>

                <Text mb={5}>
                  Join our risk-free blockchain sandbox today and let your child
                  embark on an exciting journey into the world of blockchain
                  technology, where learning and fun go hand in hand!
                </Text>
              </GridItem>
            </Grid>
          </Flex>
        )}

        {/* Menu Bar - Educational*/}
        {isActive.educational && (
          <Flex align="center" justify="center">
            <Grid
              h="200px"
              templateColumns="repeat(5, 1fr)"
              templateRows="repeat(2, 1fr)"
              gap={4}
              p={10}
            >
              <GridItem rowSpan={1} colSpan={5}>
                <Flex align="center" justify="center">
                  <Heading size="md" textAlign="center" color="#82add9">
                    Where young minds
                  </Heading>
                  <Heading
                    size="md"
                    textAlign="center"
                    px={3}
                    bgGradient="linear(to-l, #7928CA, #FF0080)"
                    bgClip="text"
                  >
                    embark
                  </Heading>
                  <Heading size="md" textAlign="center" color="#82add9">
                    on an exciting learning journey
                  </Heading>
                </Flex>

                <Heading size="md" textAlign="center" color="#82add9">
                  into the world of blockchain technology.
                </Heading>
              </GridItem>

              <GridItem rowSpan={2} colSpan={5}>
                <Text mb={5}>
                  Through a series of carefully curated activities and
                  simulations, kids gain valuable insights into the fundamental
                  principles of blockchain. They discover how decentralized
                  networks operate, learn about smart contracts, and explore the
                  concepts of digital assets and non-fungible tokens (NFTs).
                </Text>

                <Text mb={5}>
                  In this educational sandbox, children have the opportunity to
                  experiment, create, and manage virtual assets, enabling them
                  to build practical skills in a fun and engaging manner. They
                  delve into the potential applications of blockchain across
                  various industries, from finance and gaming to supply chain
                  management and beyond.
                </Text>

                <Text mb={5}>
                  Our expertly crafted educational content encourages critical
                  thinking and problem-solving, fostering a deeper understanding
                  of blockchain technology and its potential impact on the
                  future. With a strong emphasis on safety and age-appropriate
                  content, parents can have peace of mind knowing their children
                  are learning in a secure environment.
                </Text>

                <Text mb={5}>
                  Join our risk-free blockchain sandbox today and let your child
                  embark on an exciting journey into the world of blockchain
                  technology, where learning and fun go hand in hand!
                </Text>
              </GridItem>
            </Grid>
          </Flex>
        )}

        {/* Menu Bar - Realistic*/}
        {isActive.realistic && (
          <Flex align="center" justify="center">
            <Grid
              h="200px"
              templateColumns="repeat(5, 1fr)"
              templateRows="repeat(2, 1fr)"
              gap={4}
              p={10}
            >
              <GridItem rowSpan={1} colSpan={5}>
                <Flex align="center" justify="center">
                  <Heading size="md" textAlign="center" color="#82add9">
                    A dynamic and
                  </Heading>
                  <Heading
                    size="md"
                    textAlign="center"
                    px={3}
                    bgGradient="linear(to-l, #7928CA, #FF0080)"
                    bgClip="text"
                  >
                    immersive
                  </Heading>
                  <Heading size="md" textAlign="center" color="#82add9">
                    learning environment that mirrors
                  </Heading>
                </Flex>

                <Heading size="md" textAlign="center" color="#82add9">
                  the real-world applications of blockchain technology.
                </Heading>
              </GridItem>

              <GridItem rowSpan={2} colSpan={5}>
                <Text mb={5}>
                  In our realistic sandbox, children engage in simulated
                  scenarios and practical exercises that replicate real
                  blockchain use cases. They witness the functioning of
                  decentralized networks, participate in virtual asset trading,
                  and explore blockchain-based applications across various
                  industries.
                </Text>

                <Text mb={5}>
                  Through interactive games and educational activities, kids
                  develop a deep understanding of the transformative potential
                  of blockchain in finance, supply chain management, and other
                  sectors. They also gain insights into the security measures
                  and transparency features that make blockchain a trusted
                  technology.
                </Text>

                <Text mb={5}>
                  Our realistic approach emphasizes age-appropriate content,
                  ensuring that children learn in a safe and controlled
                  environment. With the use of their allowance, kids can
                  experiment freely, building valuable skills and insights that
                  extend beyond theoretical knowledge.
                </Text>

                <Text mb={5}>
                  By experiencing the realism of blockchain in a secure setting,
                  children become well-prepared to navigate the digital
                  landscape, equipped with the knowledge and confidence to be
                  active participants in shaping the future of technology.
                </Text>

                <Text mb={5}>
                  Join our risk-free blockchain sandbox today and let your child
                  embark on an exciting journey into the world of blockchain
                  technology, where learning and fun go hand in hand!
                </Text>
              </GridItem>
            </Grid>
          </Flex>
        )}

        <Button
          position="absolute"
          bottom="50px" // Adjust the distance from the bottom as needed
          left="50%" // Center the button horizontally
          transform="translateX(-50%)" // Center the button horizontally
        >
          Register
        </Button>
      </Box>

      <Box as="section" id="Earning" p={4} h="50rem" bgColor="white"></Box>
      <Box
        as="section"
        id="Staking"
        p={4}
        h="50rem"
        bgGradient={["linear(to-b, white, #82add9)"]}
      ></Box>
      <Box as="section" id="Investing" p={4} h="50rem" bgColor="black"></Box>

      {/* Sequence Web2 login */}
      <Box
        position="absolute"
        zIndex={1}
        w="80%"
        left="50%"
        transform="translate(-50%, -50%)"
        style={{
          border: "1px solid #82add9",
          borderRadius: "20px",
          backgroundColor: "white",
        }}
      >
        <Center pt={3}>
          <Heading size="lg" color="#82add9">
            Seamless web3 onboarding
          </Heading>
        </Center>
        <Center px={6}>
          <Text fontSize="md" fontWeight="bold" p={6} color="black">
            With Sequence you use your social login to create a non-custodial,
            multi-chain wallet in two clicks without needing to download
            anything or worry about seed phrases.
          </Text>
        </Center>
      </Box>

      <Box
        as="section"
        id="Social Login"
        bgGradient={["linear(to-b, black, #4F1B7C)"]}
      >
        <Flex
          direction="column"
          align="center"
          height="100vh"
          width="100vw"
          bgImage="url('/images/Sequence_Wallet_Login_Art.jpeg')"
          bgPosition="center"
          bgRepeat="no-repeat"
          bgSize="cover"
          px="5rem"
        ></Flex>
      </Box>
    </>
  );
}

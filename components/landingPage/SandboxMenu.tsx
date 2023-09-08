import { Flex, Heading, useBreakpointValue } from "@chakra-ui/react";

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

const SandboxMenu = ({
  isActive,
  handleSetActive,
  handleSetSandBoxContent,
}: {
  isActive: State;
  handleSetActive: (key: any) => void;
  handleSetSandBoxContent: (content: {
    title: string;
    description: string;
  }) => void;
}) => {
  //=============================================================================
  //                               HOOKS
  //=============================================================================
  const isMobileSize = useBreakpointValue({
    base: true,
    sm: false,
    md: false,
    lg: false,
  });
  //=============================================================================
  //                               STATE
  //=============================================================================
  // const [isActive, setIsActive] = useState({
  //   riskFree: true,
  //   handsOn: false,
  //   educational: false,
  //   realistic: false,
  // });

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================
  const handleActiveSandboxFeature = (key: keyof State) => {
    handleSetActive((prevState) => {
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
  return (
    <Flex
      align="center"
      justify="center"
      mt={25}
      mb={10}
      direction={isMobileSize ? "column" : "row"}
    >
      <Heading
        size="lg"
        pt={6}
        pb={2}
        px={3}
        textAlign="center"
        bgGradient={
          isActive.riskFree ? "linear(to-l, #8527C3,#82add9)" : "none"
        }
        bgColor={isActive.riskFree ? "none" : "#A0AEBF"}
        bgClip="text"
        cursor="pointer"
        onClick={() => {
          handleSetSandBoxContent({
            title: "Risk-Free",
            description:
              "Explore the world of blockchain and cryptocurrency with confidence in our risk-free sandbox designed exclusively for kids. The sandbox environment provides a secure and controlled space for children to learn about blockchain technology and interact with various blockchain-based applications. With no exposure to real cryptocurrency markets, our sandbox ensures a risk-free learning experience, putting parents minds at ease.",
          });
          handleActiveSandboxFeature("riskFree");
        }}
        sx={{
          ...animatedBorderBottom,
        }}
      >
        Risk-Free
      </Heading>

      <Heading
        size="lg"
        textAlign="center"
        pt={6}
        pb={2}
        px={3}
        bgGradient={isActive.handsOn ? "linear(to-l, #8527C3,#82add9)" : "none"}
        bgColor={isActive.handsOn ? "none" : "#A0AEBF"}
        bgClip="text"
        cursor="pointer"
        onClick={() => {
          handleSetSandBoxContent({
            title: "Hands-On",
            description:
              "Our hands-on approach enables kids to interact directly with various blockchain-based applications, smart contracts, and decentralized finance (DeFi) protocols. By participating in educational activities and simulations, children learn the ins and outs of blockchain without any real-world financial risks.",
          });
          handleActiveSandboxFeature("handsOn");
        }}
        sx={{
          ...animatedBorderBottom,
        }}
      >
        Hands-On
      </Heading>

      <Heading
        size="lg"
        textAlign="center"
        pt={6}
        pb={2}
        px={3}
        bgGradient={
          isActive.educational ? "linear(to-l, #8527C3,#82add9)" : "none"
        }
        bgColor={isActive.educational ? "none" : "#A0AEBF"}
        bgClip="text"
        cursor="pointer"
        onClick={() => {
          handleSetSandBoxContent({
            title: "Educational",
            description:
              "In this educational sandbox, children have the opportunity to experiment, create, and manage virtual assets, enabling them to build practical skills in a fun and engaging manner. They delve into the potential applications of blockchain across various industries, from finance and gaming to supply chain management and beyond.",
          });
          handleActiveSandboxFeature("educational");
        }}
        sx={{
          ...animatedBorderBottom,
        }}
      >
        Educational
      </Heading>

      <Heading
        size="lg"
        textAlign="center"
        pt={6}
        pb={2}
        px={3}
        bgGradient={
          isActive.realistic ? "linear(to-l, #8527C3,#82add9)" : "none"
        }
        bgColor={isActive.realistic ? "none" : "#A0AEBF"}
        bgClip="text"
        cursor="pointer"
        onClick={() => {
          handleSetSandBoxContent({
            title: "Realistic",
            description:
              " Our realistic approach emphasizes age-appropriate content, ensuring that children learn in a safe and controlled environment. With the use of their allowance, kids can experiment freely, building valuable skills and insights that extend beyond theoretical knowledge.",
          });
          handleActiveSandboxFeature("realistic");
        }}
        sx={{
          ...animatedBorderBottom,
        }}
      >
        Realistic
      </Heading>
    </Flex>
  );
};

export default SandboxMenu;

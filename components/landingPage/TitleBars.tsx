import { Box, Flex, Heading } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

export const SandboxTitleBar = ({ sectionRef }) => {
  // const [isSticky, setIsSticky] = useState(false);

  // let mainNavbar;
  // let WalletDetails;
  // let mainNavbarBottom = useRef(0);
  // let sectionTop = useRef(0);
  // let navBarHeight = useRef(0);

  // useEffect(() => {
  //   mainNavbar = document.getElementById("main-navbar");
  //   WalletDetails = document.getElementById("wallet-navbar");
  //   mainNavbarBottom.current = mainNavbar.getBoundingClientRect().bottom;
  //   navBarHeight.current = mainNavbar.getBoundingClientRect().height;

  //   const section = sectionRef.current;
  //   sectionTop = section.getBoundingClientRect().top;

  //   const handleScroll = () => {
  //     if (mainNavbar && section) {
  //       const section = sectionRef.current;
  //       sectionTop = section.getBoundingClientRect().top;

  //       const SandboxTitleBarElement =
  //         document.getElementById("sandbox-title-bar");
  //       const sandboxTitleBarElementTop =
  //         SandboxTitleBarElement.getBoundingClientRect().top;

  //       console.log("sandboxTitleBarElementTop", sandboxTitleBarElementTop);

  // console log true if the top of the section is above the bottom of the main navbar
  // if (
  //   sandboxTitleBarElementTop &&
  //   sandboxTitleBarElementTop > 0 &&
  //   sandboxTitleBarElementTop <= mainNavbarBottom.current
  // ) {
  //   if (!isSticky) {
  //     console.log("sticky");
  //     setIsSticky(true);
  //   }

  //   console.log(
  //     "sandboxTitleBarElementTop <= mainNavbarBottom",
  //     sandboxTitleBarElementTop <= mainNavbarBottom.current
  //   );
  // } else {
  //   setIsSticky(false);
  // }

  // console.log("mainNavbarBottom", mainNavbarBottom);
  // console.log("sectionTop", sectionTop);
  // console.log("sandboxTitleBarElementTop", sandboxTitleBarElementTop);

  // if (
  //   sandboxTitleBarElementTop <= mainNavbarBottom &&
  //   sectionTop.current <= sandboxTitleBarElementTop
  // ) {
  //   if (!isSticky) {
  //     console.log("sticky");
  //     setIsSticky(true);
  //   }
  // } else {
  //   if (isSticky) {
  //     console.log("not sticky");
  //     setIsSticky(false);
  //   }
  // }
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  return (
    <Box
      id="sandbox-title-bar"
      // position={isSticky ? "fixed" : "static"}
      // top={isSticky ? navBarHeight.current : "auto"} // Adjust the top position to match the height of your main navbar
      // zIndex={isSticky ? "100" : "1"}
      bg="white"
      p={4}
      // transition="transform 0.3s ease-out"
      // transform={isSticky ? "translateY(-100%)" : "none"} // Hide when sticky
      w="100%"
    >
      <Flex direction="column" align="center" justify="center">
        <Heading size="2xl" color="#82add9">
          Sandbox
        </Heading>
      </Flex>
    </Box>
  );
};

export const EarningTitleBar = () => {
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const mainNavbar = document.getElementById("main-navbar");
      const titleBar = document.getElementById(`title-bar-1`);
      if (mainNavbar && titleBar) {
        const mainNavbarBottom = mainNavbar.getBoundingClientRect().bottom;
        const titleBarTop = titleBar.getBoundingClientRect().top;
        setSticky(titleBarTop <= mainNavbarBottom);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box
      id={`title-bar-1`}
      position={sticky ? "sticky" : "static"}
      top={sticky ? "64px" : "auto"} // Adjust the top position to match the height of your main navbar
      zIndex={sticky ? "100" : "1"}
      bg="white"
      p={4}
      transform={sticky && 1 > 0 ? `translateY(-${1 * 64}px)` : "none"} // Adjust the translateY value to adjust the space between title bars
      transition="transform 0.3s ease-out"
      w="100%"
    >
      <Flex direction="column" align="center" justify="center">
        <Heading size="2xl" color="#82add9" pb={5}>
          Earning
        </Heading>
      </Flex>
    </Box>
  );
};

export const StakingTitleBar = () => {
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const mainNavbar = document.getElementById("main-navbar");
      const titleBar = document.getElementById(`title-bar-2`);
      if (mainNavbar && titleBar) {
        const mainNavbarBottom = mainNavbar.getBoundingClientRect().bottom;
        const titleBarTop = titleBar.getBoundingClientRect().top;
        setSticky(titleBarTop <= mainNavbarBottom);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box
      id={`title-bar-2`}
      position={sticky ? "sticky" : "static"}
      top={sticky ? "64px" : "auto"} // Adjust the top position to match the height of your main navbar
      zIndex={sticky ? "100" : "1"}
      bg="white"
      p={4}
      transform={sticky && 2 > 0 ? `translateY(-${2 * 64}px)` : "none"} // Adjust the translateY value to adjust the space between title bars
      transition="transform 0.3s ease-out"
    >
      <Flex direction="column" align="center" justify="center">
        <Heading size="2xl" color="#82add9" pb={5}>
          Staking
        </Heading>
      </Flex>
    </Box>
  );
};

export const InvestingTitleBar = () => {
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const mainNavbar = document.getElementById("main-navbar");
      const titleBar = document.getElementById(`title-bar-3`);
      if (mainNavbar && titleBar) {
        const mainNavbarBottom = mainNavbar.getBoundingClientRect().bottom;
        const titleBarTop = titleBar.getBoundingClientRect().top;
        setSticky(titleBarTop <= mainNavbarBottom);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box
      id={`title-bar-3`}
      position={sticky ? "sticky" : "static"}
      top={sticky ? "64px" : "auto"} // Adjust the top position to match the height of your main navbar
      zIndex={sticky ? "100" : "1"}
      bg="white"
      p={4}
      transform={sticky && 3 > 0 ? `translateY(-${3 * 64}px)` : "none"} // Adjust the translateY value to adjust the space between title bars
      transition="transform 0.3s ease-out"
    >
      <Flex direction="column" align="center" justify="center">
        <Heading size="2xl" color="#82add9" pb={5}>
          Investing
        </Heading>
      </Flex>
    </Box>
  );
};

export const SequenceTitleBar = () => {
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const mainNavbar = document.getElementById("main-navbar");
      const titleBar = document.getElementById(`title-bar-4`);
      if (mainNavbar && titleBar) {
        const mainNavbarBottom = mainNavbar.getBoundingClientRect().bottom;
        const titleBarTop = titleBar.getBoundingClientRect().top;
        setSticky(titleBarTop <= mainNavbarBottom);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box
      id={`title-bar-4`}
      position={sticky ? "sticky" : "static"}
      top={sticky ? "64px" : "auto"} // Adjust the top position to match the height of your main navbar
      zIndex={sticky ? "100" : "1"}
      bg="white"
      p={4}
      transform={sticky && 4 > 0 ? `translateY(-${4 * 64}px)` : "none"} // Adjust the translateY value to adjust the space between title bars
      transition="transform 0.3s ease-out"
    >
      <Flex direction="column" align="center" justify="center">
        <Heading size="2xl" color="#82add9" pb={5}>
          Sequence
        </Heading>
      </Flex>
    </Box>
  );
};

import { useAuthStore } from "@/store/auth/authStore";
import { Box } from "@chakra-ui/react";
import { useEffect } from "react";
import shallow from "zustand/shallow";
import Sandbox from "@/components/landingPage/Sandbox";
import SplashText from "@/components/landingPage/SplashText";
import SequenceLogin from "@/components/landingPage/SequenceLogin";
import Earning from "@/components/landingPage/Earning";
import Staking from "@/components/landingPage/Staking";
import Investing from "@/components/landingPage/Investing";

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
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (
          rect.top <= window.innerHeight * 0.2 &&
          rect.bottom >= window.innerHeight * 0.2
        ) {
          console.log("section.id", section.id);
          setNavigationSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box>
      <SplashText />
      <Sandbox />
      <Earning />
      <Staking />
      <Investing />
      <SequenceLogin />
    </Box>
  );
}

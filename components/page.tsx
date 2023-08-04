import React from "react";
import Navbar from "./navbar";
import WalletNavbar from "./WalletNavbar";
import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";
import Home from "@/styles/Home.module.css";
import Footer from "./footer";
import { useDisclosure } from "@chakra-ui/react";
import FaqModal from "./Modals/FaqModal";
import AboutModal from "./Modals/AboutModal";

const Page = ({ onRegisterOpen }: { onRegisterOpen: () => void }) => {
  const { isLoggedIn } = useAuthStore(
    (state) => ({
      isLoggedIn: state.isLoggedIn,
    }),
    shallow
  );

  const {
    isOpen: isFaqOpen,
    onOpen: onFaqOpen,
    onClose: onFaqClose,
  } = useDisclosure();
  const {
    isOpen: isAboutOpen,
    onOpen: onAboutOpen,
    onClose: onAboutClose,
  } = useDisclosure();

  return (
    <>
      <Navbar
        onFaqOpen={onFaqOpen}
        onAboutOpen={onAboutOpen}
        onRegisterOpen={onRegisterOpen}
      />
      {isLoggedIn && <WalletNavbar />}
      <div className={Home.container} />
      <Footer />
      <FaqModal isOpen={isFaqOpen} onClose={onFaqClose} />
      <AboutModal isOpen={isAboutOpen} onClose={onAboutClose} />
    </>
  );
};

export default Page;

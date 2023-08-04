import React from "react";
import Navbar from "./NavBar";
import WalletNavbar from "./WalletNavbar";
import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";
import Home from "@/styles/Home.module.css";
import Footer from "./Footer";
import { Button } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import FaqModal from "./Modals/FaqModal";
import AboutModal from "./Modals/AboutModal";

const Page = ({ children, onRegisterOpen }) => {
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
      <div className={Home.container}>
        <div>{children}</div>
      </div>
      <Footer />

      <FaqModal isOpen={isFaqOpen} onClose={onFaqClose} />
      <AboutModal isOpen={isAboutOpen} onClose={onAboutClose} />
    </>
  );
};

export default Page;

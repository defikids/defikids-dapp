import React from "react";
import Navbar from "./Navbar";
import WalletNavbar from "./WalletNavbar";
import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";
import Home from "@/styles/Home.module.css";
import NewFooter from "./Footer";

const Page: React.FC = ({ children }) => {
  const { isLoggedIn } = useAuthStore(
    (state) => ({
      isLoggedIn: state.isLoggedIn,
    }),
    shallow
  );

  return (
    <>
      <Navbar />
      {isLoggedIn && <WalletNavbar />}
      <div className={Home.container}>
        <div>{children}</div>
      </div>
      <NewFooter />
    </>
  );
};

export default Page;

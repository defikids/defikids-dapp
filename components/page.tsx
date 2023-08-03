import React from "react";
import Navbar from "./navbar";
import WalletNavbar from "./wallet_navbar";
import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";

const Page: React.FC = ({ children }) => {
  const { isLoggedIn } = useAuthStore(
    (state) => ({
      isLoggedIn: state.isLoggedIn,
    }),
    shallow
  );

  return (
    <div>
      <Navbar />
      {isLoggedIn && <WalletNavbar />}
      <div className="py-[8vh] flex flex-1 flex-col">{children}</div>
    </div>
  );
};

export default Page;

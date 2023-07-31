import React from "react";
import LogoNavbar from "./logo_navbar";
import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";
import Sequence from "../services/sequence";

const Navbar: React.FC = () => {
  const { isLoggedIn, walletAddress, setIsLoggedIn } = useAuthStore(
    (state) => ({
      isLoggedIn: state.isLoggedIn,
      walletAddress: state.walletAddress,
      setIsLoggedIn: state.setIsLoggedIn,
    }),
    shallow
  );

  const handleLogoutClick = async () => {
    setIsLoggedIn(false);
    Sequence.wallet?.disconnect();
    window.location.replace("/");
  };

  const trimWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex justify-between text-blue-dark mx-2">
      <div className="flex">
        <LogoNavbar />
      </div>
      <div className="flex items-center">
        {isLoggedIn && (
          <div className="flex items-center">
            <p className="mr-4 pt-0.5">
              Wallet: {trimWalletAddress(walletAddress)}
            </p>
            <button
              className="bg-blue-dark text-white text-md px-4 py-2 rounded"
              onClick={handleLogoutClick}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

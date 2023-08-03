import React, { useState } from "react";
import LogoNavbar from "./logo_navbar";
import { WalletType, useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";
import Sequence from "../services/sequence";
// import { disconnect } from "@wagmi/core";
import { UserType } from "@/services/contract";
import { useAccountModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Settings } from "@0xsequence/provider";
import Button from "./button";

const WalletNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const {
    walletType,
    isLoggedIn,
    walletAddress,
    setIsLoggedIn,
    setUserType,
    setWalletAddress,
    setWalletType,
  } = useAuthStore(
    (state) => ({
      walletType: state.walletType,
      isLoggedIn: state.isLoggedIn,
      walletAddress: state.walletAddress,
      setIsLoggedIn: state.setIsLoggedIn,
      setUserType: state.setUserType,
      setWalletAddress: state.setWalletAddress,
      setWalletType: state.setWalletType,
    }),
    shallow
  );

  const openWallet = () => {
    const wallet = Sequence.wallet;
    wallet.openWallet();
  };

  const openWalletWithSettings = () => {
    const wallet = Sequence.wallet;

    const settings: Settings = {
      theme: "light",
      includedPaymentProviders: ["moonpay", "ramp", "wyre"],
      defaultFundingCurrency: "eth",
      defaultPurchaseAmount: 400,
      lockFundingCurrencyToDefault: false,
      signInOptions: ["email", "google", "apple"],
    };

    const intent: OpenWalletIntent = {
      type: "openWithOptions",
      options: {
        app: "DefiKids",
        settings,
      },
    };

    const path = "wallet/add-funds";
    // wallet.openWallet();
    wallet.openWallet(path, intent);
  };

  const closeWallet = () => {
    const wallet = Sequence.wallet;
    wallet.closeWallet();
  };

  const handleLogoutClick = () => {
    Sequence.wallet?.disconnect();

    setUserType(UserType.UNREGISTERED);
    setWalletAddress("");
    setIsLoggedIn(false);
    window.location.replace("/");
  };

  const trimWalletAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const options = ["Open Wallet", "Close Wallet", "Disconnect"];

  const handleSelectOption = (option: string) => {
    console.log(option);

    switch (option) {
      case "Open Wallet":
        openWallet();
        break;
      case "Close Wallet":
        closeWallet();
        break;
      case "Disconnect":
        handleLogoutClick();

        break;

      default:
        handleLogoutClick();
        break;
    }
  };

  return (
    <div className="flex justify-end text-blue-dark mx-2">
      {options.map((option, index) => (
        <Button
          key={index}
          className="mx-2 block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
          onClick={() => handleSelectOption(option)}
        >
          {option}
        </Button>
      ))}
    </div>
  );
};

export default WalletNavbar;

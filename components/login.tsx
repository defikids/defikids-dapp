import React from "react";
import Button from "./button";
import Sequence from "../services/sequence";
import { useRouter } from "next/router";
import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";

type ConnectedUser = {
  success: boolean;
  userType?: number;
  accountAddress?: string;
};

const Login: React.FC = () => {
  const router = useRouter();

  const {
    isLoggedIn,
    walletAddress,
    setUserType,
    setIsLoggedIn,
    setWalletAddress,
  } = useAuthStore(
    (state) => ({
      isLoggedIn: state.isLoggedIn,
      userType: state.userType,
      walletAddress: state.walletAddress,
      setUserType: state.setUserType,
      setIsLoggedIn: state.setIsLoggedIn,
      setWalletAddress: state.setWalletAddress,
    }),
    shallow
  );

  const handleConnectSequence = async () => {
    const { success, userType, accountAddress } = (await Sequence.connectWallet(
      true
    )) as ConnectedUser;

    if (!Boolean(isLoggedIn)) {
      router.push("/");
    }

    if (success) {
      setUserType(userType);
      setIsLoggedIn(true);
      setWalletAddress(accountAddress);
    }
  };

  return isLoggedIn ? (
    <>
      <p className="mt-2">Wallet: {walletAddress}</p>
    </>
  ) : (
    <div className="flex flex-col">
      <Button className="mt-4 bg-blue-dark" onClick={handleConnectSequence}>
        Connect
      </Button>
    </div>
  );
};

export default Login;

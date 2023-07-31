import React from "react";
import Button from "./button";
import Sequence from "../services/sequence";
import { useRouter } from "next/router";
import { UserType } from "../services/contract";
import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";

type ConnectedUser = {
  success: boolean;
  userType?: number;
  address?: string;
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

  const logout = (isSequence: boolean = false) => {
    try {
      Sequence.wallet?.disconnect();
    } catch (error) {
      console.error(error);
    }
    if (isSequence) {
      handleLogout();
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    window.location.replace("/");
  };

  const handleConnectSequence = async () => {
    const { success, userType, address } = (await Sequence.connectWallet(
      true
    )) as ConnectedUser;

    if (!Boolean(isLoggedIn)) {
      router.push("/");
    }
    if (success) {
      setUserType(userType);
      setIsLoggedIn(true);
      setWalletAddress(address);

      switch (Number(userType)) {
        case UserType.UNREGISTERED:
          router.push("/register");
          break;
        case UserType.PARENT:
          router.push("/parent");
          break;
        case UserType.CHILD:
          router.push("/child");
          break;
        default:
          logout();
          return;
      }
    }
  };

  return isLoggedIn ? (
    <>
      <p className="mt-2">Wallet: {walletAddress}</p>
    </>
  ) : (
    <div className="flex flex-col">
      <Button className="mt-4 bg-blue-dark" onClick={handleConnectSequence}>
        Connect with Sequence
      </Button>
    </div>
  );
};

export default Login;

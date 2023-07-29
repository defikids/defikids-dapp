import React, { useEffect } from "react";
import Button from "./button";
import { useStore } from "../services/store";
import Sequence from "../services/sequence";
import { useRouter } from "next/router";
import { UserType } from "../services/contract";

const Login: React.FC = () => {
  const store = useStore();
  const router = useRouter();

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
    localStorage.removeItem("@defikids.loggedIn");
    window.location.replace("/");
  };

  const handleConnectSequence = async () => {
    const success = await Sequence.connectWallet(true);
    if (success) {
      const userType = localStorage.getItem("@defikids.userType");
      const isLoggedIn = localStorage.getItem("@defikids.isLoggedIn");

      if (!Boolean(isLoggedIn)) {
        router.push("/");
      }

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

  return store.state.loggedIn ? (
    <>
      <p className="mt-2">Wallet: {store.state.wallet}</p>
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

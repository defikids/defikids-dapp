"use client";
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";
import { watchAccount } from "@wagmi/core";
import { getUserByWalletAddress } from "@/services/mongo/routes/user";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { initialState } from "@/store/auth/createAuthStore";

const Auth = () => {
  const router = useRouter();
  const { address: connectedAccount } = useAccount();

  /*
   *  Sets the selected address to the connected account on initial load
   */
  useEffect(() => {
    if (connectedAccount) {
      setConnectedWallet(connectedAccount);
    }
  }, [connectedAccount]);

  /*
   * Watches for changes on the connected account
   */
  watchAccount((account) => {
    const { address } = account;

    if (address && connectedWallet && address !== connectedWallet) {
      setConnectedWallet(address);
      router.push("/");
    }
  });

  const { connectedWallet, setConnectedWallet } = useAuthStore(
    (state) => ({
      connectedWallet: state.connectedWallet,
      setConnectedWallet: state.setConnectedWallet,
    }),
    shallow
  );

  /*
   * This hook will check if the user has a dark mode preference set in local storage
   */
  useEffect(() => {
    const colorMode = localStorage.getItem("chakra-ui-color-mode");
    if (colorMode !== "dark") {
      localStorage.setItem("chakra-ui-color-mode", "dark");
    }
  }, []);

  return <></>;
};

export default Auth;

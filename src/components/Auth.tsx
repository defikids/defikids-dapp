"use client";
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth/authStore";
import { useContractStore } from "@/store/contract/contractStore";
import { shallow } from "zustand/shallow";
import { ethers } from "ethers";
import { watchAccount } from "@wagmi/core";
import { getUserByWalletAddress } from "@/services/mongo/routes/user";
import {
  DEFIKIDS_PROXY_ADDRESS,
  GOERLI_DK_STABLETOKEN_ADDRESS,
  TOKEN_LOCKERS_ADDRESS,
} from "@/blockchain/contract-addresses";
import { defikidsCoreABI } from "@/blockchain/artifacts/defikids-core";
import { stableTokenABI } from "@/blockchain/artifacts/stable-token";
import { tokenLockersABI } from "@/blockchain/artifacts/tokenLockers";
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
    const { isConnected, address } = account;

    if (address && connectedWallet && address !== connectedWallet) {
      setConnectedWallet(address);
      router.push("/");
    }

    if (!isConnected && connectedWallet) {
      setFetchedUserDetails(false);
      setWalletConnected(false);
      setIsLoggedIn(false);
      setConnectedWallet("");
      setUserDetails({ ...initialState.userDetails });
    }
  });

  const {
    connectedWallet,
    setConnectedWallet,
    setWalletConnected,
    setUserDetails,
    setFetchedUserDetails,
    setIsLoggedIn,
  } = useAuthStore(
    (state) => ({
      connectedWallet: state.connectedWallet,
      setConnectedWallet: state.setConnectedWallet,
      setWalletConnected: state.setWalletConnected,
      setUserDetails: state.setUserDetails,
      setFetchedUserDetails: state.setFetchedUserDetails,
      setIsLoggedIn: state.setIsLoggedIn,
    }),
    shallow
  );

  const {
    setConnectedSigner,
    setProvider,
    setDefiDollarsContractInstance,
    setStableTokenContractInstance,
  } = useContractStore(
    (state) => ({
      setConnectedSigner: state.setConnectedSigner,
      setProvider: state.setProvider,
      setDefiDollarsContractInstance: state.setDefiDollarsContractInstance,
      setStableTokenContractInstance: state.setStableTokenContractInstance,
    }),
    shallow
  );

  /*
   * This hook will check for the user's wallet address and set the user type. It will also set the provider and signer in the store
   */
  useEffect(() => {
    const init = async () => {
      if (!connectedWallet) return;
      setWalletConnected(true);

      // @ts-ignore
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(connectedWallet);

      // add provider and signer to store
      setProvider(provider);
      setConnectedSigner(signer);

      const defiDollarsContract = new ethers.Contract(
        DEFIKIDS_PROXY_ADDRESS,
        defikidsCoreABI,
        signer
      );

      const stableTokenContract = new ethers.Contract(
        GOERLI_DK_STABLETOKEN_ADDRESS,
        stableTokenABI,
        signer
      );

      setDefiDollarsContractInstance(defiDollarsContract);
      setStableTokenContractInstance(stableTokenContract);

      const user = (await getUserByWalletAddress(connectedWallet)) as any;

      if (!user?.error) {
        setUserDetails(user);
        setIsLoggedIn(true);
        setFetchedUserDetails(true);
        return;
      }
      setUserDetails({ ...initialState.userDetails });
      setConnectedWallet("");
      setIsLoggedIn(false);
    };

    init();
  }, [connectedWallet]);

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

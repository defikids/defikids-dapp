"use client";
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth/authStore";
import { useContractStore } from "@/store/contract/contractStore";
import { shallow } from "zustand/shallow";
import { ethers, providers } from "ethers";
import { watchAccount } from "@wagmi/core";
import { getUserByWalletAddress } from "@/services/mongo/routes/user";
import { DEFIKIDS_PROXY_ADDRESS } from "@/blockchain/contract-addresses";
import { abi } from "@/blockchain/artifacts/goerli/defi-dollars";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { initialState } from "@/store/auth/createAuthStore";
import { User } from "@/data-schema/types";

const Auth = () => {
  const [selectedAddress, setSelectedAddress] = useState("");

  const router = useRouter();
  const { address: connectedAccount } = useAccount();

  /*
   *  Sets the selected address to the connected account on initial load
   */
  useEffect(() => {
    if (connectedAccount) {
      setSelectedAddress(connectedAccount);
    }
  }, [connectedAccount]);

  /*
   * Watches for changes on the connected account
   */
  watchAccount((account) => {
    const { isConnected, address } = account;

    if (address && address !== selectedAddress) {
      setSelectedAddress(address);
      router.push("/");
    }

    if (!isConnected && selectedAddress) {
      setFetchedUserDetails(false);
      setWalletConnected(false);
      setIsLoggedIn(false);
      setSelectedAddress("");
      setUserDetails({ ...initialState.userDetails });
    }
  });

  const {
    setWalletConnected,
    setUserDetails,
    setFetchedUserDetails,
    setIsLoggedIn,
  } = useAuthStore(
    (state) => ({
      setWalletConnected: state.setWalletConnected,
      setUserDetails: state.setUserDetails,
      setFetchedUserDetails: state.setFetchedUserDetails,
      setIsLoggedIn: state.setIsLoggedIn,
    }),
    shallow
  );

  const { setConnectedSigner, setProvider, setDefiDollarsContractInstance } =
    useContractStore(
      (state) => ({
        setConnectedSigner: state.setConnectedSigner,
        setProvider: state.setProvider,
        setDefiDollarsContractInstance: state.setDefiDollarsContractInstance,
      }),
      shallow
    );

  /*
   * This hook will check for the user's wallet address and set the user type. It will also set the provider and signer in the store
   */
  useEffect(() => {
    const init = async () => {
      if (!selectedAddress) return;
      setWalletConnected(true);

      // @ts-ignore
      const provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(selectedAddress);

      // add provider and signer to store
      setProvider(provider);
      setConnectedSigner(signer);

      const defiDollarsContract = new ethers.Contract(
        DEFIKIDS_PROXY_ADDRESS,
        abi,
        signer
      );

      setDefiDollarsContractInstance(defiDollarsContract);

      const user = (await getUserByWalletAddress(selectedAddress)) as any;

      if (!user?.error) {
        setUserDetails(user);
        setIsLoggedIn(true);
        setFetchedUserDetails(true);
        return;
      }
      setUserDetails({ ...initialState.userDetails });
      setSelectedAddress("");
      setIsLoggedIn(false);
    };

    init();
  }, [selectedAddress]);

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

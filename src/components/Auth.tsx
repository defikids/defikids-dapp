"use client";
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth/authStore";
import { useContractStore } from "@/store/contract/contractStore";
import { shallow } from "zustand/shallow";
import { ethers, providers } from "ethers";
import { watchAccount } from "@wagmi/core";
import { useSwitchNetwork } from "wagmi";
import { getNetwork } from "@wagmi/core";
import { getUserByWalletAddress } from "@/services/mongo/routes/user";
import { DEFI_DOLLARS_ADDRESS } from "@/blockchain/contract-addresses";
import { abi } from "@/blockchain/artifacts/defi-dollars";

const Auth = () => {
  const [selectedAddress, setSelectedAddress] = useState("") as any;
  const [hasCheckedUserType, setHasCheckedUserType] = useState(false);
  const { switchNetwork } = useSwitchNetwork();
  const { chain } = getNetwork();

  useEffect(() => {
    if (chain?.id && chain.id !== 5) {
      switchNetwork?.(5);
    }
  }, [chain]);

  watchAccount((account) => {
    const { isConnected, address } = account;

    if (
      userDetails?.wallet &&
      address &&
      userDetails?.wallet !== (address as string)
    ) {
      setHasCheckedUserType(false);
      setWalletConnected(false);
      setLogout();
    }
    if (isConnected) {
      setHasCheckedUserType(false);
      setSelectedAddress(address);
      setWalletConnected(true);
    }
  });

  const {
    setWalletConnected,
    setLogout,
    setUserDetails,
    userDetails,
    setFetchedUserDetails,
  } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
      setWalletConnected: state.setWalletConnected,
      setLogout: state.setLogout,
      setUserDetails: state.setUserDetails,
      setFetchedUserDetails: state.setFetchedUserDetails,
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
   * This hook will check for the user's wallet address and set the user type and family id. It will also set the provider and signer in the store
   */
  useEffect(() => {
    const init = async () => {
      if (!selectedAddress || hasCheckedUserType) return;

      // @ts-ignore
      const provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(selectedAddress);

      // add provider and signer to store
      setProvider(provider);
      setConnectedSigner(signer);

      const defiDollarsContract = new ethers.Contract(
        DEFI_DOLLARS_ADDRESS,
        abi,
        signer
      );

      setDefiDollarsContractInstance(defiDollarsContract);

      const user = await getUserByWalletAddress(selectedAddress);
      setHasCheckedUserType(true);

      if (user.response?.status !== 404) {
        setUserDetails(user);
      }
      setFetchedUserDetails(true);
    };

    init();
  }, [selectedAddress, hasCheckedUserType]);

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

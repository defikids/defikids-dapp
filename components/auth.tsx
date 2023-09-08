import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { UserType } from "@/dataSchema/enums";
import { useAuthStore } from "@/store/auth/authStore";
import { useContractStore } from "@/store/contract/contractStore";
import { shallow } from "zustand/shallow";
import { providers } from "ethers";
import { watchAccount } from "@wagmi/core";
import axios from "axios";
import { User } from "@/dataSchema/types";

const Auth = ({
  onRegisterOpen,
  setHasCheckedUserType,
  hasCheckedUserType,
}: {
  onRegisterOpen: () => void;
  setHasCheckedUserType: (hasCheckedUserType: boolean) => void;
  hasCheckedUserType: boolean;
}) => {
  //=============================================================================
  //                               HOOKS
  //=============================================================================

  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  watchAccount((account) => {
    const { isConnected, address } = account;

    if (walletAddress && address && walletAddress !== (address as string)) {
      console.log("walletAddress", walletAddress);
      console.log("address", address);
      setHasCheckedUserType(false);
      setLogout();
    }
    if (isConnected) {
      setHasCheckedUserType(false);
      setSelectedAddress(address);
    }
  });

  const {
    isLoggedIn,
    userDetails,
    setIsLoggedIn,
    setLogout,
    setUserDetails,
    walletAddress,
    setWalletAddress,
  } = useAuthStore(
    (state) => ({
      isLoggedIn: state.isLoggedIn,
      userDetails: state.userDetails,
      setIsLoggedIn: state.setIsLoggedIn,
      setLogout: state.setLogout,
      setUserDetails: state.setUserDetails,
      walletAddress: state.walletAddress,
      setWalletAddress: state.setWalletAddress,
    }),
    shallow
  );

  const { setConnectedSigner, setProvider } = useContractStore(
    (state) => ({
      setConnectedSigner: state.setConnectedSigner,
      setProvider: state.setProvider,
    }),
    shallow
  );

  /*
   * This hook will listen for the beforeunload event (when the user refreshes the page) and navigate the user to the home page
   */
  // useEffect(() => {
  //   const handleBeforeUnload = (e) => {
  //     e.preventDefault();
  //     router.push("/");
  //   };

  //   // Add the event listener
  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   // Clean up the event listener when the component unmounts
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, [router]);

  /*
   * This hook will check for the user's wallet address and set the user type and family id. It will also set the provider and signer in the store
   */
  useEffect(() => {
    const fetchUserType = async () => {
      if (!selectedAddress || hasCheckedUserType) return;

      // @ts-ignore
      const provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(selectedAddress);

      // add provider and signer to store
      setProvider(provider);
      setConnectedSigner(signer);

      const { data } = await axios.get(
        `/api/vercel/get-json?key=${selectedAddress}`
      );

      const user: User = data;
      setHasCheckedUserType(true);

      if (user) {
        setUserDetails(user);
      }
      setIsLoggedIn(true);
      setWalletAddress(selectedAddress);
    };

    fetchUserType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  /*
   * This hook will navigate the user to the correct page based on their user type
   */
  useEffect(() => {
    setTimeout(() => {
      if (router.pathname === "/admin") {
        router.push("/admin");
        return;
      }

      if (hasCheckedUserType) {
        switch (userDetails?.userType) {
          case UserType.UNREGISTERED:
            onRegisterOpen();
            break;
          case UserType.PARENT:
            router.push("/parent");
            break;
          case UserType.CHILD:
            router.push("/child");
            break;
          default:
            router.push("/");
            return;
        }
      }
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAddress, hasCheckedUserType]);

  return <></>;
};

export default Auth;

import { useEffect } from "react";
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

  watchAccount((account) => {
    const { isConnected, address, isDisconnected } = account;

    if (isDisconnected) {
      setLogout();
      setHasCheckedUserType(false);
    }

    if (isConnected) {
      setWalletAddress(address);
      setIsLoggedIn(true);
    }
  });

  const {
    userType,
    walletAddress,
    setUserType,
    setIsLoggedIn,
    setWalletAddress,
    setLogout,
  } = useAuthStore(
    (state) => ({
      walletAddress: state.walletAddress,
      userType: state.userType,
      setUserType: state.setUserType,
      setIsLoggedIn: state.setIsLoggedIn,
      setWalletAddress: state.setWalletAddress,
      setLogout: state.setLogout,
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

  /**
   * This hook will check for the user's wallet address and set the user type and family id. It will also set the provider and signer in the store
   **/
  useEffect(() => {
    const fetchUserType = async () => {
      if (!walletAddress || hasCheckedUserType) return;

      // @ts-ignore
      const provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(walletAddress);

      // add provider and signer to store
      setProvider(provider);
      setConnectedSigner(signer);

      const { data } = await axios.get(
        `/api/vercel/get-json?key=${walletAddress}`
      );

      const user: User = data;
      console.log("data - kv user", data);

      if (user) {
        setUserType(user.userType);
      }
      setHasCheckedUserType(true);
    };

    fetchUserType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, hasCheckedUserType]);

  /**
   * This hook will check if the user has a dark mode preference set in local storage
   **/
  useEffect(() => {
    const colorMode = localStorage.getItem("chakra-ui-color-mode");
    if (colorMode !== "dark") {
      localStorage.setItem("chakra-ui-color-mode", "dark");
    }
  }, []);

  /**
   * This hook will navigate the user to the correct page based on their user type
   **/
  useEffect(() => {
    if (router.pathname === "/admin") {
      router.push("/admin");
      return;
    }

    if (hasCheckedUserType) {
      switch (userType) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCheckedUserType]);

  return <></>;
};

export default Auth;

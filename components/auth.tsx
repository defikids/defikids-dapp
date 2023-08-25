import { useEffect } from "react";
import { useRouter } from "next/router";
import { UserType } from "../services/contract";
import { useAuthStore } from "@/store/auth/authStore";
import { useContractStore } from "@/store/contract/contractStore";
import { shallow } from "zustand/shallow";
import { providers } from "ethers";
import { watchAccount } from "@wagmi/core";
import HostContract from "@/services/contract";

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
      console.log("disconnected");
      setLogout();
      setHasCheckedUserType(false);
    }

    if (isConnected) {
      const selectedWalletAddress = address.toLowerCase();

      const storedWalletAddress = localStorage.getItem(
        "defi-kids.wallet-address"
      );

      if (selectedWalletAddress !== storedWalletAddress) {
        localStorage.setItem("defi-kids.wallet-address", selectedWalletAddress);
        localStorage.removeItem("defi-kids.family-id");

        router.push("/");
        setHasCheckedUserType(false);
      }

      setWalletAddress(selectedWalletAddress);
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

      const contract = await HostContract.fromProvider(provider);
      const getUserType = await contract.getUserType(walletAddress);

      setUserType(getUserType);
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
    if (hasCheckedUserType) {
      switch (Number(userType)) {
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

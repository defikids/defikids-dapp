import { useEffect } from "react";
import { useRouter } from "next/router";
import HostContract, { UserType } from "../services/contract";
import Web3Auth from "@/services/web3auth";
import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";
import { ethers } from "ethers";

const Auth = ({ onRegisterOpen }: { onRegisterOpen: () => void }) => {
  //=============================================================================
  //                               HOOKS
  //=============================================================================
  const router = useRouter();

  const {
    isLoggedIn,
    userType,
    walletAddress,
    setUserType,
    setIsLoggedIn,
    setWalletAddress,
  } = useAuthStore(
    (state) => ({
      walletAddress: state.walletAddress,
      isLoggedIn: state.isLoggedIn,
      userType: state.userType,
      setUserType: state.setUserType,
      setIsLoggedIn: state.setIsLoggedIn,
      setWalletAddress: state.setWalletAddress,
    }),
    shallow
  );

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
    if (isLoggedIn) {
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
  }, [isLoggedIn, userType]);

  /**
   * This hook will initialize the web3auth modal
   **/
  useEffect(() => {
    const init = async () => {
      try {
        await Web3Auth.initializeModal(handleLogin, logout);
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, []);

  /**
   * This hook will check if the user changes the network
   **/
  // useEffect(() => {
  //   const chainId = Sequence.wallet.getChainId();
  //   if (chainId) return;
  //   if (chainId !== 5) {
  //     router.push("/");
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [Sequence.wallet.getChainId()]);

  //=============================================================================
  //                             FUNCTIONS
  //=============================================================================
  const handleLogin = async () => {
    try {
      console.log("handleLogin");

      const provider = new ethers.providers.Web3Provider(
        Web3Auth.web3auth.provider
      );

      const signer = provider.getSigner();

      console.log("signer", signer);
      const accountAddress = await signer.getAddress();
      console.log("accountAddress", accountAddress);

      const contract = await HostContract.fromProvider(
        provider,
        accountAddress
      );

      console.log("contract", contract);

      const userType = await contract?.getUserType(accountAddress);
      console.log("userType", userType);
      console.log("accountAddress", accountAddress);

      let familyId;

      if (userType === UserType.PARENT) {
        familyId = await contract?.getFamilyIdByOwner(accountAddress);
        console.log("familyId", familyId);
      }

      console.log("userType", userType);

      updateConnectedUser(userType, accountAddress, true, familyId);

      navigateUser(Number(userType));
    } catch (error) {
      console.log("error", error);
      // handleLogout();
    }
  };

  const updateConnectedUser = (
    userType: number,
    address: string,
    loggedIn: boolean,
    familyId?: string
  ) => {
    setUserType(userType);
    setWalletAddress(address);
    setIsLoggedIn(loggedIn);

    loggedIn
      ? localStorage.setItem("defi-kids.family-id", familyId)
      : localStorage.removeItem("defi-kids.family-id");
  };

  const navigateUser = (userType: number) => {
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
        // handleLogout();
        return;
    }
  };

  const logout = () => {
    Web3Auth.logout();

    updateConnectedUser(UserType.UNREGISTERED, "", false);
    window.location.replace("/");
  };

  return <></>;
};

export default Auth;

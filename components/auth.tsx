import { useEffect } from "react";
import { useRouter } from "next/router";
import { UserType } from "../services/contract";
import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";
import { ethers } from "ethers";
import { watchAccount } from "@wagmi/core";
import { HOST_ADDRESS } from "@/store/contract/contractStore";
import Host from "@/abis/contracts/Host.json";

const Auth = ({ onRegisterOpen }: { onRegisterOpen: () => void }) => {
  //=============================================================================
  //                               HOOKS
  //=============================================================================
  const router = useRouter();

  watchAccount((account) => {
    const { isConnected, address } = account;

    if (isConnected) {
      localStorage.remove("defi-kids.family-id");
      setWalletAddress(address);
      setIsLoggedIn(true);
    }
  });

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
   * This hook will check for the user's wallet address and set the user type and family id
   **/
  useEffect(() => {
    if (!walletAddress) return;

    const fetchUserType = async () => {
      // create ether provider
      const provider = new ethers.providers.InfuraProvider(
        "goerli",
        process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
      );

      // create contract
      const contract = new ethers.Contract(HOST_ADDRESS, Host.abi, provider);

      // getUserType
      const getUserType = await contract.getUserType(walletAddress);
      setUserType(getUserType);

      if (userType === UserType.PARENT) {
        // check if familyID is set
        const storedFamilyId = localStorage.getItem("defi-kids.family-id");
        if (!storedFamilyId) {
          const familyId = await contract?.getFamilyIdByOwner(walletAddress);
          localStorage.setItem("defi-kids.family-id", familyId);
          console.log("familyId", familyId);
        }
      }

      navigateUser(Number(userType));
    };

    fetchUserType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

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

  //=============================================================================
  //                             FUNCTIONS
  //=============================================================================

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

  return <></>;
};

export default Auth;

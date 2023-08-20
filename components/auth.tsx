import { useEffect } from "react";
import { useRouter } from "next/router";
import HostContract, { UserType } from "../services/contract";
import Sequence from "../services/sequence";
import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";
import { sequence } from "0xsequence";

const Auth = ({ onRegisterOpen }: { onRegisterOpen: () => void }) => {
  //=============================================================================
  //                               HOOKS
  //=============================================================================
  const router = useRouter();

  const { isLoggedIn, userType, setUserType, setIsLoggedIn, setWalletAddress } =
    useAuthStore(
      (state) => ({
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
   * This hook will check if the user is already logged in with sequence
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
   * This hook will check if the user is already logged in with sequence
   **/
  useEffect(() => {
    const init = async () => {
      try {
        const wallet = sequence.getWallet();
        const session = wallet.getSession();

        if (session) {
          handleLoginSequence(session, wallet);
        }
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, []);

  /**
   * This hook will check if the user changes the network
   **/
  useEffect(() => {
    const chainId = Sequence.wallet.getChainId();
    if (chainId) return;
    if (chainId !== 5) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Sequence.wallet.getChainId()]);

  //=============================================================================
  //                             FUNCTIONS
  //=============================================================================

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
        logout();
        return;
    }
  };

  const logout = () => {
    Sequence.wallet?.disconnect();
    updateConnectedUser(UserType.UNREGISTERED, "", false);
    window.location.replace("/");
  };

  const handleLoginSequence = async (
    session: any,
    wallet: sequence.provider.SequenceProvider
  ) => {
    try {
      const connectDetails = session;
      const { accountAddress } = connectDetails;

      const signer = wallet.getSigner();

      const contract = await HostContract.fromProvider(signer, accountAddress);
      const userType = await contract?.getUserType(accountAddress);
      console.log("userType", userType);
      const familyId = await contract?.getFamilyIdByOwner(accountAddress);
      console.log("familyId", familyId);

      updateConnectedUser(userType, accountAddress, true, familyId);

      navigateUser(Number(userType));
    } catch (error) {
      console.error(error);
      logout();
    }
  };

  return <></>;
};

export default Auth;

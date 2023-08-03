import { useEffect } from "react";
import { useRouter } from "next/router";
import HostContract, { UserType } from "../services/contract";
import Sequence from "../services/sequence";
import { useAuthStore } from "@/store/auth/authStore";
import { useContractStore } from "@/store/contract/contractStore";
import { shallow } from "zustand/shallow";
import { sequence } from "0xsequence";
import { ethers } from "ethers";
import { toast } from "react-toastify";

const Auth: React.FC = () => {
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

  const updateConnectedUser = (
    userType: number,
    address: string,
    loggedIn: boolean
  ) => {
    setUserType(userType);
    setWalletAddress(address);
    setIsLoggedIn(loggedIn);
  };

  const switchNetworkMessage = () => {
    toast.error("Please switch to the Mumbai testnet");
  };

  const navigateUser = (userType: number) => {
    const chainId = Sequence.wallet?.getChainId();

    if (chainId !== 80001) {
      switchNetworkMessage();
      return;
    }

    switch (userType) {
      case UserType.UNREGISTERED:
        router.push("/register");
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

  const handleLoginSequence = async (session: any, account: string, wallet) => {
    try {
      const connectDetails = session;
      const { accountAddress } = connectDetails;

      const signer = wallet.getSigner();

      const contract = await HostContract.fromProvider(signer, accountAddress);
      const userType = await contract?.getUserType();

      updateConnectedUser(userType, accountAddress, true);

      // navigateUser(Number(userType));
    } catch (error) {
      console.error(error);
      logout();
    }
  };

  /**
   * This hook will navigate the user to the correct page based on the user type
   **/
  useEffect(() => {
    const chainId = Sequence.wallet?.getChainId();
    console.log("chainId", chainId);

    if (chainId !== 80001) {
      switchNetworkMessage();
      return;
    }

    if (isLoggedIn) {
      switch (Number(userType)) {
        case UserType.UNREGISTERED:
          router.push("/register");
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
  }, [isLoggedIn, userType, Sequence.wallet?.getChainId()]);

  /**
   * This hook will check if the user is already logged in with sequence
   **/
  useEffect(() => {
    const init = async () => {
      try {
        const wallet = sequence.getWallet();
        const session = wallet.getSession();

        if (session) {
          handleLoginSequence(session, session.accountAddress, wallet);
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
    if (chainId !== 80001) {
      router.push("/");
      switchNetworkMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Sequence.wallet.getChainId()]);

  return <></>;
};

export default Auth;

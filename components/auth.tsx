import { useEffect } from "react";
import { useRouter } from "next/router";
import HostContract, { UserType } from "../services/contract";
import Sequence from "../services/sequence";
import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";
import { sequence } from "0xsequence";

const Auth = ({ onRegisterOpen }: { onRegisterOpen: () => void }) => {
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

  const logout = () => {
    Sequence.wallet?.disconnect();
    updateConnectedUser(UserType.UNREGISTERED, "", false);
  };

  const handleLoginSequence = async (session: any, account: string, wallet) => {
    try {
      const connectDetails = session;
      const { accountAddress } = connectDetails;

      const signer = wallet.getSigner();

      const contract = await HostContract.fromProvider(signer, accountAddress);
      const userType = await contract?.getUserType();

      updateConnectedUser(userType, accountAddress, true);
    } catch (error) {
      console.error(error);
      logout();
    }
  };

  /**
   * This hook will navigate the user to the correct page based on the user type
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

  return <></>;
};

export default Auth;

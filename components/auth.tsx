import { useEffect } from "react";
import { useRouter } from "next/router";
import { UserType } from "../services/contract";
import Sequence from "../services/sequence";
import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";
import { sequence } from "0xsequence";

const Auth: React.FC = () => {
  const router = useRouter();

  const { setUserType, setIsLoggedIn, setWalletAddress } = useAuthStore(
    (state) => ({
      setUserType: state.setUserType,
      setIsLoggedIn: state.setIsLoggedIn,
      setWalletAddress: state.setWalletAddress,
    }),
    shallow
  );

  const handleLoginSequence = async (session: any, account: string, wallet) => {
    try {
      const connectDetails = session;

      const signer = wallet.getSigner();
      const signerChainId = await signer.getChainId();

      const connectedUserType = await Sequence.getUserType(
        connectDetails,
        signerChainId
      );

      setUserType(connectedUserType);
      setIsLoggedIn(true);
      setWalletAddress(account);

      switch (Number(connectedUserType)) {
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
          //   logout();
          return;
      }
    } catch (error) {
      console.error(error);
      //   logout(true);
    }
  };

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

  //   useEffect(() => {
  //     if (!store.state.loggedIn) {
  //       router.push("/");
  //     }

  //     switch (store.state.userType) {
  //       case UserType.UNREGISTERED:
  //         router.push("/register");
  //         break;
  //       case UserType.PARENT:
  //         router.push("/parent");
  //         break;
  //       case UserType.CHILD:
  //         router.push("/child");
  //         break;
  //       default:
  //         logout();
  //         return;
  //     }
  //   }, [store.state.userType]);

  //   useEffect(() => {
  //     const provider = store.state.provider;
  //     if (!store.state.provider) {
  //       return;
  //     }

  //     provider.on("network", (newNetwork, oldNetwork) => {
  //       if (oldNetwork) {
  //         logout();
  //         window.location.reload();
  //       }
  //     });

  //     provider.on("chainChanged", async () => {
  //       logout();
  //       window.location.reload();
  //     });

  //     provider.on("accountsChanged", async () => {
  //       logout();
  //       window.location.reload();
  //     });
  //   }, []);

  return <></>;
};

export default Auth;

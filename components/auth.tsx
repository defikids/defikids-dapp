import { useEffect } from "react";
import { ethers } from "ethers";
import { loginUser, StoreAction, useStore } from "../services/store";
import Web3Auth from "../services/web3auth";
import { useRouter } from "next/router";
import { UserType } from "../services/contract";
import Sequence from "../services/sequence";

const Auth: React.FC = () => {
  const store = useStore();
  const router = useRouter();

  const handleLogin = async (data) => {
    try {
      const provider = new ethers.providers.Web3Provider(
        Web3Auth.web3auth.provider
      );
      loginUser(provider, store.dispatch);
    } catch (error) {
      logout();
    }
  };

  const handleLoginSequence = async (data) => {
    try {
      // const provider = new ethers.providers.JsonRpcProvider(
      //   Sequence.wallet.getProvider()
      // );
      // loginUser(provider, store.dispatch);
    } catch (error) {
      logout();
    }
  };

  const handleSequenceLogout = async () => {
    Sequence.wallet.disconnect();
  };
  const logout = () => {
    try {
      Web3Auth.logout();
    } catch (error) {
      console.error(error);
    }
    try {
      Sequence.wallet.disconnect();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    store.dispatch({ type: StoreAction.LOGOUT });
    window.location.replace("/");
  };

  useEffect(() => {
    const init = async () => {
      try {
        Sequence.init(handleLoginSequence, handleLogout);
        await Web3Auth.initializeModal(handleLogin, handleLogout);
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    switch (store.state.userType) {
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
  }, [store.state.userType]);

  useEffect(() => {
    const provider = store.state.provider;
    if (!store.state.provider) {
      return;
    }

    provider.on("network", (newNetwork, oldNetwork) => {
      if (oldNetwork) {
        logout();
        window.location.reload();
      }
    });

    provider.on("chainChanged", async () => {
      logout();
      window.location.reload();
    });

    provider.on("accountsChanged", async () => {
      logout();
      window.location.reload();
    });
  }, []);

  return <></>;
};

export default Auth;

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
      loginUser(provider, logout, store.dispatch);
    } catch (error) {
      logout();
    }
  };

  const handleLoginSequence = async (accounts: string[], wallet) => {
    try {
      wallet.saveSession();
      const account = accounts.shift();
      const authProvider = await wallet.getProvider();
      const provider = new ethers.providers.Web3Provider(authProvider);
      loginUser(provider, () => logout(true), store.dispatch, account);
    } catch (error) {
      console.error(error);
      logout(true);
    }
  };

  const logout = (isSequence: boolean = false) => {
    try {
      Web3Auth.logout();
    } catch (error) {
      console.error(error);
    }
    try {
      Sequence.wallet?.disconnect();
    } catch (error) {
      console.error(error);
    }
    if (isSequence) {
      handleLogout();
    }
  };

  const handleLogout = () => {
    store.dispatch({ type: StoreAction.LOGOUT });
    window.location.replace("/");
  };

  useEffect(() => {
    const init = async () => {
      try {
        const wallet = Sequence.init(handleLoginSequence, handleLogout);
        const session = wallet.getSession();
        if (session) {
          handleLoginSequence([session.accountAddress], wallet);
          return;
        }

        await Web3Auth.initializeModal(handleLogin, handleLogout);
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!store.state.loggedIn) {
      router.push("/");
    }

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

import { useEffect } from "react";
import { ethers } from "ethers";
import { loginUser, StoreAction, useStore } from "../services/store";
import Web3Auth from "../services/web3auth";

const Auth: React.FC = () => {
  const store = useStore();
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

  const logout = () => {
    Web3Auth.logout();
  };

  const handleLogout = () => {
    store.dispatch({ type: StoreAction.LOGOUT });
  };

  useEffect(() => {
    const init = async () => {
      try {
        console.log("init");
        await Web3Auth.initializeModal(handleLogin, handleLogout);
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      return;
    }

    window.ethereum.on("chainChanged", async () => {
      logout();
      window.location.reload();
    });

    window.ethereum.on("accountsChanged", async () => {
      console.log("account changed");
      logout();
      window.location.reload();
    });
  }, []);

  return <></>;
};

export default Auth;

import React, { useEffect } from "react";
import { ethers, Signer } from "ethers";
import Web3Auth from "../services/web3auth";
import Button from "./button";
import { loginUser, StoreAction, UserType, useStore } from "../services/store";

const Login: React.FC = () => {
  const store = useStore();

  const handleConnectWallet = async () => {
    Web3Auth.connect();
  };

  const handleLogin = async (data) => {
    try {
      const provider = new ethers.providers.Web3Provider(
        Web3Auth.web3auth.provider
      );
      loginUser(provider, store.dispatch);
    } catch (error) {
      handleLogoutClick();
    }
  };

  const handleLogout = () => {
    store.dispatch({ type: StoreAction.LOGOUT });
  };

  const handleLogoutClick = () => {
    Web3Auth.logout();
  };

  useEffect(() => {
    const init = async () => {
      try {
        await Web3Auth.initializeModal(handleLogin, handleLogout);
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, []);

  return store.state.loggedIn ? (
    <>
      <Button onClick={handleLogoutClick}>Logout</Button>
      <p className="mt-2">
        Wallet: {store.state.wallet} {UserType[store.state.userType]}
      </p>
    </>
  ) : (
    <Button onClick={handleConnectWallet}>Connect your wallet</Button>
  );
};

export default Login;

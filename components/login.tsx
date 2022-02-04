import React, { useEffect } from "react";
import { ethers } from "ethers";
import Web3Auth from "../services/web3auth";
import Button from "./button";
import { StoreAction, useStore } from "../services/store";

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
      const accounts = await provider.send("eth_requestAccounts", []);
      const wallet = accounts[0];
      store.dispatch({ type: StoreAction.LOGIN, payload: { wallet } });
    } catch (error) {
      console.error(error);
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
      <p className="mt-2">Wallet: {store.state.wallet}</p>
    </>
  ) : (
    <Button onClick={handleConnectWallet}>Connect your wallet</Button>
  );
};

export default Login;

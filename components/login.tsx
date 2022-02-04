import React, { useEffect } from "react";
import Web3Auth from "../services/web3auth";
import Button from "./button";
import { useStore } from "../services/store";

const Login: React.FC = () => {
  const store = useStore();

  const handleConnectWallet = async () => {
    Web3Auth.connect();
  };

  const handleLogoutClick = () => {
    Web3Auth.logout();
  };

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

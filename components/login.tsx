import React, { useEffect } from "react";
import Web3Auth from "../services/web3auth";
import Button from "./button";
import { useStore } from "../services/store";
import Sequence from "../services/sequence";

const Login: React.FC = () => {
  const store = useStore();

  const handleConnectWallet = async () => {
    Web3Auth.connect();
  };

  const handleConnectSequence = async () => {
    const test = await Sequence.connectWallet(true);
    console.log(test.session);
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
    <div className="flex flex-col">
      <Button onClick={handleConnectWallet}>Connect your wallet</Button>
      <Button className="mt-4 bg-blue-dark" onClick={handleConnectSequence}>
        Connect with Sequence
      </Button>
    </div>
  );
};

export default Login;

import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Button from "../components/button";
import { useStore } from "../services/store";
import getUSDCXBalance from "../services/usdcx_contract";
import { downgradeToken, upgradeToken } from "../hooks/useSFCore";
import { ethers } from "ethers";

const Parent: React.FC = () => {
  const router = useRouter();
  const {
    state: { contract, userType, provider, wallet },
  } = useStore();

  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const updateBalance = () => {
    getUSDCXBalance(provider, wallet).then((value) =>
      setBalance(parseFloat(value))
    );
  };

  useEffect(() => {
    if (!provider) {
      return;
    }
    updateBalance();
  }, [provider]);

  const handleTopUp = async () => {
    setLoading(true);
    const result = await upgradeToken(5, provider, wallet);
    setLoading(false);
    console.log(
      parseFloat(ethers.utils.formatEther(result.newBalances.USDCxBalance)),
      parseFloat(ethers.utils.formatEther(result.newBalances.USDCBalance))
    );
    setBalance(
      parseFloat(ethers.utils.formatEther(result.newBalances.USDCxBalance))
    );
  };

  const handleWithdraw = async () => {
    setLoading(true);
    const result = await downgradeToken(5, provider, wallet);
    setLoading(false);
    console.log(
      parseFloat(ethers.utils.formatEther(result.newBalances.USDCxBalance)),
      parseFloat(ethers.utils.formatEther(result.newBalances.USDCBalance))
    );
    setBalance(
      parseFloat(ethers.utils.formatEther(result.newBalances.USDCxBalance))
    );
  };

  return (
    <div>
      <h1 className="text-xxl text-blue-dark mb-[5vh] ">
        Welcome to your
        <br /> parent account,
      </h1>
      <div className="bg-blue-dark px-6 py-8 rounded-xl text-white flex justify-between items-end stretch">
        <div className="flex flex-col items-start">
          <p className="text-sm mb-1">AVAILABLE FUNDS</p>
          <h1 className="text-xxl mb-6">
            {balance}
            <span className="text-base"> USDx</span>
          </h1>
          <Image
            src="https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=018"
            alt="USDC logo"
            width={48}
            height={48}
          />
        </div>
        <div className="flex" style={{ height: 130 }}>
          <Button
            className={`mr-6 flex items-end pb-6 rounded-full ${
              loading && "animate-pulse pointer-events-none"
            }`}
            style={{ borderRadius: 8 }}
            onClick={handleTopUp}
          >
            Top up account
          </Button>
          <Button
            className={`bg-blue-light mr-6 flex items-end pb-6 ${
              loading && "animate-pulse pointer-events-none"
            }`}
            style={{ borderRadius: 8 }}
            onClick={handleWithdraw}
          >
            Withdraw funds
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Parent;

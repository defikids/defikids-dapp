import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import Button from "../components/button";
import { useStore } from "../services/store";
import { getUSDCXBalance } from "../services/usdcx_contract";
import AddChildModal from "../components/add_child_modal";
import Plus from "../components/plus";
import Arrow from "../components/arrow";
import TopUpModal from "../components/topup_modal";
import WithdrawModal from "../components/withdraw_modal";
import TransferModal from "../components/transfer_modal";
import StreamModal from "../components/stream_modal";
import { IChild } from "../services/contract";
import AnimatedNumber from "../components/animated_number";
import { flowDetails } from "../hooks/useSuperFluid";
import { ethers } from "ethers";
import StakeContract, { IStake } from "../services/stake";
import { MOCK_ALLOCATIONS } from "../components/child";

const FETCH_BALANCE_INTERVAL = 25000; // correct balance value X milliseconds
const MAX_FETCH_RETRIES = 60; // max retries to fetch from provider when expecting a change
const FETCH_RETRY_TIMEOUT = 1000; // timeout between fetches when expecting a change

const Child: React.FC = () => {
  const {
    state: { provider, wallet },
  } = useStore();
  const [stakes, setStakes] = useState<IStake[]>();
  const [stakeContract, setStakeContract] = useState<StakeContract>();

  useEffect(() => {
    if (provider) {
      StakeContract.fromProvider(provider).then(setStakeContract);
    }
  }, [provider]);

  const fetchStakes = async (retry = false, retries = 0) => {
    setStakesLoading(true);
    const newStakes = await stakeContract.fetchStakes();
    console.log("ola", newStakes);
    if (
      retry &&
      retries < MAX_FETCH_RETRIES &&
      newStakes.length === newStakes.length
    ) {
      return setTimeout(
        () => fetchStakes(true, retries + 1),
        FETCH_RETRY_TIMEOUT
      );
    }
    setStakesLoading(false);
    setStakes(newStakes);
  };

  useEffect(() => {
    if (!stakeContract) {
      return;
    }

    fetchStakes();
  }, [stakeContract]);

  const [balance, setBalance] = useState<number>();
  const [netFlow, setNetFlow] = useState<number>(0);
  const [stakesLoading, setStakesLoading] = useState(false);

  const updateBalance = () => {
    getUSDCXBalance(provider, wallet).then((value) => {
      setBalance(parseFloat(value));
    });
  };

  const updateNetFlow = async () => {
    const result = await flowDetails(wallet);
    setNetFlow(parseFloat(ethers.utils.formatEther(result.cfa.netFlow)));
  };

  useEffect(() => {
    if (!provider) {
      return;
    }
    const id = setInterval(() => {
      updateBalance();
    }, FETCH_BALANCE_INTERVAL);

    updateBalance();
    updateNetFlow();
    return () => clearInterval(id);
  }, [provider]);

  const [showAddChild, setShowAddChild] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [transferChild, setTransferChild] = useState<Omit<IChild, "access">>();
  const [streamChild, setStreamChild] = useState<Omit<IChild, "access">>();

  return (
    <div>
      <h1 className="text-xxl text-blue-dark mb-[5vh] ">
        Welcome to your
        <br /> child account,
      </h1>
      <div className="bg-blue-oil px-6 py-8 rounded-xl text-white flex justify-between items-end stretch">
        <div className="flex flex-col items-start">
          <p className="text-sm mb-1">AVAILABLE FUNDS</p>
          <h1 className={`text-xxl mb-6 flex items-end`}>
            {balance ? <AnimatedNumber value={balance} rate={netFlow} /> : 0}
            <span className="text-base ml-2"> USDx</span>
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
            size="lg"
            className={`mr-6 rounded-full`}
            style={{ borderRadius: 8 }}
            onClick={() => setShowTopUp(true)}
          >
            <div className="flex items-center">
              <span className="mr-6">Top up account</span>
              <Arrow dir="up" />
            </div>
          </Button>
          <Button
            size="lg"
            className={`bg-blue-light mr-6`}
            style={{ borderRadius: 8 }}
            onClick={() => setShowWithdraw(true)}
          >
            <div className="flex items-center">
              <span className="mr-6">Withdraw funds</span>
              <Arrow dir="down" />
            </div>
          </Button>
        </div>
      </div>
      <div className={`mt-16 ${stakesLoading && "animate-pulse"}`}>
        <p className="text-sm mb-8">YOUR KIDS</p>
        <div className="flex items-start"></div>
        <Button
          className="text-sm w-full rounded-md flex justify-end mt-4"
          onClick={() => setShowAddChild(true)}
        >
          <div className="flex items-center">
            <Plus />
            <span className="ml-6 font-medium text-base">
              Allocate your funds
            </span>
          </div>
        </Button>
      </div>
      <AddChildModal
        show={showAddChild}
        onClose={() => setShowAddChild(false)}
        onAdd={() => fetchStakes()}
      />
      <TopUpModal
        show={showTopUp}
        onClose={() => setShowTopUp(false)}
        onTransfer={() => updateBalance()}
      />
      <WithdrawModal
        show={showWithdraw}
        onClose={() => setShowWithdraw(false)}
        onTransfer={() => updateBalance()}
        balance={Math.floor(balance)}
      />
      <TransferModal
        show={!!transferChild}
        onClose={() => setTransferChild(undefined)}
        onTransfer={() => updateBalance()}
        balance={Math.floor(balance)}
        child={transferChild}
      />
      <StreamModal
        show={!!streamChild}
        onClose={() => setStreamChild(undefined)}
        onTransfer={() => updateBalance()}
        balance={Math.floor(balance)}
        child={streamChild}
      />
    </div>
  );
};

export default Child;

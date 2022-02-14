import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import Button from "../components/button";
import { StoreAction, useStore } from "../services/store";
import { getUSDCXBalance } from "../services/usdcx_contract";
import Plus from "../components/plus";
import Arrow from "../components/arrow";
import TopUpModal from "../components/topup_modal";
import WithdrawModal from "../components/withdraw_modal";
import AnimatedNumber from "../components/animated_number";
import { flowDetails } from "../hooks/useSuperFluid";
import { ethers } from "ethers";
import StakeContract from "../services/stake";
import AllocateModal from "../components/allocate_modal";
import Allocation from "../components/allocation";
import Logo from "../components/logo";

const FETCH_BALANCE_INTERVAL = 25000; // correct balance value X milliseconds
const MAX_FETCH_RETRIES = 60; // max retries to fetch from provider when expecting a change
const FETCH_RETRY_TIMEOUT = 1000; // timeout between fetches when expecting a change

export interface IStake {
  amount: number;
  duration: number;
  name: string;
  reward: number;
}

const Child: React.FC = () => {
  const {
    dispatch,
    state: { provider, wallet, stakeContract },
  } = useStore();
  const [stakes, setStakes] = useState<IStake[]>([]);

  const initStakeContract = async () => {
    if (!provider) {
      return;
    }
    const stakeContract = await StakeContract.fromProvider(provider, wallet);
    dispatch({
      type: StoreAction.STAKE_CONTRACT,
      payload: stakeContract as any,
    });
  };

  useEffect(() => {
    if (provider) {
      initStakeContract();
    }
  }, [provider]);

  // const fetchStakes = async (retry = false, retries = 0) => {
  //   setStakesLoading(true);
  //   const newStakes = await stakeContract.fetchStakes();
  //   console.log("ola", newStakes);
  //   if (
  //     retry &&
  //     retries < MAX_FETCH_RETRIES &&
  //     newStakes.length === newStakes.length
  //   ) {
  //     return setTimeout(
  //       () => fetchStakes(true, retries + 1),
  //       FETCH_RETRY_TIMEOUT
  //     );
  //   }
  //   setStakesLoading(false);
  //   setStakes(newStakes);
  // };

  // useEffect(() => {
  //   if (!stakeContract) {
  //     return;
  //   }

  //   fetchStakes();
  // }, [stakeContract]);

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

  const [showAllocate, setShowAllocate] = useState(false);
  const [updateAllocation, setUpdateAllocation] = useState<IStake>();
  const [showTopUp, setShowTopUp] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const { investedFunds, availableFunds, totalRewards } = useMemo(() => {
    const investedFunds = stakes.reduce(
      (acc, stake) => (acc += stake.amount),
      0
    );
    return {
      investedFunds,
      availableFunds: (balance ?? 0) - investedFunds,
      totalRewards: stakes.reduce((acc, stake) => (acc += stake.reward), 0),
    };
  }, [stakes, balance]);

  return (
    <div>
      <h1 className="text-xxl text-blue-dark mb-[5vh] ">Welcome Peter</h1>
      <div className="bg-blue-oil px-6 py-8 rounded-xl text-white flex justify-between items-end stretch">
        <div className="flex flex-col items-start">
          <p className="text-sm mb-1">AVAILABLE FUNDS</p>
          <h1 className={`text-xxl mb-6 flex items-end`}>
            {balance ? (
              <AnimatedNumber value={balance - investedFunds} rate={netFlow} />
            ) : (
              0
            )}
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
            className={`bg-[#47a1b5] mr-6`}
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
      <div className="rounded-lg border-2 border-grey-light mt-6">
        <div className="p-6 flex">
          <Image src="/placeholder_child.jpg" width={64} height={64} />
          <div className="ml-6">
            <div className="mb-2 flex items-center">
              <h3 className="text-blue-dark text-lg mr-3">Peter</h3>
              <Button className="bg-[#47a1b5]" size="sm">
                Withdraws allowed
              </Button>
            </div>
            <p className="text-grey-medium">{wallet}</p>
          </div>
        </div>
        <div className="flex border-t-2 border-grey-light">
          <div className="flex flex-col text-blue-dark">
            <div className="flex-1 p-4 border-b-2 border-grey-light">
              <p className="text-s mb-1">AVAILABLE FUNDS</p>
              <h3 className="text-lg">
                {Math.floor(availableFunds)}{" "}
                <span className="text-base"> USDx</span>
              </h3>
            </div>
            <div className="flex-1 p-4 border-b-2 border-grey-light">
              <p className="text-s mb-1">INVESTED FUNDS</p>
              <h3 className="text-lg">
                {Math.floor(investedFunds)}{" "}
                <span className="text-base"> USDx</span>
              </h3>
            </div>
            <div className="flex-1 p-4">
              <p className="text-s mb-1">TOTAL REWARDS</p>
              <h3 className="text-lg flex">
                <span className="mr-1">{totalRewards.toFixed(2)} </span>
                <Logo variant="blue" />
              </h3>
            </div>
          </div>
          <div className="border-l-2 border-grey-light pl-4 py-4 pb-0 flex flex-col flex-1">
            <p className="text-s">YOUR ALLOCATIONS</p>
            <div
              className="flex-1 overflow-auto flex flex-col pb-3 pr-4"
              style={{ maxHeight: 300 }}
            >
              {stakes.map((a) => (
                <div
                  className="flex items-center hover:cursor-pointer"
                  key={a.name}
                  onClick={() => setUpdateAllocation({ ...a })}
                >
                  <Allocation
                    className="flex-1"
                    key={a.name}
                    name={a.name}
                    value={a.amount}
                    duration={0}
                    durationTotal={a.duration}
                  />
                  <Button className="ml-4 bg-blue-oil mt-3 text-base" size="sm">
                    Add funds
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Button
        className="text-sm w-full rounded-md flex justify-end mt-4"
        onClick={() => setShowAllocate(true)}
      >
        <div className="flex items-center">
          <Plus />
          <span className="ml-6 font-medium text-base">
            Allocate your funds
          </span>
        </div>
      </Button>
      <AllocateModal
        show={showAllocate || !!updateAllocation}
        onClose={() => {
          setShowAllocate(false);
          setUpdateAllocation(undefined);
        }}
        onAllocate={(stake) => {
          setStakes([...stakes, stake]);
        }}
        update={updateAllocation}
        onUpdate={(stake) => {
          const newStakes = [...stakes];
          const i = newStakes.findIndex((s) => s.name === stake.name);
          const newStake = { ...stakes[i] };
          newStake.amount += stake.amount;
          newStake.reward += stake.reward;
          newStakes[i] = newStake;
          setStakes(newStakes);
        }}
        balance={Math.floor(availableFunds)}
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
        balance={Math.floor(availableFunds)}
      />
    </div>
  );
};

export default Child;

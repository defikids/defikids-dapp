import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Button from "../components/button";
import { useStore } from "../services/store";
import { getUSDCXBalance } from "../services/usdcx_contract";
import AddChildModal from "../components/add_child_modal";
import Plus from "../components/plus";
import Arrow from "../components/arrow";
import Child from "../components/child";
import TopUpModal from "../components/topup_modal";
import WithdrawModal from "../components/withdraw_modal";
import TransferModal from "../components/transfer_modal";
import StreamModal from "../components/stream_modal";
import { IChild } from "../services/contract";
import AnimatedNumber from "../components/animated_number";
import { flowDetails } from "../hooks/useSuperFluid";
import { ethers } from "ethers";
import TransferAllModal from "../components/transfer_all_modal";
import StakeContract from "../services/stake";

const FETCH_BALANCE_INTERVAL = 25000; // correct balance value X milliseconds
const MAX_FETCH_RETRIES = 60; // max retries to fetch from provider when expecting a change
const FETCH_RETRY_TIMEOUT = 1000; // timeout between fetches when expecting a change

const Parent: React.FC = () => {
  const {
    state: { contract, provider, wallet },
  } = useStore();
  const [children, setChildren] = useState<IChild[]>([]);
  const [childrenStakes, setChildrenStakes] = useState({});
  const [stakeContract, setStakeContract] = useState<StakeContract>();

  const fetchChildren = useCallback(
    async (retry = false, retries = 0) => {
      setChildrenLoading(true);
      const newChildren = await contract.fetchChildren();
      if (
        retry &&
        retries < MAX_FETCH_RETRIES &&
        children.length === newChildren.length
      ) {
        return setTimeout(
          () => fetchChildren(true, retries + 1),
          FETCH_RETRY_TIMEOUT
        );
      }
      setChildrenLoading(false);
      setChildren(newChildren);
      console.log("new", newChildren);
    },
    [children.length, contract]
  );

  useEffect(() => {
    if (!contract) {
      return;
    }

    fetchChildren();
  }, [contract, fetchChildren]);

  useEffect(() => {
    if (provider && wallet) {
      StakeContract.fromProvider(provider, wallet).then((contract) =>
        setStakeContract(contract)
      );
    }
  }, [provider, wallet]);

  useEffect(() => {
    if (!stakeContract || !children.length) {
      setChildrenStakes({});
      return;
    }
    const fetchChildDetails = async () => {
      const childDetails = {};
      await Promise.all(
        children.map(async (child) => {
          const [details, stakes] = await Promise.all([
            stakeContract.fetchStakerDetails(child._address),
            stakeContract.fetchStakes(child._address),
          ]);
          childDetails[child._address] = { ...details, stakes };
        })
      );
      setChildrenStakes(childDetails);
    };
    fetchChildDetails();
  }, [stakeContract, children]);

  const [childKey, setChildKey] = useState(0);
  const [balance, setBalance] = useState<number>();
  const [netFlow, setNetFlow] = useState<number>(0);
  const [childrenLoading, setChildrenLoading] = useState(false);

  const updateBalance = () => {
    getUSDCXBalance(provider, wallet).then((value) => {
      setBalance(parseFloat(value));
    });
    setChildKey((key) => key + 1);
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
  const [showTransferAll, setShowTransferAll] = useState(false);
  const [transferChild, setTransferChild] = useState<IChild>();
  const [streamChild, setStreamChild] = useState<IChild>();

  return (
    <div>
      <h1 className="text-xxl text-blue-dark mb-[5vh] ">
        Welcome to your
        <br /> parent account,
      </h1>
      <div className="bg-blue-dark px-6 py-8 rounded-xl text-white flex justify-between items-end stretch">
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
      <div className={`mt-16 ${childrenLoading && "animate-pulse"}`}>
        <div className="mb-8 flex items-center">
          <p className="text-md">YOUR KIDS</p>
          <Button
            size="sm"
            className="bg-blue-oil ml-4"
            onClick={() => {
              setShowTransferAll(true);
            }}
          >
            Transfer to all kids
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-14">
          {children.map((c) => (
            <Child
              key={c._address + childKey}
              {...c}
              {...childrenStakes[c._address]}
              onTransfer={() => setTransferChild(c)}
              onStream={() => setStreamChild(c)}
            />
          ))}
        </div>
        <Button
          className="text-sm w-full rounded-md flex justify-end mt-4"
          onClick={() => setShowAddChild(true)}
        >
          <div className="flex items-center">
            <Plus />
            <span className="ml-6 font-medium text-base">
              {children.length === 0 ? "Add a new kid" : "Add more kids"}
            </span>
          </div>
        </Button>
      </div>
      <AddChildModal
        show={showAddChild}
        onClose={() => setShowAddChild(false)}
        onAdd={() => fetchChildren(true)}
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
      <TransferAllModal
        show={showTransferAll}
        onClose={() => setShowTransferAll(false)}
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

export default Parent;

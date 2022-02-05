import Image from "next/image";
import React, { useEffect, useState } from "react";
import Button from "../components/button";
import { useStore } from "../services/store";
import getUSDCXBalance from "../services/usdcx_contract";
import { downgradeToken, upgradeToken } from "../hooks/useSFCore";
import { ethers } from "ethers";
import AddChildModal from "../components/add_child_modal";
import Plus from "../components/plus";
import Arrow from "../components/arrow";
import Child from "../components/child";
import TopUpModal from "../components/topup_modal";
import WithdrawModal from "../components/withdraw_modal";

const Parent: React.FC = () => {
  const {
    state: { contract, provider, wallet },
  } = useStore();
  const [children, setChildren] = useState([]);

  const fetchChildren = async () => {
    const children = await contract.fetchChildren();
    setChildren(children);
  };

  useEffect(() => {
    if (!contract) {
      return;
    }

    fetchChildren();
  }, [contract]);

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

  const [showAddChild, setShowAddChild] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

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
            size="lg"
            className={`mr-6 rounded-full ${
              loading && "animate-pulse pointer-events-none"
            }`}
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
            className={`bg-blue-light mr-6 ${
              loading && "animate-pulse pointer-events-none"
            }`}
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
      <div className="mt-16">
        <p className="text-sm mb-8">YOUR KIDS</p>
        <div className="flex items-start">
          {children.map((c) => (
            <Child key={c[0]} address={c[0]} name={c[1]} access={c[2]} />
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
        onAdd={() => fetchChildren()}
      />
      <TopUpModal
        show={showTopUp}
        onClose={() => setShowTopUp(false)}
        onTransfer={setBalance}
      />
      <WithdrawModal
        show={showWithdraw}
        onClose={() => setShowWithdraw(false)}
        onTransfer={setBalance}
        balance={balance}
      />
    </div>
  );
};

export default Parent;

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
import { BigNumber, ethers } from "ethers";
import StakeContract, { IStake, IStakerDetails } from "../services/stake";
import AllocateModal from "../components/allocate_modal";
import Allocation from "../components/allocation";
import Logo from "../components/logo";

const FETCH_BALANCE_INTERVAL = 25000; // correct balance value X milliseconds
const MAX_FETCH_RETRIES = 60; // max retries to fetch from provider when expecting a change
const FETCH_RETRY_TIMEOUT = 1000; // timeout between fetches when expecting a change

const Child: React.FC = () => {
  const {
    dispatch,
    state: { provider, wallet, stakeContract },
  } = useStore();
  const [details, setDetails] = useState<IStakerDetails>({
    totalInvested: BigNumber.from(0),
    totalRewards: BigNumber.from(0),
    totalCreatedStakes: BigNumber.from(0),
  });
  const [stakes, setStakes] = useState<IStake[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [netFlow, setNetFlow] = useState<number>(0);
  const [loading, setLoading] = useState(false);

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

  const fetchStakes = async () => {
    try {
      setLoading(true);
      const newStakes = await stakeContract.fetchStakes();
      setStakes(newStakes);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  async function fetchStakerDetails(loading = true) {
    try {
      loading && setLoading(true);
      const details = await stakeContract.fetchStakerDetails();
      setDetails(details);
    } catch (error) {
      console.error(error);
    } finally {
      loading && setLoading(false);
    }
  }

  useEffect(() => {
    if (!stakeContract) {
      return;
    }

    fetchStakerDetails(false);
    fetchStakes();
  }, [stakeContract]);

  const updateBalance = () => {
    getUSDCXBalance(provider, wallet).then((value) => {
      setBalance(parseFloat(value));
    });
  };

  // update balance flow
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

  const handleAllocate = async (transaction: ethers.ContractReceipt) => {
    fetchStakerDetails(false);
    fetchStakes();
  };

  const [showAllocate, setShowAllocate] = useState(false);
  const [updateAllocation, setUpdateAllocation] = useState<IStake>();
  const [showTopUp, setShowTopUp] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const stakesToShow = useMemo(
    () => stakes.filter((s) => s.remainingDays >= 0),
    [stakes]
  );

  return (
    <div>
      <h1 className="text-xxl text-blue-dark mb-[5vh] ">Welcome Peter</h1>
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
          <Image
            src="/placeholder_child.jpg"
            alt="avatar"
            width={64}
            height={64}
          />
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
                {Math.floor(balance)} <span className="text-base"> USDx</span>
              </h3>
            </div>
            <div className="flex-1 p-4 border-b-2 border-grey-light">
              <p className="text-s mb-1">INVESTED FUNDS</p>
              <h3 className="text-lg">
                {Math.floor(
                  parseFloat(ethers.utils.formatEther(details.totalInvested))
                )}{" "}
                <span className="text-base"> USDx</span>
              </h3>
            </div>
            <div className="flex-1 p-4">
              <p className="text-s mb-1">TOTAL REWARDS</p>
              <h3 className="text-lg flex">
                <span className="mr-1">
                  {ethers.utils.commify(
                    ethers.utils.formatUnits(details.totalRewards)
                  )}{" "}
                </span>
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
              {stakesToShow.map((a) => (
                <div
                  className="flex items-center hover:cursor-pointer"
                  key={a.name}
                  onClick={() => setUpdateAllocation({ ...a })}
                >
                  <Allocation className="flex-1" key={a.id} {...a} />
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
        className={`text-sm w-full rounded-md flex justify-end mt-4 ${
          loading && "animate-pulse pointer-events-none"
        }`}
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
        onAllocate={handleAllocate}
        update={updateAllocation}
        balance={balance}
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
        balance={balance}
      />
    </div>
  );
};

export default Child;

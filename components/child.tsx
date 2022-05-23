import { BigNumber, ethers } from "ethers";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { IChild } from "../services/contract";
import { IStake, IStakeDuration } from "../services/stake";
import { useStore } from "../services/store";
import { getUSDCXBalance } from "../services/usdcx_contract";
import Allocation from "./allocation";
import Button from "./button";
import Plus from "./plus";

interface IProps extends IChild {
  details: {
    totalCreatedStakes: BigNumber;
    totalInvested: BigNumber;
    totalRewards: BigNumber;
  };
  stakes: IStake[];
  onTransfer: () => void;
  onStream: () => void;
}

export const MOCK_ALLOCATIONS = [
  {
    name: "Playstation 5",
    value: 180,
    duration: 10,
    durationTotal: IStakeDuration.FORTNIGHT,
  },
  {
    name: "New Science Book",
    value: 25,
    duration: 4,
    durationTotal: IStakeDuration.WEEK,
  },
  {
    name: "College fund",
    value: 120,
    duration: 2,
    durationTotal: IStakeDuration.FORTNIGHT,
  },
  {
    name: "Drone",
    value: 200,
    duration: 1,
    durationTotal: IStakeDuration.FORTNIGHT,
  },
];

const Child: React.FC<IProps> = ({
  _address,
  username,
  isLocked,
  details,
  stakes = [],
  onTransfer,
  onStream,
}) => {
  const {
    state: { provider },
  } = useStore();
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    if (!provider || !_address) {
      return;
    }
    getUSDCXBalance(provider, _address).then((value) => {
      setBalance(parseFloat(value));
    });
  }, [provider, _address]);

  const stakesToShow = useMemo(
    () => stakes.filter((s) => s.remainingDays >= 0),
    [stakes]
  );

  return (
    <div className="rounded-lg border-2 border-grey-light">
      <div className="p-6 flex">
        <Image
          src="/placeholder_child.jpg"
          width={64}
          height={64}
          alt="avatar"
        />
        <div className="ml-6">
          <div className="mb-2 flex items-center">
            <h3 className="text-blue-dark text-lg mr-3">{username}</h3>
            {!isLocked && (
              <Button className="bg-[#47a1b5]" size="sm">
                Withdraws allowed
              </Button>
            )}
          </div>
          <p className="text-grey-medium">{_address}</p>
        </div>
      </div>
      <div className="border-t-2 border-b-2 border-grey-light flex">
        <Button
          className="rounded-0 bg-white border-r-2 border-grey-light shadow-[_0_0px_10px_rgba(0,0,0,0.1)]"
          onClick={onTransfer}
        >
          <div
            className="flex items-center text-blue-dark"
            style={{ padding: "0 2px" }}
          >
            <Plus width={12} height={12} />
            <span className="ml-1 font-normal text-base">Add more funds</span>
          </div>
        </Button>
        <Button
          className="rounded-0 bg-white border-r-2 border-grey-light shadow-[_0_0px_10px_rgba(0,0,0,0.1)]"
          onClick={onStream}
        >
          <div className="flex items-center text-blue-dark">
            <Plus width={12} height={12} />
            <span className="ml-1 font-normal text-base">
              Create new stream
            </span>
          </div>
        </Button>
        <Button className="rounded-0 bg-white flex-1 shadow-[_0_0px_10px_rgba(0,0,0,0.1)]">
          <span className="text-blue-dark block" style={{ marginTop: -12 }}>
            ...
          </span>
        </Button>
      </div>
      <div className="flex">
        <div className="flex flex-col text-blue-dark">
          <div className="flex-1 p-4 border-b-2 border-grey-light">
            <p className="text-s mb-1">AVAILABLE FUNDS</p>
            <h3 className="text-lg">
              {parseFloat(balance.toFixed(2))}{" "}
              <span className="text-base"> USDx</span>
            </h3>
          </div>
          <div className="flex-1 p-4 border-b-2 border-grey-light">
            <p className="text-s mb-1">INVESTED FUNDS</p>
            <h3 className="text-lg">
              {parseFloat(
                ethers.utils.formatEther(details?.totalInvested ?? 0)
              )}{" "}
              <span className="text-base">USDx</span>
            </h3>
          </div>
          <div className="flex-1 p-4">
            <p className="text-s mb-1">TOTAL REWARDS</p>
            <h3 className="text-lg">
              {parseFloat(ethers.utils.formatEther(details?.totalRewards ?? 0))}{" "}
              <span className="text-base">USDx</span>
            </h3>
          </div>
        </div>
        <div className="border-l-2 border-grey-light pl-4 py-4 pb-0 flex flex-col flex-1">
          <p className="text-s">INVESTED FUNDS</p>
          <div
            className="flex-1 overflow-auto flex flex-col pb-3 pr-4"
            style={{ maxHeight: 300 }}
          >
            {stakesToShow.map((s) => (
              <Allocation key={s.id} {...s} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Child;

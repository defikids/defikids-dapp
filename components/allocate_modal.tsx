import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import StakeContract, { IStake, IStakeDuration } from "../services/stake";
import { useStore } from "../services/store";
import Arrow from "./arrow";
import Button from "./button";
import Logo from "./logo";

interface IProps {
  show: boolean;
  onClose: () => void;
  onAllocate: (transaction: ethers.ContractReceipt) => void;
  balance: number;
  update?: IStake;
  onUpdate?: (transaction: ethers.ContractReceipt) => void;
}

const StakingDurationsString = {
  [IStakeDuration.DAY]: "1 Day",
  [IStakeDuration.WEEK]: "1 Week",
  [IStakeDuration.FORTNIGHT]: "2 Weeks",
};

const USDCX_YIELD = 0.05;

const AllocateModal: React.FC<IProps> = ({
  show,
  onClose,
  onAllocate,
  balance,
  update,
  onUpdate,
}) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState<number>();
  const [duration, setDuration] = useState<IStakeDuration>();
  const [loading, setLoading] = useState(false);
  const {
    state: { stakeContract },
  } = useStore();

  useEffect(() => {
    if (update) {
      setName(update.name);
      setDuration(update.duration);
    }
  }, [update]);

  const handleAllocate = async (
    name: string,
    amount: number,
    duration: IStakeDuration
  ) => {
    try {
      setLoading(true);
      const transaction = await stakeContract.createStake(
        amount,
        duration,
        name
      );
      const result = await transaction.wait();
      setLoading(false);
      console.log(result);
      onClose();
      const callback = update ? onUpdate : onAllocate;
      callback(result);
      setName("");
      setAmount(undefined);
      setDuration(undefined);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const stakeOptions = (disabled: boolean) => {
    const options = [];
    const backgrounds = ["#47a1b5", "blue-oil", "blue-dark"];
    for (const option in IStakeDuration) {
      const optionDuration = Number(option);
      if (isNaN(optionDuration)) {
        continue;
      }

      const selected = duration === optionDuration;
      const background = backgrounds.shift();
      options.push(
        <div
          key={option}
          className={`px-3 py-3 rounded-md text-white bg-${background} hover:cursor-pointer hover:shadow hover:opacity-100 opacity-${
            selected ? 100 : duration === undefined ? 80 : 40
          } transition ${disabled && "pointer-events-none"}`}
          style={background.startsWith("#") ? { background } : {}}
          onClick={() => setDuration(optionDuration)}
        >
          <h3 className="text-lg font-medium">
            {StakingDurationsString[option]}
          </h3>
          <p className="text-md mt-4 mb-2 font-medium pr-1">Rewards:</p>
          <div>
            <h3
              className="text-md flex items-end mb-1 justify-start"
              style={{ minWidth: 90 }}
            >
              {!amount
                ? 0
                : StakeContract.calculateUSDCReward(amount, optionDuration)}
              <span className="flex ml-1">USDCx</span>
            </h3>
            <h3
              className="text-md flex items-center justify-start"
              style={{ minWidth: 90 }}
            >
              {!amount
                ? 0
                : StakeContract.calculateAllocateReward(amount, optionDuration)}
              <span className="flex ml-1">
                <Logo />
              </span>
            </h3>
          </div>
        </div>
      );
    }
    return options;
  };

  return (
    <Modal show={show} onHide={onClose} dialogClassName="w-modal" size="lg">
      <Modal.Header closeButton className="mb-7 border-0 px-12 pt-12">
        <h1 className="text-xl">
          Allocate
          <br />
          Your Funds
        </h1>
      </Modal.Header>
      <div className="flex px-12 pb-12 justify-between items-end">
        <div className="flex-1 mr-12">
          <InputGroup className="flex flex-col">
            <Form.Label htmlFor="name">Name</Form.Label>
            <FormControl
              disabled={!!update}
              placeholder={!update ? "What are you saving for?" : name}
              aria-label="name"
              style={{ width: "100%", borderRadius: 12 }}
              onChange={(value) => setName(value.currentTarget.value)}
            />
          </InputGroup>
          <InputGroup className="flex flex-col mt-4">
            <Form.Label htmlFor="name">Amount</Form.Label>
            <FormControl
              placeholder={`${balance} USDCx available`}
              max={balance}
              aria-label="amount"
              type="number"
              style={{ width: "100%", borderRadius: 12 }}
              value={amount ?? ""}
              onChange={(value) =>
                setAmount(
                  Math.min(parseFloat(value.currentTarget.value), balance)
                )
              }
            />
          </InputGroup>
          <div className="mt-6">
            <p>Allocate for:</p>
            <div className="flex justify-between mt-2">
              {stakeOptions(!!update)}
            </div>
          </div>
        </div>
        <Button
          className={loading && "animate-pulse pointer-events-none"}
          size="lg"
          onClick={() => handleAllocate(name, amount, duration)}
          disabled={!amount || duration === undefined}
        >
          <div className="flex items-center">
            <span className="mr-6">Allocate funds</span>
            <Arrow dir="right" />
          </div>
        </Button>
      </div>
    </Modal>
  );
};

export default AllocateModal;

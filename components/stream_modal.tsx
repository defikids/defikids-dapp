import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import { useStore } from "../services/store";
import Arrow from "./arrow";
import Button from "./button";
import { createFlow } from "../hooks/useSFCore";
import { ethers } from "ethers";

interface IProps {
  show: boolean;
  onClose: () => void;
  onTransfer: () => void;
  balance: number;
  child: { username: string; _address: string };
}

const ALLOWANCE_DAYS = 30;

function calculateFlowRate(amountInEther) {
  if (
    typeof Number(amountInEther) !== "number" ||
    isNaN(Number(amountInEther)) === true
  ) {
    throw new Error("You can only calculate a flowRate based on a number");
  } else if (typeof Number(amountInEther) === "number") {
    const monthlyAmount = ethers.utils.parseEther(amountInEther.toString());
    const calculatedFlowRate = Math.floor(
      (monthlyAmount as any) / 3600 / 24 / ALLOWANCE_DAYS
    );
    return calculatedFlowRate;
  }
}

const StreamModal: React.FC<IProps> = ({
  show,
  onClose,
  onTransfer,
  balance,
  child,
}) => {
  const {
    state: { provider, wallet },
  } = useStore();
  const [amount, setAmount] = useState<number>();
  const [loading, setLoading] = useState(false);

  const handleStream = async (value: number, childAddress: string) => {
    const flowRate = calculateFlowRate(value);
    try {
      setLoading(true);
      const result = await createFlow(
        provider,
        wallet,
        childAddress,
        flowRate.toString()
      );
      setLoading(false);
      onClose();
      onTransfer();
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <Modal show={show} onHide={onClose} dialogClassName="w-modal" size="lg">
      <Modal.Header closeButton className="mb-7 border-0 px-12 pt-12">
        <h1 className="text-xl">
          Monthly allowance
          <br />
          for {child ? child.username : ""}
        </h1>
      </Modal.Header>
      <div className="flex px-12 pb-12 justify-between items-center">
        <div className="flex-1 mr-12">
          <InputGroup className="flex flex-col">
            <Form.Label htmlFor="name">Amount</Form.Label>
            <FormControl
              placeholder={`${balance} USDCx available`}
              max={balance}
              aria-label="amount"
              type="number"
              style={{ width: "100%", borderRadius: 12 }}
              value={amount?.toString() ?? ""}
              onChange={(value) =>
                setAmount(
                  Math.min(parseFloat(value.currentTarget.value), balance)
                )
              }
            />
          </InputGroup>
        </div>
        <Button
          className={loading && "animate-pulse pointer-events-none"}
          size="lg"
          onClick={() => handleStream(amount, child._address)}
          disabled={!amount || isNaN(amount)}
        >
          <div className="flex items-center">
            <span className="mr-6">Transfer</span>
            <Arrow dir="right" />
          </div>
        </Button>
      </div>
    </Modal>
  );
};

export default StreamModal;

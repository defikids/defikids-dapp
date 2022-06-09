import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import { useStore } from "../services/store";
import Arrow from "./arrow";
import Button from "./button";
import Toggle from "./toggle";

interface IProps {
  show: boolean;
  onClose: () => void;
  onAdd: () => void;
}

const AddChildModal: React.FC<IProps> = ({ show, onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [wallet, setWallet] = useState("");
  const [withdraw, setWithdraw] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    state: { contract },
  } = useStore();

  const handleAddChild = async (wallet, name) => {
    setLoading(true);
    try {
      await contract.addMember(wallet, name, !withdraw);
      onAdd();
    } catch (error) {
      console.log("Error adding child:", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal show={show} onHide={onClose} dialogClassName="w-modal" size="lg">
      <Modal.Header closeButton className="mb-7 border-0 px-12 pt-12">
        <h1 className="text-xl">
          Add a<br />
          New Kid
        </h1>
      </Modal.Header>
      <div className="flex px-12 pb-12 justify-between items-end">
        <div className="flex-1 mr-12">
          <InputGroup className="flex flex-col">
            <Form.Label htmlFor="name">Your child&apos;s name</Form.Label>
            <FormControl
              placeholder="Peter, the middle one"
              aria-label="name"
              style={{ width: "100%", borderRadius: 12 }}
              onChange={(value) => setName(value.currentTarget.value)}
            />
          </InputGroup>
          <InputGroup className="flex flex-col mt-6">
            <Form.Label htmlFor="wallet">His wallet address</Form.Label>
            <FormControl
              placeholder="0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"
              aria-label="wallet"
              style={{ width: "100%", borderRadius: 12 }}
              onChange={(value) => setWallet(value.currentTarget.value)}
            />
          </InputGroup>
          <InputGroup className="flex flex-col mt-6">
            <Form.Label htmlFor="withdraw">
              Do you allow withdraws from this son?
            </Form.Label>
            <Toggle
              value={withdraw}
              onValueChange={setWithdraw}
              className="self-start"
            >
              <p className="text-grey-medium ml-2 pr-4">
                {withdraw ? "Yes, allow" : "No, don’t allow"}
              </p>
            </Toggle>
          </InputGroup>
        </div>
        <Button
          className={loading && "animate-pulse pointer-events-none"}
          size="lg"
          onClick={() => handleAddChild(wallet, name)}
          disabled={!name || !wallet}
        >
          <div className="flex items-center">
            <span className="mr-6">Add new kid</span>
            <Arrow dir="right" />
          </div>
        </Button>
      </div>
    </Modal>
  );
};

export default AddChildModal;

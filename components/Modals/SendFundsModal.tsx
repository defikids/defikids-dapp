import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Button,
  useSteps,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  TransactionStepper,
  steps,
} from "@/components/steppers/TransactionStepper";
import { useContractStore } from "@/store/contract/contractStore";
import shallow from "zustand/shallow";
import { StepperContext } from "@/dataSchema/enums";
import { transactionErrors } from "@/utils/errorHanding";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { ethers } from "ethers";

export const SendFundsModal = ({
  isOpen,
  onClose,
  childKey,
  children,
  fetchChildren,
  fetchFamilyDetails,
}: {
  isOpen: boolean;
  onClose: () => void;
  childKey: number;
  children: any;
  fetchChildren: () => void;
  fetchFamilyDetails: () => void;
}) => {
  //=============================================================================
  //                               STATE
  //=============================================================================
  const [amount, setAmount] = useState("");
  const [isloading, setIsLoading] = useState(false);

  //=============================================================================
  //                               HOOKS
  //=============================================================================
  const { connectedSigner } = useContractStore(
    (state) => ({
      connectedSigner: state.connectedSigner,
    }),
    shallow
  );

  const toast = useToast();

  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================

  const onSubmit = async () => {
    const wallet = connectedSigner;
    setIsLoading(true);

    try {
      setActiveStep(0);

      const amountToSend = ethers.utils.parseEther(amount);

      const tx = (await wallet.sendTransaction({
        to: children[childKey].wallet,
        value: amountToSend,
      })) as TransactionResponse;

      setActiveStep(1);
      await tx.wait();

      fetchFamilyDetails();
      fetchChildren();

      toast({
        title: "Funds successfully sent",
        status: "success",
      });
      onClose();
    } catch (e) {
      const errorDetails = transactionErrors(e);
      toast(errorDetails);
      onClose();
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      onCloseComplete={() => {
        setIsLoading(false);
        setAmount("");
      }}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Transfer Funds</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isloading ? (
            <TransactionStepper
              activeStep={activeStep}
              context={StepperContext.DEFAULT}
            />
          ) : (
            <FormControl>
              <FormLabel>Amount to send</FormLabel>
              <Input
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                  border: "1px solid lightgray",
                }}
              />
            </FormControl>
          )}
        </ModalBody>
        <ModalFooter>
          {!isloading && (
            <Button colorScheme="blue" mr={3} onClick={onSubmit}>
              Submit
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

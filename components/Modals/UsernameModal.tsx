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
import { useAuthStore } from "@/store/auth/authStore";
import HostContract from "@/services/contract";
import { StepperContext } from "@/dataSchema/enums";
import { transactionErrors } from "@/utils/errorHanding";
import { TransactionResponse } from "@ethersproject/abstract-provider";

export const UsernameModal = ({
  isOpen,
  onClose,
  childKey,
  children,
  familyId,
  fetchChildren,
  fetchFamilyDetails,
}: {
  isOpen: boolean;
  onClose: () => void;
  childKey: number;
  children: any;
  familyId: string;
  fetchChildren: () => void;
  fetchFamilyDetails: () => void;
}) => {
  //=============================================================================
  //                               STATE
  //=============================================================================
  const [username, setUsername] = useState("");
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

  const { walletAddress } = useAuthStore(
    (state) => ({
      walletAddress: state.walletAddress,
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
    const activeAddress = children[childKey]?.wallet
      ? children[childKey]?.wallet
      : walletAddress;

    const contract = await HostContract.fromProvider(connectedSigner);
    setIsLoading(true);

    try {
      setActiveStep(0);
      let tx: TransactionResponse;

      if (activeAddress === walletAddress) {
        tx = await contract.updateUsername(username);
      } else {
        const childAddress = activeAddress;
        tx = await contract.updateChildUsername(
          familyId,
          childAddress,
          username
        );
      }

      setActiveStep(1);
      await tx.wait();

      if (activeAddress === walletAddress) {
        fetchFamilyDetails();
      } else {
        fetchChildren();
      }

      toast({
        title: "Avatar successfully updated",
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
        setUsername("");
      }}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Change Username</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isloading ? (
            <TransactionStepper
              activeStep={activeStep}
              context={StepperContext.DEFAULT}
            />
          ) : (
            <FormControl>
              <FormLabel>New Username</FormLabel>
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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

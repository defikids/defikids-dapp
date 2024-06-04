"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Heading,
  Box,
} from "@chakra-ui/react";
import { StepperContext } from "@/data-schema/enums";
import { TransactionStepper } from "../steppers/TransactionStepper";

export const WithdrawSettlementModal = ({
  isOpen,
  onClose,
  activeStep,
}: {
  isOpen: boolean;
  onClose: () => void;
  activeStep: number;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay
        bg="none"
        backdropFilter="auto"
        backdropInvert="10%"
        backdropBlur="4px"
      />
      <ModalContent>
        <ModalHeader>
          <Heading fontSize="sm">Settle Withdraw</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Heading fontSize={"xl"} my={5}>
              Settle Withdraw Request
            </Heading>
            <TransactionStepper
              activeStep={activeStep}
              context={StepperContext.WITHDRAW_SETTLED}
            />
          </Box>
        </ModalBody>

        <ModalFooter m={0} p="3px" />
      </ModalContent>
    </Modal>
  );
};

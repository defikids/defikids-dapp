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
} from "@chakra-ui/react";
import { useState } from "react";
import { WithdrawDefiDollars } from "@/components/WithdrawDefiDollars";
import { ExplainMemberWithdraws } from "@/components/explainations/ExplainMemberWithdraws";
import { Explaination } from "@/data-schema/enums";
import { User } from "@/data-schema/types";

export const WithdrawDefiDollarsModal = ({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [explaination, setExplaination] = useState(Explaination.NONE);

  const showMemberWithdrawExplaination = () => {
    return (
      <ExplainMemberWithdraws
        explaination={explaination}
        setShowExplanation={setShowExplanation}
      />
    );
  };

  const withdrawComponent = () => {
    return (
      <WithdrawDefiDollars
        onClose={onClose}
        setShowExplanation={setShowExplanation}
        setExplaination={setExplaination}
        user={user}
      />
    );
  };

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
          <Heading fontSize="sm">Withdraw DefiDollars</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {showExplanation
            ? showMemberWithdrawExplaination()
            : withdrawComponent()}
        </ModalBody>

        <ModalFooter m={0} p="3px" />
      </ModalContent>
    </Modal>
  );
};

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
import { Airdrop } from "@/components/Airdrop";
import { User } from "@/data-schema/types";
import { useState } from "react";
import { ExplainAllowance } from "@/components/explainations/ExplainAllowance";
import { Explaination } from "@/data-schema/enums";

export const SendAllowanceModal = ({
  isOpen,
  onClose,
  members,
  stableTokenBalance,
}: {
  isOpen: boolean;
  onClose: () => void;
  members: User[];
  stableTokenBalance: number;
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [explaination, setExplaination] = useState(Explaination.NONE);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={showExplanation ? "xl" : "md"}
      isCentered
    >
      <ModalOverlay
        bg="none"
        backdropFilter="auto"
        backdropInvert="10%"
        backdropBlur="4px"
      />
      <ModalContent>
        <ModalHeader>
          <Heading fontSize="sm">Send Allowance</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {showExplanation && explaination === Explaination.ALLOWANCE ? (
            <ExplainAllowance
              explaination={explaination}
              setShowExplanation={setShowExplanation}
            />
          ) : (
            <Airdrop
              onClose={onClose}
              members={members}
              setExplaination={setExplaination}
              setShowExplanation={setShowExplanation}
              stableTokenBalance={stableTokenBalance}
            />
          )}
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

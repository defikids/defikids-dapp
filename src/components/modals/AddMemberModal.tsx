"use client";

import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Modal,
  Heading,
  ModalFooter,
  useBreakpointValue,
} from "@chakra-ui/react";
import { RegisterMemberForm } from "@/components/forms/RegisterMemberForm";
import { EmailVerificationRequired } from "@/components/email/EmailVerificationRequired";
import { useState } from "react";
import { useAuthStore } from "@/store/auth/authStore";
import shallow from "zustand/shallow";
import { User } from "@/data-schema/types";

export const AddMemberModal = ({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const { userDetails } = useAuthStore(
    (state) =>
      ({
        userDetails: state.userDetails,
      } as { userDetails: User }),
    shallow
  );

  const isMobileSize = useBreakpointValue({
    base: true,
    sm: false,
    md: false,
    lg: false,
  });
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={isMobileSize ? "6xl" : "md"}
      isCentered
      closeOnOverlayClick={false}
      onCloseComplete={() => {
        setIsLoading(false);
      }}
    >
      <ModalOverlay
        bg="none"
        backdropFilter="auto"
        backdropInvert="10%"
        backdropBlur="4px"
      />
      <ModalContent>
        <ModalHeader>
          <Heading size="md">Invite Member</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {!userDetails?.emailVerified ? (
            <EmailVerificationRequired userDetails={userDetails} />
          ) : (
            <RegisterMemberForm onClose={onClose} />
          )}
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

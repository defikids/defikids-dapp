"use client";

import { Button, VStack } from "@chakra-ui/react";

const ParentButtonMenu = ({
  onOpenSendAllowanceModal,
  onOpenMembersTableModal,
  onOpenAirdropModal,
}: {
  onOpenSendAllowanceModal: () => void;
  onOpenMembersTableModal: () => void;
  onOpenAirdropModal: () => void;
}) => {
  return (
    <VStack spacing={4} align="stretch" justify="space-between" mt={10} mx={5}>
      <Button
        variant="outline"
        colorScheme="white"
        _hover={{ borderColor: "gray" }}
        onClick={(e) => {
          e.stopPropagation();
          onOpenSendAllowanceModal();
        }}
      >
        Send Allowance
      </Button>

      {/* <Button
        variant="outline"
        colorScheme="white"
        _hover={{ borderColor: "gray" }}
        onClick={(e) => {
          e.stopPropagation();
          onOpenAirdropModal();
        }}
      >
        Airdrop
      </Button> */}

      <Button
        variant="outline"
        colorScheme="white"
        _hover={{ borderColor: "gray" }}
        onClick={(e) => {
          e.stopPropagation();
          onOpenMembersTableModal();
        }}
      >
        Members
      </Button>
    </VStack>
  );
};

export default ParentButtonMenu;

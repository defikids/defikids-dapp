"use client";

import { Button, VStack } from "@chakra-ui/react";

const MemberButtonMenu = ({
  onOpenWithdrawDefiDollarsModal,
}: {
  onOpenWithdrawDefiDollarsModal: () => void;
}) => {
  return (
    <VStack spacing={4} align="stretch" justify="space-between" mt={10} mx={5}>
      <Button
        variant="outline"
        colorScheme="white"
        _hover={{ borderColor: "gray" }}
        onClick={(e) => {
          e.stopPropagation();
          onOpenWithdrawDefiDollarsModal();
        }}
      >
        Withdraw Funds
      </Button>
    </VStack>
  );
};

export default MemberButtonMenu;

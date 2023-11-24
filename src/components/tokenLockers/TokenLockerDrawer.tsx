"use client";

import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { TokenLockerFunctions } from "@/data-schema/enums";

// Components
import { CreateLocker } from "./TokenLockerDrawer/CreateLocker";

export const TokenLockerDrawer = ({
  isOpen,
  onClose,
  placement,
  currentFunction,
}: {
  isOpen: boolean;
  onClose: () => void;
  placement: any;
  currentFunction: TokenLockerFunctions;
}) => {
  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement={placement}
        onClose={onClose}
        size="md"
        onCloseComplete={() => {}}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader />
          <DrawerBody>
            {currentFunction === TokenLockerFunctions.CREATE_LOCKER && (
              <CreateLocker />
            )}
          </DrawerBody>
          <DrawerFooter />
        </DrawerContent>
      </Drawer>
    </>
  );
};

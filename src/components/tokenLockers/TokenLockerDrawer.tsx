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
import { AddToLocker } from "./TokenLockerDrawer/AddToLocker";
import { ApplyNewLock } from "./TokenLockerDrawer/ApplyNewLock";
import { EmptyLocker } from "./TokenLockerDrawer/EmptyLocker";
import { RemoveFromLocker } from "./TokenLockerDrawer/RemoveFromLocker";

export const TokenLockerDrawer = ({
  isOpen,
  onClose,
  placement,
  currentFunction,
  setFetchLockers,
}: {
  isOpen: boolean;
  onClose: () => void;
  placement: any;
  currentFunction: TokenLockerFunctions;
  setFetchLockers: (fetchLockers: boolean) => void;
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
              <CreateLocker
                onClose={onClose}
                setFetchLockers={setFetchLockers}
              />
            )}

            {currentFunction === TokenLockerFunctions.ADD_TO_LOCKER && (
              <AddToLocker />
            )}

            {currentFunction === TokenLockerFunctions.APPLY_NEW_LOCK && (
              <ApplyNewLock />
            )}

            {currentFunction === TokenLockerFunctions.EMPTY_LOCKER && (
              <EmptyLocker />
            )}

            {currentFunction === TokenLockerFunctions.REMOVE_FROM_LOCKER && (
              <RemoveFromLocker />
            )}
          </DrawerBody>
          <DrawerFooter />
        </DrawerContent>
      </Drawer>
    </>
  );
};

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
import { DeleteLocker } from "./TokenLockerDrawer/DeleteLocker";
import { RenameLocker } from "./TokenLockerDrawer/RenameLocker";

export const TokenLockerDrawer = ({
  isOpen,
  onClose,
  placement,
  currentFunction,
  setFetchLockers,
  selectedLocker,
  refreshBlockchainData,
}: {
  isOpen: boolean;
  onClose: () => void;
  placement: any;
  currentFunction: TokenLockerFunctions;
  setFetchLockers: (fetchLockers: boolean) => void;
  selectedLocker: any;
  refreshBlockchainData: () => void;
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
                setFetchLockers={refreshBlockchainData}
              />
            )}
            {currentFunction === TokenLockerFunctions.ADD_TO_LOCKER && (
              <AddToLocker
                selectedLocker={selectedLocker}
                onClose={onClose}
                setFetchLockers={refreshBlockchainData}
              />
            )}
            {currentFunction === TokenLockerFunctions.APPLY_NEW_LOCK && (
              <ApplyNewLock
                selectedLocker={selectedLocker}
                onClose={onClose}
                setFetchLockers={refreshBlockchainData}
              />
            )}
            {currentFunction === TokenLockerFunctions.EMPTY_LOCKER && (
              <EmptyLocker
                selectedLocker={selectedLocker}
                onClose={onClose}
                setFetchLockers={refreshBlockchainData}
              />
            )}
            {currentFunction === TokenLockerFunctions.REMOVE_FROM_LOCKER && (
              <RemoveFromLocker
                selectedLocker={selectedLocker}
                onClose={onClose}
                setFetchLockers={refreshBlockchainData}
              />
            )}
            {currentFunction === TokenLockerFunctions.DELETE_LOCKER && (
              <DeleteLocker
                selectedLocker={selectedLocker}
                onClose={onClose}
                setFetchLockers={refreshBlockchainData}
              />
            )}
            {currentFunction === TokenLockerFunctions.RENAME_LOCKER && (
              <RenameLocker
                selectedLocker={selectedLocker}
                onClose={onClose}
                setFetchLockers={refreshBlockchainData}
              />
            )}
          </DrawerBody>
          <DrawerFooter />
        </DrawerContent>
      </Drawer>
    </>
  );
};

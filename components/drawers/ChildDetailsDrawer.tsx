import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Text,
  Heading,
  Flex,
  Avatar,
  Divider,
  Image,
  useToast,
  Switch,
  Spinner,
  useBreakpointValue,
  Box,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { ChildDetails } from "@/data-schema/types";
import { trimAddress } from "@/utils/web3";
// import HostContract from "@/blockchain/contracts/contract";
import { useContractStore } from "@/store/contract/contractStore";
import shallow from "zustand/shallow";
import { transactionErrors } from "@/utils/errorHanding";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { getEtherscanUrl } from "@/utils/web3";
import { EtherscanContext } from "@/data-schema/enums";
import { useNetwork } from "wagmi";
import { ChildOverviewParentDashboard } from "@/components/drawers/ChildOverviewParentDashboard";

export const ChildDetailsDrawer = ({
  isOpen,
  onClose,
  placement,
  onOpen,
  childKey,
  children,
  setChildKey,
  fetchChildren,
  onOpenChangeUsername,
  onSendFundsOpen,
}: {
  isOpen: boolean;
  onClose: () => void;
  placement: any;
  onOpen: () => void;
  childKey: number;
  children: any;
  setChildKey: (key: number) => void;
  fetchChildren: () => void;
  onOpenChangeUsername: () => void;
  onSendFundsOpen: () => void;
}) => {
  //=============================================================================
  //                               HOOKS
  //=============================================================================
  const btnRef = useRef();
  const toast = useToast();
  const { chain } = useNetwork();

  const isMobileSmall = useBreakpointValue({
    sm: true,
  });

  const { connectedSigner } = useContractStore(
    (state) => ({
      connectedSigner: state.connectedSigner,
    }),
    shallow
  );

  //=============================================================================
  //                               STATE
  //=============================================================================
  const [isLoading, setIsLoading] = useState(false);

  const childDetails = children[childKey] as ChildDetails;

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================

  // const handleSandboxToggle = async () => {
  //   const contract = await HostContract.fromProvider(connectedSigner);
  //   const { wallet, familyId } = childDetails;

  //   try {
  //     setIsLoading(true);

  //     const tx = (await contract.toggleSandbox(
  //       wallet,
  //       familyId
  //     )) as TransactionResponse;

  //     await tx.wait();

  //     fetchChildren();
  //     setIsLoading(false);
  //   } catch (e) {
  //     console.error(e);
  //     setIsLoading(false);

  //     const errorDetails = transactionErrors(e);
  //     toast(errorDetails);

  //     onClose();
  //   }
  // };

  const formatDate = () => {
    const unixTimestamp = childDetails.memberSince * 1000;
    const date = new Date(unixTimestamp);

    return date.toISOString().split("T")[0];
  };

  if (!childDetails) return null;

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement={placement}
        onClose={onClose}
        finalFocusRef={btnRef}
        size={isMobileSmall ? "xs" : "full"}
        onCloseComplete={() => {
          setChildKey(null);
          setIsLoading(false);
        }}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader />
          <DrawerBody>
            {/* <ChildOverviewParentDashboard
              childDetails={childDetails}
              onOpenChangeUsername={onOpenChangeUsername}
              isLoading={isLoading}
              handleSandboxToggle={handleSandboxToggle}
              onOpen={onOpen}
              onSendFundsOpen={onSendFundsOpen}
            /> */}
          </DrawerBody>
          <DrawerFooter />
        </DrawerContent>
      </Drawer>
    </>
  );
};

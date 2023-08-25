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
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { ChildDetails } from "@/dataSchema/hostContract";
import { trimAddress } from "@/utils/web3";
import HostContract from "@/services/contract";
import { useContractStore } from "@/store/contract/contractStore";
import shallow from "zustand/shallow";
import { transactionErrors } from "@/utils/errorHanding";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { getEtherscanUrl } from "@/utils/web3";
import { EtherscanContext } from "@/dataSchema/enums";
import { useNetwork } from "wagmi";

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

  const handleSandboxToggle = async () => {
    const contract = await HostContract.fromProvider(connectedSigner);
    const { wallet, familyId } = childDetails;

    try {
      setIsLoading(true);

      const tx = (await contract.toggleSandbox(
        wallet,
        familyId
      )) as TransactionResponse;

      await tx.wait();

      fetchChildren();
      setIsLoading(false);
    } catch (e) {
      console.error(e);
      setIsLoading(false);

      const errorDetails = transactionErrors(e);
      toast(errorDetails);

      onClose();
    }
  };

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
            <Heading size="md" mt={5} mb={2}>
              UserName
            </Heading>
            <Flex justifyContent="space-between" align="center">
              <Text>{childDetails.username}</Text>
              <Button
                size="sm"
                colorScheme="blue"
                onClick={onOpenChangeUsername}
              >
                Edit
              </Button>
            </Flex>
            <Divider my={2} borderColor="gray.500" />
            {/* Account Status */}
            <Heading size="md" mt={10} mb={2}>
              Member Since
            </Heading>
            <Flex justifyContent="space-between" align="center">
              <Text>{formatDate()}</Text>
            </Flex>
            <Divider my={2} borderColor="gray.500" />
            {/* Sandbox */}
            <Heading size="md" mt={10} mb={2}>
              Sandbox Mode
            </Heading>
            <Flex justifyContent="space-between" align="center">
              <Text>{childDetails.sandboxMode ? "Enabled" : "Disabled"}</Text>

              {isLoading ? (
                <Spinner size="md" />
              ) : (
                <Switch size="lg" onChange={handleSandboxToggle} />
              )}
            </Flex>
            <Divider my={2} borderColor="gray.500" />
            {/* Wallet Details */}
            <Heading size="md" mt={10} mb={2}>
              Wallet Details
            </Heading>
            {/* Balance */}
            <Flex justifyContent="space-between" align="center">
              <Flex justify="flex-start" align="center">
                <Image
                  src="/logos/ethereum-eth-logo.png"
                  alt="USDCX"
                  width={10}
                  height={10}
                  mr={2}
                />

                <Text fontSize="lg">{childDetails.balance}</Text>
              </Flex>
              <Button
                size="sm"
                colorScheme="blue"
                onClick={() => {
                  window.open(
                    getEtherscanUrl(
                      chain.id,
                      EtherscanContext.ADDRESS,
                      childDetails.wallet
                    ),
                    "_blank"
                  );
                }}
              >
                View
              </Button>
            </Flex>
            {/* Address */}
            <Flex justifyContent="space-between" align="center" mt={4}>
              <Text>{trimAddress(childDetails.wallet)}</Text>

              <Button
                size="sm"
                colorScheme="blue"
                onClick={() => {
                  navigator.clipboard.writeText(childDetails.wallet);
                  toast({
                    title: "Address Copied",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                  });
                }}
              >
                Copy
              </Button>
            </Flex>
            <Divider my={2} borderColor="gray.500" />
            {/* Avatar */}
            <Heading size="md" mt={5} mb={4}>
              Avatar
            </Heading>
            <Flex justifyContent="space-between" align="center" ml={2}>
              <Avatar
                size="2xl"
                name={childDetails.username}
                src={
                  childDetails.avatarURI
                    ? childDetails.avatarURI
                    : "/images/placeholder-avatar.jpeg"
                }
              />
              <Button size="sm" colorScheme="blue" onClick={onOpen}>
                Edit
              </Button>
            </Flex>

            <Divider my={8} borderColor="gray.500" />
            <Flex justifyContent="space-between" align="center">
              <Heading size="md">Send Funds</Heading>
              <Button size="sm" colorScheme="blue" onClick={onSendFundsOpen}>
                Send
              </Button>
            </Flex>
          </DrawerBody>
          <DrawerFooter />
        </DrawerContent>
      </Drawer>
    </>
  );
};

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
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { ChildDetails } from "@/dataSchema/hostContract";
import { trimAddress } from "@/utils/web3";
import HostContract from "@/services/contract";
import { useContractStore } from "@/store/contract/contractStore";
import shallow from "zustand/shallow";

export const ChildDetailsDrawer = ({
  isOpen,
  onClose,
  placement,
  onOpen,
  childKey,
  children,
  setChildKey,
  fetchChildren,
}: {
  isOpen: boolean;
  onClose: () => void;
  placement: any;
  onOpen: () => void;
  childKey: number;
  children: any;
  setChildKey: (key: number) => void;
  fetchChildren: () => void;
}) => {
  const [balance, setBalance] = useState(0);
  //=============================================================================
  //                               HOOKS
  //=============================================================================
  const btnRef = useRef();
  const toast = useToast();

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

  const formatDate = () => {
    const unixTimestamp = childDetails.memberSince * 1000; // Convert seconds to milliseconds
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
        size="xs"
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
            <Heading size="md" mt={10} mb={2}>
              UserName
            </Heading>
            <Flex justifyContent="space-between" align="center">
              <Text>{childDetails.username}</Text>
              <Button size="sm" colorScheme="blue">
                Edit
              </Button>
            </Flex>
            <Divider my={2} borderColor="gray.500" />

            {/* Account Status */}
            <Heading size="md" mt={10} mb={2}>
              Account Status
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
                <Switch
                  size="lg"
                  onChange={async () => {
                    const contract = await HostContract.fromProvider(
                      connectedSigner
                    );
                    const { wallet, familyId } = childDetails;

                    try {
                      setIsLoading(true);
                      const tx = await contract.toggleSandbox(wallet, familyId);
                      await tx.wait();
                      await fetchChildren();
                      setIsLoading(false);
                    } catch (e) {
                      console.error(e);
                      setIsLoading(false);

                      if (e.message.includes("user rejected transaction")) {
                        toast({
                          title: "Transaction Error",
                          description: "User rejected transaction",
                          status: "error",
                        });
                        return;
                      }

                      toast({
                        title: "Error",
                        description: "Network error",
                        status: "error",
                      });

                      onClose();
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                />
              )}
            </Flex>
            <Divider my={2} borderColor="gray.500" />

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
              <Button size="sm" colorScheme="blue">
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
            <Heading size="md" mt={10} mb={8}>
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
          </DrawerBody>
          <DrawerFooter />
        </DrawerContent>
      </Drawer>
    </>
  );
};

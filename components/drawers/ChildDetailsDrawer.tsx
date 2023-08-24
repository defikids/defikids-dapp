import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Text,
  Heading,
  Tooltip,
  Flex,
  Avatar,
  Container,
  Divider,
  Image,
  useToast,
} from "@chakra-ui/react";
import { useRef } from "react";
import { ChildDetails } from "@/dataSchema/hostContract";
import { trimAddress } from "@/lib/web3";

export const ChildDetailsDrawer = ({
  isOpen,
  onClose,
  placement,
  onOpen,
  childKey,
  children,
  setChildKey,
}: {
  isOpen: boolean;
  onClose: () => void;
  placement: any;
  onOpen: () => void;
  childKey: number;
  children: any;
  setChildKey: (key: number) => void;
}) => {
  const btnRef = useRef();

  console.log(children[childKey]);
  console.log("children", children);
  console.log("childKey", childKey);

  const toast = useToast();

  const childDetails = children[childKey] as ChildDetails;

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

            <Heading size="md" mt={10} mb={2}>
              Account Status
            </Heading>
            <Flex justifyContent="space-between" align="center">
              <Text>{childDetails.isActive ? "Active" : "Inactive"}</Text>
              <Button size="sm" colorScheme="blue">
                Edit
              </Button>
            </Flex>
            <Divider my={2} borderColor="gray.500" />

            <Heading size="md" mt={10} mb={2}>
              Sandbox Mode
            </Heading>
            <Flex justifyContent="space-between" align="center">
              <Text>{childDetails.sandboxMode ? "Enabled" : "Disabled"}</Text>
              <Button size="sm" colorScheme="blue">
                Edit
              </Button>
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

                <Text fontSize="lg">12.4</Text>
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

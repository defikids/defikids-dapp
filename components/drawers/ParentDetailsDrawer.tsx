"use client";

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  VStack,
  StackDivider,
  Divider,
  Box,
  Heading,
} from "@chakra-ui/react";
import { useRef } from "react";
import { getEtherscanUrl } from "@/utils/web3";
import { EtherscanContext } from "@/data-schema/enums";
import { useNetwork } from "wagmi";
import { AiOutlinePlus } from "react-icons/ai";
import { EditIcon } from "@chakra-ui/icons";
import { RxAvatar } from "react-icons/rx";
import { BiTransfer, BiWalletAlt } from "react-icons/bi";
import { useAuthStore } from "@/store/auth/authStore";
import shallow from "zustand/shallow";

export const ParentDetailsDrawer = ({
  isOpen,
  onClose,
  placement,
  onOpen,
  onChangeUsernameOpen,
  onAddChildOpen,
}: {
  isOpen: boolean;
  onClose: () => void;
  placement: any;
  onOpen: () => void;
  onChangeUsernameOpen: () => void;
  onAddChildOpen: () => void;
}) => {
  //=============================================================================
  //                               HOOKS
  //=============================================================================
  const btnRef = useRef();
  const { chain } = useNetwork();

  const { userDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
    }),
    shallow
  );

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement={placement}
        onClose={onClose}
        finalFocusRef={btnRef}
        size="xs"
        onCloseComplete={() => {}}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader />
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              <Box>
                <Heading size="md">Parent</Heading>
                <VStack spacing={4} align="stretch">
                  <Button
                    leftIcon={<RxAvatar />}
                    colorScheme="blue"
                    variant="solid"
                    onClick={onOpen}
                    mt={3}
                  >
                    Change Avatar
                  </Button>
                  <Button
                    leftIcon={<EditIcon />}
                    colorScheme="blue"
                    variant="solid"
                    onClick={onChangeUsernameOpen}
                  >
                    Change Username
                  </Button>
                  <Button
                    leftIcon={<BiWalletAlt />}
                    colorScheme="blue"
                    variant="solid"
                    onClick={() => {
                      window.open(
                        getEtherscanUrl(
                          chain.id,
                          EtherscanContext.ADDRESS,
                          userDetails?.wallet
                        ),
                        "_blank"
                      );
                    }}
                  >
                    Transaction History
                  </Button>
                </VStack>
              </Box>

              <Divider my={2} borderColor="gray.500" />
              <Box>
                <Heading size="md">Family Members</Heading>
                <VStack spacing={4} align="stretch">
                  <Button
                    mt={3}
                    leftIcon={<AiOutlinePlus />}
                    colorScheme="blue"
                    variant="solid"
                    onClick={onAddChildOpen}
                  >
                    Add Member
                  </Button>
                  <Button
                    leftIcon={<BiTransfer />}
                    colorScheme="blue"
                    variant="solid"
                    onClick={() => alert("Transfer to all kids")}
                  >
                    Airdrop
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </DrawerBody>
          <DrawerFooter />
        </DrawerContent>
      </Drawer>
    </>
  );
};

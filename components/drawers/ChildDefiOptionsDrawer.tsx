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
import { EtherscanContext } from "@/dataSchema/enums";
import { useNetwork } from "wagmi";
import { AiOutlinePlus } from "react-icons/ai";
import { EditIcon } from "@chakra-ui/icons";
import { RxAvatar } from "react-icons/rx";
import { GrGrow } from "react-icons/gr";
import { BiTimeFive } from "react-icons/bi";

export const ChildDefiOptionsDrawer = ({
  isOpen,
  onClose,
  placement,
}: {
  isOpen: boolean;
  onClose: () => void;
  placement: any;
}) => {
  //=============================================================================
  //                               HOOKS
  //=============================================================================
  const btnRef = useRef();

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
                <Heading size="md">Earning</Heading>
                <VStack spacing={4} align="stretch">
                  <Button
                    leftIcon={<GrGrow />}
                    colorScheme="blue"
                    variant="solid"
                    // onClick={onOpen}
                    mt={3}
                  >
                    Stake
                  </Button>
                </VStack>
              </Box>

              <Divider my={2} borderColor="gray.500" />
              <Box>
                <Heading size="md">Saving</Heading>
                <VStack spacing={4} align="stretch">
                  <Button
                    mt={3}
                    leftIcon={<BiTimeFive />}
                    colorScheme="blue"
                    variant="solid"
                    // onClick={onAddChildOpen}
                  >
                    Timelock
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

import {
  AbsoluteCenter,
  Avatar,
  Box,
  Button,
  Center,
  ChakraProvider,
  Container,
  Divider,
  Flex,
  Heading,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import React, { use, useCallback, useEffect, useState } from "react";
import AnimatedNumber from "@/components/animated_number";
import Arrow from "@/components/arrow";
import Child from "@/components/child";
// import TopUpModal from "@/components/topup_modal";
// import WithdrawModal from "@/components/withdraw_modal";
// import TransferAllModal from "@/components/transfer_all_modal";
// import TransferModal from "@/components/transfer_modal";
// import StreamModal from "@/components/stream_modal";
import contract, { IChild } from "@/services/contract";
import HostContract from "@/services/contract";
import StakeContract from "@/services/stake";
// import { flowDetails } from "@/hooks/useSuperFluid";
import { ethers } from "ethers";
import Plus from "@/components/plus";
import { AddChildModal } from "@/components/Modals/AddChildModal";
import { getUSDCXBalance } from "@/services/usdcx_contract";
import { BiTransfer } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import shallow from "zustand/shallow";
import { useAuthStore } from "@/store/auth/authStore";
import { useContractStore } from "@/store/contract/contractStore";
import { trimAddress } from "@/lib/web3";
import { FamilyDetails } from "@/dataSchema/hostContract";
import { ChangeAvatarModal } from "@/components/Modals/ChangeAvatarModal";
import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import { ChildDetailsDrawer } from "@/components/drawers/ChildDetailsDrawer";

const Parent: React.FC = () => {
  //=============================================================================
  //                               STATE
  //=============================================================================

  const [childKey, setChildKey] = useState(0);
  const [balance, setBalance] = useState<number>();
  const [netFlow, setNetFlow] = useState<number>(0);
  const [childrenLoading, setChildrenLoading] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showTransferAll, setShowTransferAll] = useState(false);
  const [transferChild, setTransferChild] = useState();
  const [streamChild, setStreamChild] = useState();
  const [children, setChildren] = useState([]);
  const [childrenStakes, setChildrenStakes] = useState({});
  const [stakeContract, setStakeContract] = useState<StakeContract>();
  const [familyDetails, setFamilyDetails] = useState({} as FamilyDetails);

  //=============================================================================
  //                               HOOKS
  //=============================================================================
  const { walletAddress } = useAuthStore(
    (state) => ({
      walletAddress: state.walletAddress,
    }),
    shallow
  );

  const { connectedSigner } = useContractStore(
    (state) => ({
      connectedSigner: state.connectedSigner,
    }),
    shallow
  );

  const {
    isOpen: isOpenChildDetails,
    onOpen: onOpenChildDetails,
    onClose: onCloseChildDetails,
  } = useDisclosure();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const isMobileLarge = useBreakpointValue({
    lg: true,
  });

  const isMobileSmall = useBreakpointValue({
    sm: true,
  });

  const {
    isOpen: isAddChildOpen,
    onOpen: onAddChildOpen,
    onClose: onAddChildClose,
  } = useDisclosure();

  useEffect(() => {
    fetchFamilyDetails();
    fetchChildren();
  }, []);

  useEffect(() => {
    if (!stakeContract || !children.length) {
      setChildrenStakes({});
      return;
    }

    // const fetchChildDetails = async () => {
    //   const childDetails = {};
    //   await Promise.all(
    //     children.map(async (child) => {
    //       const [details, stakes] = await Promise.all([
    //         stakeContract.fetchStakerDetails(child._address),
    //         stakeContract.fetchStakes(child._address),
    //       ]);
    //       childDetails[child._address] = { ...details, stakes };
    //     })
    //   );
    //   setChildrenStakes(childDetails);
    // };
    // fetchChildDetails();
  }, [stakeContract, children]);

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================
  const updateBalance = () => {};

  const updateNetFlow = async () => {};

  const balanceActions = () => {
    return (
      <Flex mt="8" justifyContent="flex-end" gridGap="4">
        <Button
          onClick={() => setShowTopUp(true)}
          disabled={childrenLoading} // Disable the button while loading
          w={{ base: "100%", md: "auto" }} // Set button width
        >
          <Flex alignItems="center">
            <Arrow />
            <Text
              ml="6"
              fontWeight="medium"
              fontSize="base"
              textAlign="left"
              px=".6rem"
            >
              Deposit
            </Text>
          </Flex>
        </Button>

        <Button
          className="bg-blue-oil"
          onClick={() => setShowWithdraw(true)}
          disabled={childrenLoading} // Disable the button while loading
          w={{ base: "100%", md: "auto" }} // Set button width
          size="md"
        >
          <Flex alignItems="center">
            <Arrow dir="down" />
            <Text ml="6" fontWeight="medium" fontSize="base" textAlign="left">
              Withdraw
            </Text>
          </Flex>
        </Button>

        <Menu>
          {({ isOpen }) => (
            <>
              <MenuButton
                isActive={isOpen}
                as={Button}
                rightIcon={<ChevronDownIcon />}
              >
                {isOpen ? "Less" : "More"}
              </MenuButton>
              <MenuList>
                <MenuItem
                  icon={<AiOutlinePlus />}
                  onClick={() => onAddChildOpen()}
                >
                  Add Child
                </MenuItem>
                <MenuItem
                  icon={<BiTransfer />}
                  onClick={() => alert("Kagebunshin")}
                >
                  Transfer to all kids
                </MenuItem>
              </MenuList>
            </>
          )}
        </Menu>
        {/* <IconButton
          size="md"
          aria-label="Menu Icon"
          icon={<HamburgerIcon />}
          // onClick={() => setMenuOpen(!menuOpen)}
        /> */}
      </Flex>
    );
  };

  const fetchFamilyDetails = useCallback(async () => {
    if (!walletAddress) return;

    const contract = await HostContract.fromProvider(
      connectedSigner,
      walletAddress
    );
    const family = (await contract.getFamilyByOwner(
      walletAddress
    )) as FamilyDetails;
    console.log("family - fetchFamilyDetails", family);
    setFamilyDetails(family);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  const fetchChildren = useCallback(async () => {
    const getChildren = async () => {
      if (!walletAddress) return;

      console.log("fetchChildren", walletAddress);

      const contract = await HostContract.fromProvider(
        connectedSigner,
        walletAddress
      );

      setChildrenLoading(true);
      const children = await contract.fetchChildren();
      console.log("children - fetchChildren", children);
      setChildren(children);
      setChildrenLoading(false);
    };

    await getChildren();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children.length, contract, walletAddress]);

  return (
    <Box>
      <Container maxW="container.lg" mt="8rem">
        <Flex justifyContent="flex-start" alignItems="center" mb={10}>
          <Tooltip label="Change Avatar">
            <Avatar
              size="xl"
              name={
                familyDetails.username
                  ? familyDetails.username
                  : trimAddress(walletAddress)
              }
              src={familyDetails.avatarURI}
              style={{ cursor: "pointer" }}
              onClick={onOpen}
              _hover={{
                transform: "scale(1.05)",
              }}
            />
          </Tooltip>

          <Heading fontSize={isMobileSmall ? "2xl" : "xl"}>
            {`Welcome back, ${
              familyDetails.username
                ? familyDetails.username
                : trimAddress(walletAddress)
            }`}
          </Heading>
        </Flex>

        {/* Account Balance */}
        <Container
          maxW="container.md"
          centerContent
          bgGradient={["linear(to-b, #4F1B7C, black)"]}
          borderRadius={20}
        >
          <Flex
            py="8"
            rounded="xl"
            color="white"
            justify="space-between"
            w="100%"
          >
            {/* Parent Account Details */}
            <Flex flexDir="column" alignItems="space-between" w="100%">
              <Text fontSize="xs" mb={2}>
                AVAILABLE FUNDS
              </Text>

              {/* Balance */}
              <Flex alignItems="center">
                <Image
                  src="https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=018"
                  alt="USDC logo"
                  width={10}
                  height={10}
                  mr={3}
                />

                <Heading
                  size={isMobileSmall ? "2xl" : "xl"}
                  display="flex"
                  alignItems="baseline"
                >
                  {balance ? (
                    <AnimatedNumber value={balance} rate={netFlow} />
                  ) : (
                    104.9875521
                  )}
                  <Text fontSize="sm" ml="2">
                    USDx
                  </Text>
                </Heading>
              </Flex>
              {balanceActions()}
            </Flex>
          </Flex>
        </Container>

        {/* <TopUpModal
        show={showTopUp}
        onClose={() => setShowTopUp(false)}
        onTransfer={() => updateBalance()}
      /> */}
        {/* <WithdrawModal
        show={showWithdraw}
        onClose={() => setShowWithdraw(false)}
        onTransfer={() => updateBalance()}
        balance={Math.floor(balance)}
      />
      <TransferAllModal
        show={showTransferAll}
        onClose={() => setShowTransferAll(false)}
        onTransfer={() => updateBalance()}
        balance={Math.floor(balance)}
      />
      <TransferModal
        show={!!transferChild}
        onClose={() => setTransferChild(undefined)}
        onTransfer={() => updateBalance()}
        balance={Math.floor(balance)}
        child={transferChild}
      />
      <StreamModal
        show={!!streamChild}
        onClose={() => setStreamChild(undefined)}
        onTransfer={() => updateBalance()}
        balance={Math.floor(balance)}
        child={streamChild}
      /> */}
      </Container>

      <Container
        maxW="container.lg"
        my="16"
        className={childrenLoading && "animate-pulse"}
      >
        <Center my="2rem">
          <Heading fontSize="2xl">YOUR KIDS</Heading>
        </Center>

        {children.length > 0 && (
          <Flex
            direction="row"
            gridGap="14"
            gridTemplateColumns="1fr"
            justify="center"
          >
            {children.map((c) => (
              <Child
                key={c.wallet + childKey}
                {...c}
                {...childrenStakes[c.wallet]}
                onTransfer={() => setTransferChild(c)}
                onStream={() => setStreamChild(c)}
                onOpen={onOpenChildDetails}
              />
            ))}
          </Flex>
        )}
      </Container>

      {/* Modals */}
      <AddChildModal
        isOpen={isAddChildOpen}
        onClose={onAddChildClose}
        onAdd={() => fetchChildren()}
      />

      <ChangeAvatarModal isOpen={isOpen} onClose={onClose} />

      <ChildDetailsDrawer
        isOpen={isOpenChildDetails}
        onClose={onCloseChildDetails}
        placement="left"
      />
    </Box>
  );
};

export default Parent;

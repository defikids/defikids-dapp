/* eslint-disable react/no-children-prop */
import {
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Image,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useBreakpointValue,
  useDisclosure,
  useSteps,
  useToast,
  MenuDivider,
  Wrap,
  WrapItem,
  IconButton,
  HStack,
  PinInput,
  PinInputField,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
// import Child from "@/components/child";
import contract from "@/services/contract";
import HostContract from "@/services/contract";
import StakeContract from "@/services/stake";
import { BiTransfer, BiWalletAlt } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import shallow from "zustand/shallow";
import { useAuthStore } from "@/store/auth/authStore";
import { useContractStore } from "@/store/contract/contractStore";
import { trimAddress, getEtherscanUrl } from "@/utils/web3";
import { FamilyDetails, ChildDetails } from "@/dataSchema/hostContract";
import { ChangeAvatarModal } from "@/components/Modals/ChangeAvatarModal";
import { ChevronDownIcon, EditIcon } from "@chakra-ui/icons";
import { ChildDetailsDrawer } from "@/components/drawers/ChildDetailsDrawer";
import { steps } from "@/components/steppers/TransactionStepper";
import axios from "axios";
import router from "next/router";
import { AddChildModal } from "@/components/Modals/AddChildModal";
import { useBalance } from "wagmi";
import { UsernameModal } from "@/components/Modals/UsernameModal";
import { RxAvatar } from "react-icons/rx";
import { SendFundsModal } from "@/components/Modals/SendFundsModal";
import { useNetwork } from "wagmi";
import { EtherscanContext } from "@/dataSchema/enums";
import { ParentDetailsDrawer } from "@/components/drawers/ParentDetailsDrawer";
import { HiMenu } from "react-icons/hi";
import { PasswordInput } from "@/components/PasswordInput";
import { transactionErrors } from "@/utils/errorHanding";
import { TransactionResponse } from "@ethersproject/abstract-provider";

const Child: React.FC = () => {
  //=============================================================================
  //                               STATE
  //=============================================================================

  const [childKey, setChildKey] = useState<number | null>(null);
  const [childrenLoading, setChildrenLoading] = useState(false);
  const [children, setChildren] = useState([]);
  const [childrenStakes, setChildrenStakes] = useState({});
  const [stakeContract, setStakeContract] = useState<StakeContract>();
  const [childDetails, setChildDetails] = useState({} as ChildDetails);
  const [loading, setIsLoading] = useState(false);
  const [familyId, setFamilyId] = useState<string>("");
  const [familyIdSubmitted, setFamilyIdSubmitted] = useState<boolean>(false);

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

  const { data } = useBalance({
    address: walletAddress as `0x${string}`,
  });

  const toast = useToast();
  const { chain } = useNetwork();

  const isMobileSize = useBreakpointValue({
    base: true,
    sm: false,
    md: false,
    lg: false,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isAddChildOpen,
    onOpen: onAddChildOpen,
    onClose: onAddChildClose,
  } = useDisclosure();

  const {
    isOpen: isOpenChildDetails,
    onOpen: onOpenChildDetails,
    onClose: onCloseChildDetails,
  } = useDisclosure();

  const {
    isOpen: isChangeUsernameOpen,
    onOpen: onChangeUsernameOpen,
    onClose: onChangeUsernameClose,
  } = useDisclosure();

  const {
    isOpen: isSendFundsOpen,
    onOpen: onSendFundsOpen,
    onClose: onSendFundsClose,
  } = useDisclosure();

  const {
    isOpen: isParentDetailsOpen,
    onOpen: onParentDetailsOpen,
    onClose: onParentDetailsClose,
  } = useDisclosure();

  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });

  // useEffect(() => {
  //   fetchFamilyDetails();
  //   fetchChildren();
  // }, []);

  // useEffect(() => {
  //   if (!stakeContract || !children.length) {
  //     setChildrenStakes({});
  //     return;
  //   }
  // }, [stakeContract, children]);

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================

  // const fetchChild = useCallback(async () => {
  //   const getChild = async () => {
  //     if (!walletAddress) return;

  //     const contract = await HostContract.fromProvider(
  //       connectedSigner,
  //       walletAddress
  //     );

  //     setChildrenLoading(true);
  //     const children = await contract.fetchChild(familyId, walletAddress);
  //     const childrenWalletBalances = await axios.post(
  //       `/api/etherscan/balancemulti`,
  //       {
  //         addresses: children.map((c) => c.wallet),
  //       }
  //     );

  //     const childrenWithBalances = children.map((c) => {
  //       const balance = childrenWalletBalances.data.find(
  //         (b) => b.account === c.wallet
  //       );
  //       return {
  //         ...c,
  //         balance: balance ? balance.balance : 0,
  //       };
  //     });

  //     setChildren(childrenWithBalances);
  //     setChildrenLoading(false);
  //   };

  //   await getChild();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [children.length, contract, walletAddress]);

  const uploadToIpfs = async (selectedFile: File | null) => {
    try {
      const response = await axios.post(
        `/api/ipfs/upload-to-ipfs`,
        selectedFile,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (e) {
      console.error(e as Error);
      return {
        validationError: "",
        ifpsHash: "",
      };
    }
  };

  const handleSubmit = async (selectedFile: File | null, avatarURI: string) => {
    setIsLoading(true);
    setActiveStep(0);

    let ipfsImageHash = "";

    if (selectedFile) {
      const { validationError, ifpsHash } = (await uploadToIpfs(
        selectedFile
      )) as {
        validationError: string;
        ifpsHash: string;
      };

      if (validationError) {
        toast({
          title: "Error",
          description: validationError,
          status: "error",
        });
        return;
      }
      ipfsImageHash = ifpsHash;
    }

    const ifpsURI = `https://ipfs.io/ipfs/${ipfsImageHash}`;
    const avatar = ipfsImageHash ? ifpsURI : avatarURI;

    console.log("avatar", avatar);
    console.log("walletAddress", walletAddress);
    console.log("connectedSigner", connectedSigner);

    const contract = await HostContract.fromProvider(connectedSigner);

    console.log("contract", contract);

    try {
      setActiveStep(1);

      const familyId = childDetails.familyId;
      const tx = (await contract.updateChildAvatarURI(
        walletAddress,
        avatar,
        familyId
      )) as TransactionResponse;

      setActiveStep(2);
      await tx.wait();

      setChildDetails({
        ...childDetails,
        avatarURI: avatar,
      });

      toast({
        title: "Avatar successfully updated",
        status: "success",
      });

      onClose();
    } catch (e) {
      setIsLoading(false);
      const errorDetails = transactionErrors(e);
      toast(errorDetails);
      onClose();
    }
  };

  const onFamilyIdSubmit = async (id: string, parentWallet: string) => {
    if (!id || !parentWallet) {
      toast({
        title: "Error",
        description: "Enter family id and parent address",
        status: "error",
      });
      return;
    }

    const contract = await HostContract.fromProvider(connectedSigner);
    const hashFamilyId = await contract.hashFamilyId(parentWallet, id);
    const childDetails = await contract.fetchChild(hashFamilyId, walletAddress);

    if (!childDetails.username) {
      toast({
        title: "Error",
        description: "Invalid family id or parent address",
        status: "error",
      });
      return;
    }

    setChildDetails(childDetails);
    setFamilyIdSubmitted(true);
  };

  if (!familyIdSubmitted) {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        h="100vh"
        direction="column"
      >
        <Center w="md">
          <PasswordInput onFamilyIdSubmit={onFamilyIdSubmit} />
        </Center>
      </Flex>
    );
  }

  return (
    <Box>
      <Container maxW="container.lg" mt="8rem">
        <Flex justifyContent="flex-start" alignItems="center" my={10} ml={5}>
          <Tooltip label="Change Avatar">
            <Avatar
              size="xl"
              name={
                childDetails.username
                  ? childDetails.username
                  : trimAddress(walletAddress)
              }
              src={childDetails.avatarURI || "/images/placeholder-avatar.jpeg"}
              style={{ cursor: "pointer" }}
              onClick={onOpen}
              _hover={{
                transform: "scale(1.05)",
              }}
            />
          </Tooltip>

          <Heading fontSize={isMobileSize ? "2xl" : "xl"} ml={5}>
            {`Welcome back, ${
              childDetails.username
                ? childDetails.username
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
            align="center"
          >
            {/* Parent Account Details */}
            <Flex flexDir="column" alignItems="space-between" w="100%">
              <Text fontSize="xs" mb={2}>
                AVAILABLE FUNDS
              </Text>

              {/* Balance */}
              <Flex alignItems="center">
                <Image
                  src="/logos/ethereum-logo.png"
                  alt="Eth logo"
                  width={10}
                  height={10}
                  mr={3}
                />

                <Flex direction="row" alignItems="baseline">
                  <Heading
                    size={isMobileSize ? "2xl" : "xl"}
                    display="flex"
                    alignItems="baseline"
                  >
                    {`${Number(data?.formatted).toFixed(4)}`}
                  </Heading>
                  <Text fontSize="sm" ml={2}>
                    {data?.symbol}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            {/* {!isMobileSize ? (
              <Menu>
                {({ isOpen }) => (
                  <>
                    <MenuButton isActive={isOpen} as={Button} size="2xl">
                      <ChevronDownIcon fontSize="3xl" />
                    </MenuButton>
                    <MenuList>
                      <MenuGroup title="Parent">
                        <MenuItem icon={<RxAvatar />} onClick={onOpen}>
                          Change Avatar
                        </MenuItem>
                        <MenuItem
                          icon={<EditIcon />}
                          onClick={onChangeUsernameOpen}
                        >
                          Change Username
                        </MenuItem>
                        <MenuItem
                          icon={<BiWalletAlt />}
                          onClick={() => {
                            window.open(
                              getEtherscanUrl(
                                chain.id,
                                EtherscanContext.ADDRESS,
                                walletAddress
                              ),
                              "_blank"
                            );
                          }}
                        >
                          Transaction History
                        </MenuItem>
                      </MenuGroup>

                      <MenuDivider />

                      <MenuGroup title="Family Members">
                        <MenuItem
                          icon={<AiOutlinePlus />}
                          onClick={onAddChildOpen}
                        >
                          Add Member
                        </MenuItem>
                        <MenuItem
                          icon={<BiTransfer />}
                          onClick={() => alert("Transfer to all kids")}
                        >
                          Airdrop
                        </MenuItem>
                      </MenuGroup>
                    </MenuList>
                  </>
                )}
              </Menu>
            ) : (
              <IconButton
                variant="outline"
                colorScheme="white"
                aria-label="Call Sage"
                fontSize="30px"
                icon={<HiMenu />}
                onClick={onParentDetailsOpen}
                style={{ border: "1px solid transparent" }}
              />
            )} */}
          </Flex>
        </Container>
      </Container>

      {/* Children */}
      {/* <Container
        maxW="container.lg"
        my="16"
        className={childrenLoading && "animate-pulse"}
      >
        {children.length > 0 && (
          <>
            <Center my="2rem">
              <Heading fontSize="2xl">FAMILY MEMBERS</Heading>
            </Center>

            <Wrap direction="row" justify="center" spacing="8rem">
              {children.map((c, i) => (
                <WrapItem key={c.wallet}>
                  <Child
                    childDetails={c}
                    {...c}
                    {...childrenStakes[c.wallet]}
                    onOpen={onOpenChildDetails}
                    setChildKey={setChildKey}
                    childKey={i}
                  />
                </WrapItem>
              ))}
            </Wrap>
          </>
        )}
      </Container> */}

      {/* Modals */}

      <ChangeAvatarModal
        isOpen={isOpen}
        onClose={onClose}
        activeStep={activeStep}
        loading={loading}
        handleSubmit={handleSubmit}
        children={children}
        childKey={childKey}
        familyURI={childDetails.avatarURI}
      />
      {/* 
      <ChildDetailsDrawer
        isOpen={isOpenChildDetails}
        onClose={onCloseChildDetails}
        placement="left"
        onOpen={onOpen}
        childKey={childKey}
        children={children}
        setChildKey={setChildKey}
        // fetchChildren={fetchChildren}
        onOpenChangeUsername={onChangeUsernameOpen}
        onSendFundsOpen={onSendFundsOpen}
      /> */}

      <UsernameModal
        isOpen={isChangeUsernameOpen}
        onClose={onChangeUsernameClose}
        childDetails={childDetails}
        setChildDetails={setChildDetails}
      />
      {/* 
      <SendFundsModal
        isOpen={isSendFundsOpen}
        onClose={onSendFundsClose}
        childKey={childKey}
        children={children}
        fetchChildren={fetchChildren}
      /> */}

      {/* {isMobileSize && (
        <ParentDetailsDrawer
          isOpen={isParentDetailsOpen}
          onClose={onParentDetailsClose}
          placement="bottom"
          onOpen={onOpen}
          walletAddress={walletAddress}
          onChangeUsernameOpen={onChangeUsernameOpen}
          onAddChildOpen={onAddChildOpen}
        />
      )} */}
    </Box>
  );
};

export default Child;

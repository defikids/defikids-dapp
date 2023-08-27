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
  StatGroup,
  Stat,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatLabel,
  ButtonGroup,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
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
import { ChildDefiOptionsDrawer } from "@/components/drawers/ChildDefiOptionsDrawer";
import { GrGrow } from "react-icons/gr";
import { BiTimeFive } from "react-icons/bi";
import { kv } from "@vercel/kv";
import { NextApiRequest, NextApiResponse } from "next";

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
  const [isBackground, setIsBackground] = useState<boolean>(false);

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
    isOpen: isChildDefiOptionsOpen,
    onOpen: onChildDefiOptionsOpen,
    onClose: onChildDefiOptionsClose,
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

  const testPostKV = async () => {
    const body = {
      address: walletAddress,
      value: {
        avatarURI:
          "https://purple-ripe-cuckoo-537.mypinata.cloud/ipfs/QmYZ8KHQDupvfU5Bu6qCsPuStMqm1EyEK9hYTtxmLyTUV3",
        backgroundURI:
          "https://cdn.pixabay.com/photo/2021/02/01/06/48/geometric-5969508_1280.png",
      },
    };

    try {
      const { data } = await axios.post(`/api/vercel/set-user`, body);
      console.log("data", data);
    } catch (err) {
      console.log(err);
    }
  };

  const testGetKV = async () => {
    try {
      const { data } = await axios.get(
        `/api/vercel/get-user?address=${walletAddress}`
      );
      console.log("data", data);
    } catch (error) {
      console.log("error", error);
    }
  };

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
      setIsLoading(false);
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
    <Box
      mt={isBackground ? "-7.5rem" : "0"}
      h="100vh"
      bgImage={
        isBackground
          ? `linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.5),
      rgba(0, 0, 0, 0.5)
    ), url(${childDetails.avatarURI || "/images/placeholder-avatar.jpeg"})`
          : ""
      }
      bgRepeat="no-repeat"
      bgPosition="center"
    >
      <Container maxW="container.lg" mt="8rem">
        <Button variant="outline" onClick={testPostKV}>
          KV Post test
        </Button>
        <Button variant="outline" onClick={testGetKV}>
          KV get test
        </Button>
        <Flex justifyContent="flex-start" alignItems="center" my={10} ml={5}>
          {!isBackground && (
            <Tooltip label="Change Avatar">
              <Image
                // size="xl"
                w={isMobileSize ? "200px" : "200px"}
                alt={
                  childDetails.username
                    ? childDetails.username
                    : trimAddress(walletAddress)
                }
                src={
                  childDetails.avatarURI || "/images/placeholder-avatar.jpeg"
                }
                style={{ cursor: "pointer" }}
                onClick={onOpen}
                _hover={{
                  transform: "scale(1.05)",
                }}
              />
            </Tooltip>
          )}

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
            {!isMobileSize && (
              <>
                <Flex>
                  <Button
                    leftIcon={<GrGrow />}
                    colorScheme="blue"
                    size="lg"
                    mr={3}
                  >
                    Stake
                  </Button>
                  <Button
                    leftIcon={<BiTimeFive />}
                    colorScheme="blue"
                    size="lg"
                    variant="outline"
                  >
                    Timelock
                  </Button>
                </Flex>

                <Menu>
                  {({ isOpen }) => (
                    <Box ml={5}>
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
                            icon={<EditIcon />}
                            onClick={() => setIsBackground(!isBackground)}
                          >
                            Avatar as background
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
                    </Box>
                  )}
                </Menu>
                {/* <IconButton
                  variant="outline"
                  colorScheme="white"
                  aria-label="Call Sage"
                  fontSize="30px"
                  icon={<HiMenu />}
                  onClick={onChildDefiOptionsOpen}
                  style={{ border: "1px solid transparent" }}
                /> */}
              </>
            )}
          </Flex>
        </Container>
      </Container>

      <Container maxW="container.md" mt="2rem">
        <Tabs variant="soft-rounded" colorScheme="blue">
          <TabList>
            <Tab>Earning</Tab>
            <Tab>Saving</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <p>one!</p>
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>

      {/* <Container maxW="container.lg" mt="8rem">
        <StatGroup>
          <Stat>
            <StatLabel>Sent</StatLabel>
            <StatNumber>345,670</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              23.36%
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>Clicked</StatLabel>
            <StatNumber>45</StatNumber>
            <StatHelpText>
              <StatArrow type="decrease" />
              9.05%
            </StatHelpText>
          </Stat>
        </StatGroup>
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

      {isMobileSize && (
        <ChildDefiOptionsDrawer
          isOpen={isChildDefiOptionsOpen}
          onClose={onChildDefiOptionsClose}
          placement="bottom"
        />
      )}
    </Box>
  );
};

export default Child;

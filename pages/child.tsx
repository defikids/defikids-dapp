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
import contract from "@/blockchain/contracts/contract";
import HostContract from "@/blockchain/contracts/contract";
import StakeContract from "@/services/stake";
import { BiTransfer, BiWalletAlt } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import shallow from "zustand/shallow";
import { useAuthStore } from "@/store/auth/authStore";
import { useContractStore } from "@/store/contract/contractStore";
import { trimAddress, getEtherscanUrl } from "@/utils/web3";
import { ChildDetails } from "@/dataSchema/types";
import { ChevronDownIcon, EditIcon } from "@chakra-ui/icons";
import { ChildDetailsDrawer } from "@/components/drawers/ChildDetailsDrawer";
import { steps } from "@/components/steppers/TransactionStepper";
import axios from "axios";
import router from "next/router";
// import { AddChildModal } from "@/components/Modals/AddMemberModal";
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

// import { ChildDetailsDrawer } from "@/components/drawers/ChildDetailsDrawer";

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
  const [childDBData, setChildDBData] = useState<any>({});

  //=============================================================================
  //                               HOOKS
  //=============================================================================
  const { userDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
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
    address: userDetails?.wallet as `0x${string}`,
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

  useEffect(() => {
    if (!userDetails?.wallet) return;

    const getUserDBData = async () => {
      try {
        const { data } = await axios.get(
          `/api/vercel/get-json?key=${userDetails?.wallet}`
        );
        console.log("data", data);
        setChildDBData(data);
      } catch (error) {
        console.log("error", error);
      }
    };
    getUserDBData();
  }, [userDetails?.wallet]);

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
      address: userDetails?.wallet,
      value: {
        avatarURI:
          "https://purple-ripe-cuckoo-537.mypinata.cloud/ipfs/QmYZ8KHQDupvfU5Bu6qCsPuStMqm1EyEK9hYTtxmLyTUV3",
        backgroundURI:
          "https://cdn.pixabay.com/photo/2021/02/01/06/48/geometric-5969508_1280.png",
      },
    };

    try {
      const { data } = await axios.post(`/api/vercel/set-json`, body);
      console.log("data", data);
    } catch (err) {
      console.log(err);
    }
  };

  const testGetKV = async () => {
    try {
      const { data } = await axios.get(
        `/api/vercel/get-json?key=${userDetails?.wallet}`
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
    console.log("walletAddress", userDetails?.wallet);
    console.log("connectedSigner", connectedSigner);

    // const contract = await HostContract.fromProvider(connectedSigner);

    // console.log("contract", contract);

    try {
      setActiveStep(1);

      // const familyId = childDetails.familyId;
      // const tx = (await contract.updateChildAvatarURI(
      //   walletAddress,
      //   avatar,
      //   familyId
      // )) as TransactionResponse;

      // setActiveStep(2);
      // await tx.wait();

      // setChildDetails({
      //   ...childDetails,
      //   avatarURI: avatar,
      // });

      const body = {
        address: userDetails?.wallet,
        value: {
          ...childDBData,
          avatarURI: avatar,
        },
      };

      console.log("body", body);

      await axios.post(`/api/vercel/set-json`, body);
      const { data } = await axios.get(
        `/api/vercel/get-json?key=${userDetails?.wallet}`
      );
      console.log("data", data);
      setChildDBData(data);

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

    // const contract = await HostContract.fromProvider(connectedSigner);
    // const hashFamilyId = await contract.hashFamilyId(parentWallet, id);
    // const childDetails = await contract.fetchChild(hashFamilyId, walletAddress);

    // if (!childDetails.username) {
    //   toast({
    //     title: "Error",
    //     description: "Invalid family id or parent address",
    //     status: "error",
    //   });
    //   return;
    // }

    // setChildDetails(childDetails);
    // setFamilyIdSubmitted(true);
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
    ), url(${childDBData.avatarURI || "/images/placeholder-avatar.jpeg"})`
          : ""
      }
      bgRepeat="no-repeat"
      bgPosition="center"
    >
      <Container maxW="container.lg" mt="8rem"></Container>

      {isMobileSize && (
        <ChildDefiOptionsDrawer
          isOpen={isChildDefiOptionsOpen}
          onClose={onChildDefiOptionsClose}
          placement="bottom"
        />
      )}

      {/* <ChildDetailsDrawer
        isOpen={isOpenChildDetails}
        onClose={onCloseChildDetails}
        placement="right"
        childDetails={childDetails}
        setChildDetails={setChildDetails}
        childDBData={childDBData}
      /> */}
    </Box>
  );
};

export default Child;

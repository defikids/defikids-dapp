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
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useBreakpointValue,
  useDisclosure,
  useSteps,
  useToast,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import AnimatedNumber from "@/components/animated_number";
import Child from "@/components/child";
import contract from "@/services/contract";
import HostContract from "@/services/contract";
import StakeContract from "@/services/stake";
import { BiTransfer } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import shallow from "zustand/shallow";
import { useAuthStore } from "@/store/auth/authStore";
import { useContractStore } from "@/store/contract/contractStore";
import { trimAddress } from "@/lib/web3";
import { ChildDetails, FamilyDetails } from "@/dataSchema/hostContract";
import { ChangeAvatarModal } from "@/components/Modals/ChangeAvatarModal";
import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import { ChildDetailsDrawer } from "@/components/drawers/ChildDetailsDrawer";
import { steps } from "@/components/steppers/RegisterChildStepper";
import axios from "axios";
import router from "next/router";
import { AddChildModal } from "@/components/Modals/AddChildModal";

const Parent: React.FC = () => {
  //=============================================================================
  //                               STATE
  //=============================================================================

  const [childKey, setChildKey] = useState(0);
  const [balance, setBalance] = useState<number>();
  const [netFlow, setNetFlow] = useState<number>(0);
  const [childrenLoading, setChildrenLoading] = useState(false);
  const [children, setChildren] = useState([]);
  const [childrenStakes, setChildrenStakes] = useState({});
  const [stakeContract, setStakeContract] = useState<StakeContract>();
  const [familyDetails, setFamilyDetails] = useState({} as FamilyDetails);
  const [loading, setIsLoading] = useState(false);
  const [selectedChild, setSelectedChild] = useState({} as ChildDetails);

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

  const toast = useToast();

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

  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });

  useEffect(() => {
    fetchFamilyDetails();
    fetchChildren();
  }, []);

  useEffect(() => {
    console.log("selectedChild", selectedChild);
  }, [setSelectedChild]);

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

  // const balanceActions = () => {
  //   return (
  //     <Flex mt="8" justifyContent="flex-end" gridGap="4">
  //       <Button
  //         disabled={childrenLoading} // Disable the button while loading
  //         w={{ base: "100%", md: "auto" }} // Set button width
  //       >
  //         <Flex alignItems="center">
  //           <Arrow />
  //           <Text
  //             ml="6"
  //             fontWeight="medium"
  //             fontSize="base"
  //             textAlign="left"
  //             px=".6rem"
  //           >
  //             Deposit
  //           </Text>
  //         </Flex>
  //       </Button>

  //       <Button
  //         className="bg-blue-oil"
  //         disabled={childrenLoading} // Disable the button while loading
  //         w={{ base: "100%", md: "auto" }} // Set button width
  //         size="md"
  //       >
  //         <Flex alignItems="center">
  //           <Arrow dir="down" />
  //           <Text ml="6" fontWeight="medium" fontSize="base" textAlign="left">
  //             Withdraw
  //           </Text>
  //         </Flex>
  //       </Button>

  //       <Menu>
  //         {({ isOpen }) => (
  //           <>
  //             <MenuButton
  //               isActive={isOpen}
  //               as={Button}
  //               rightIcon={<ChevronDownIcon />}
  //             >
  //               {isOpen ? "Less" : "More"}
  //             </MenuButton>
  //             <MenuList>
  //               <MenuItem
  //                 icon={<AiOutlinePlus />}
  //                 onClick={() => onAddChildOpen()}
  //               >
  //                 Add Child
  //               </MenuItem>
  //               <MenuItem
  //                 icon={<BiTransfer />}
  //                 onClick={() => alert("Kagebunshin")}
  //               >
  //                 Transfer to all kids
  //               </MenuItem>
  //             </MenuList>
  //           </>
  //         )}
  //       </Menu>
  //       {/* <IconButton
  //         size="md"
  //         aria-label="Menu Icon"
  //         icon={<HamburgerIcon />}
  //         // onClick={() => setMenuOpen(!menuOpen)}
  //       /> */}
  //     </Flex>
  //   );
  // };

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
      const children = await contract.fetchChildren(walletAddress);
      console.log("children - fetchChildren", children);
      setChildren(children);
      setChildrenLoading(false);
    };

    await getChildren();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children.length, contract, walletAddress]);

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

    const contract = await HostContract.fromProvider(connectedSigner);

    try {
      setActiveStep(1);
      const tx = await contract.updateAvatarURI(avatar);

      setActiveStep(2);
      const txReceipt = await tx.wait();
      await fetchFamilyDetails();

      if (txReceipt.status === 1) {
        toast({
          title: "Avatar successfully updated",
          status: "success",
        });
        onClose();
        router.push("/parent");
      }
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
  };

  // https://v2-liveart.mypinata.cloud/ipfs/QmVkmX5pGfMuBEbBbWJiQAUcQjAqU7zT3jHF6SZTZNoZsY

  return (
    <Box>
      <Container maxW="container.lg" mt="8rem">
        <Flex justifyContent="flex-start" alignItems="center" my={10} ml={5}>
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

          <Heading fontSize={isMobileSmall ? "2xl" : "xl"} ml={5}>
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
            </Flex>
            <Menu>
              {({ isOpen }) => (
                <>
                  <MenuButton isActive={isOpen} as={Button} size="2xl">
                    <ChevronDownIcon fontSize="3xl" />
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
          </Flex>
        </Container>
      </Container>

      <Container
        maxW="container.lg"
        my="16"
        className={childrenLoading && "animate-pulse"}
      >
        {children.length > 0 && (
          <>
            <Center my="2rem">
              <Heading fontSize="2xl">YOUR KIDS</Heading>
            </Center>

            <Flex
              direction="row"
              gridGap="14"
              gridTemplateColumns="1fr"
              justify="center"
            >
              {children.map((c) => (
                <Child
                  key={c.wallet + childKey}
                  childDetails={c}
                  {...c}
                  {...childrenStakes[c.wallet]}
                  onOpen={onOpenChildDetails}
                  setSelectedChild={setSelectedChild}
                />
              ))}
            </Flex>
          </>
        )}
      </Container>

      {/* Modals */}
      <AddChildModal
        isOpen={isAddChildOpen}
        onClose={onAddChildClose}
        onAdd={() => fetchChildren()}
      />

      <ChangeAvatarModal
        isOpen={isOpen}
        onClose={onClose}
        activeStep={activeStep}
        loading={loading}
        handleSubmit={handleSubmit}
        currentAvatar={familyDetails.avatarURI}
      />

      <ChildDetailsDrawer
        isOpen={isOpenChildDetails}
        onClose={onCloseChildDetails}
        placement="left"
        childDetails={selectedChild}
      />
    </Box>
  );
};

export default Parent;

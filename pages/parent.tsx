/* eslint-disable react/no-children-prop */
import {
  Box,
  Button,
  Flex,
  useBreakpointValue,
  useDisclosure,
  useSteps,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import contract from "@/services/contract";
import StakeContract from "@/services/stake";
import shallow from "zustand/shallow";
import { useAuthStore } from "@/store/auth/authStore";
import { useContractStore } from "@/store/contract/contractStore";
import { User, ChildDetails } from "@/dataSchema/types";
import { steps } from "@/components/steppers/TransactionStepper";
import axios from "axios";
import { UsernameModal } from "@/components/Modals/UsernameModal";
import { ParentDashboardTabs } from "@/dataSchema/enums";
import { HiMenu } from "react-icons/hi";

import Username from "@/components/parentDashboard/Username";
import ParentAvatar from "@/components/parentDashboard/Avatar";
import ButtonMenu from "@/components/parentDashboard/ButtonMenu";
import AccountBalance from "@/components/parentDashboard/AccountBalance";
import ChildAvatarGroup from "@/components/parentDashboard/ChildAvatarGroup";
import { Settings } from "@/components/parentDashboard/tabs/Settings";
import BackgroundDefaults from "@/components/Modals/BackgroundDefaults";

const Parent: React.FC = () => {
  //=============================================================================
  //                               STATE
  //=============================================================================

  const [childKey, setChildKey] = useState<number | null>(null);
  const [childrenLoading, setChildrenLoading] = useState(false);
  const [children, setChildren] = useState([]);
  const [childrenStakes, setChildrenStakes] = useState({});
  const [stakeContract, setStakeContract] = useState<StakeContract>();
  const [familyDetails, setFamilyDetails] = useState({} as User);

  const [selectedTab, setSelectedTab] = useState<ParentDashboardTabs>(
    ParentDashboardTabs.DASHBOARD
  );
  const [cardOpacity, setCardOpacity] = useState(0);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0);

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

  const isMobileSize = useBreakpointValue({
    base: true,
    sm: false,
    md: false,
    lg: false,
  });

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

  const {
    isOpen: isOpenBackgroundDefaults,
    onOpen: onOpenBackgroundDefaults,
    onClose: onCloseBackgroundDefaults,
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
    if (!stakeContract || !children.length) {
      setChildrenStakes({});
      return;
    }
  }, [stakeContract, children]);

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================

  const fetchFamilyDetails = useCallback(async () => {
    if (!userDetails?.wallet) return;

    const { data } = await axios.get(
      `/api/vercel/get-json?key=${userDetails?.wallet}`
    );

    const user = data as User;
    setFamilyDetails(user);
  }, [userDetails?.wallet]);

  const fetchChildren = useCallback(async () => {
    const getChildren = async () => {
      if (!userDetails?.wallet) return;

      const children = [] as ChildDetails[];

      familyDetails.children?.forEach(async (walletAddress) => {
        const { data } = await axios.get(
          `/api/vercel/get-json?key=${walletAddress}`
        );

        children.push(data as ChildDetails);
      });

      if (children.length) {
        const childrenWalletBalances = await axios.post(
          `/api/etherscan/balancemulti`,
          {
            addresses: children.map((c) => c.wallet),
          }
        );

        const childrenWithBalances = children.map((c) => {
          const balance = childrenWalletBalances.data.find(
            (b) => b.account === c.wallet
          );
          return {
            ...c,
            balance: balance ? balance.balance : 0,
          };
        });

        setChildren(childrenWithBalances);
      } else {
        setChildren(children);
      }

      setChildrenLoading(false);
    };

    await getChildren();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children.length, contract, userDetails?.wallet]);

  return (
    <Box>
      <Flex direction="row">
        {!isMobileSize && (
          <Box
            bgGradient={["linear(to-b, black,#4F1B7C)"]}
            width="25%"
            height="100vh"
            pt={!children.length ? "3rem" : "1rem"}
            ml=".5rem"
            borderRadius="1.5rem"
            style={{
              boxShadow: "0px 0px 10px 15px rgba(0,0,0,0.75)",
            }}
          >
            <Username familyDetails={familyDetails} />
            <ParentAvatar familyDetails={familyDetails} />
            <AccountBalance walletAddress={userDetails?.wallet} />

            <ButtonMenu
              // onOpen={onOpenAvatar}
              onChangeUsernameOpen={onChangeUsernameOpen}
              onAddChildOpen={onAddChildOpen}
              children={children}
              setSelectedTab={setSelectedTab}
            />

            <ChildAvatarGroup children={children} />

            <VStack
              spacing={4}
              align="stretch"
              justify="space-between"
              mt={10}
              mx={5}
            >
              {children.length && (
                <Button
                  variant="outline"
                  colorScheme="white"
                  onClick={onAddChildOpen}
                  _hover={{ borderColor: "gray" }}
                >
                  Member Profiles
                </Button>
              )}

              <Button
                w="100%"
                variant="solid"
                colorScheme="blue"
                _hover={{ transform: "scale(1.05)" }}
              >
                Disconnect
              </Button>
            </VStack>
          </Box>
        )}

        <Flex
          width={!isMobileSize ? "75%" : "100%"}
          height="100vh"
          p={!isMobileSize ? "3rem" : "1rem"}
          bgPosition="center"
          bgRepeat="no-repeat"
        >
          <Box
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            bgPosition="center"
            bgSize="cover"
            bgImage={
              familyDetails?.backgroundURI
                ? familyDetails?.backgroundURI
                : "/images/backgrounds/city-center.png"
            }
            opacity={
              backgroundOpacity || familyDetails?.opacity?.background || 1
            }
            zIndex={-1}
          />

          <Box>
            {isMobileSize && (
              <IconButton
                size="lg"
                variant="outline"
                colorScheme="white"
                aria-label="Call Sage"
                fontSize="50px"
                icon={<HiMenu />}
                onClick={onParentDetailsOpen}
                style={{ border: "1px solid transparent" }}
              />
            )}

            {selectedTab === ParentDashboardTabs.SETTINGS && (
              <Settings
                familyDetails={familyDetails}
                onChangeUsernameOpen={onChangeUsernameOpen}
                fetchFamilyDetails={fetchFamilyDetails}
                onOpenBackgroundDefaults={onOpenBackgroundDefaults}
                setBackgroundOpacity={setBackgroundOpacity}
                setCardOpacity={setCardOpacity}
                cardOpacity={cardOpacity}
              />
            )}
          </Box>
        </Flex>
      </Flex>

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

      <UsernameModal
        isOpen={isChangeUsernameOpen}
        onClose={onChangeUsernameClose}
        childKey={childKey}
        children={children}
        familyId={familyDetails.familyId}
        fetchChildren={fetchChildren}
        fetchFamilyDetails={fetchFamilyDetails}
      />

      <BackgroundDefaults
        isOpen={isOpenBackgroundDefaults}
        onClose={onCloseBackgroundDefaults}
        fetchFamilyDetails={fetchFamilyDetails}
      />

      {/* <ChangeAvatarModal
        isOpen={isOpen}
        onClose={onClose}
        activeStep={activeStep}
        loading={loading}
        handleSubmit={handleSubmit}
        children={children}
        childKey={childKey}
        familyURI={familyDetails?.avatarURI}
      /> */}
    </Box>
  );
};

export default Parent;

//  <Box>
//        <Container maxW="container.lg" mt="8rem">
//          <Flex justifyContent="flex-start" alignItems="center" my={10} ml={5}>
//            <Tooltip label="Change Avatar">
//              <Avatar
//                size="xl"
//                name={
//                  familyDetails.username
//                    ? familyDetails.username
//                    : trimAddress(walletAddress)
//                }
//                src={familyDetails.avatarURI || "/images/placeholder-avatar.jpeg"}
//                style={{ cursor: "pointer" }}
//                onClick={onOpen}
//                _hover={{
//                  transform: "scale(1.05)",
//                }}
//              />
//            </Tooltip>

//            <Heading fontSize={isMobileSize ? "2xl" : "xl"} ml={5}>
//              {`Welcome back, ${
//                familyDetails.username
//                  ? familyDetails.username
//                  : trimAddress(walletAddress)
//              }`}
//            </Heading>
//          </Flex>

//          <Container
//            maxW="container.md"
//            centerContent
//            bgGradient={["linear(to-b, #4F1B7C, black)"]}
//            borderRadius={20}
//          >
//            <Flex
//              py="8"
//              rounded="xl"
//              color="white"
//              justify="space-between"
//              w="100%"
//              align="center"
//            >
//              <Flex flexDir="column" alignItems="space-between" w="100%">
//                <Text fontSize="xs" mb={2}>
//                  AVAILABLE FUNDS
//                </Text>

//                <Flex alignItems="center">
//                  <Image
//                    src="/logos/ethereum-logo.png"
//                    alt="Eth logo"
//                    width={10}
//                    height={10}
//                    mr={3}
//                  />

//                  <Flex direction="row" alignItems="baseline">
//                    <Heading
//                      size={isMobileSize ? "2xl" : "xl"}
//                      display="flex"
//                      alignItems="baseline"
//                    >
//                      {`${Number(data?.formatted).toFixed(4)}`}
//                    </Heading>
//                    <Text fontSize="sm" ml={2}>
//                      {data?.symbol}
//                    </Text>
//                  </Flex>
//                </Flex>
//              </Flex>
//              {!isMobileSize ? (
//                <Menu>
//                  {({ isOpen }) => (
//                    <>
//                      <MenuButton isActive={isOpen} as={Button} size="2xl">
//                        <ChevronDownIcon fontSize="3xl" />
//                      </MenuButton>
//                      <MenuList>
//                        <MenuGroup title="Parent">
//                          <MenuItem icon={<RxAvatar />} onClick={onOpen}>
//                            Change Avatar
//                          </MenuItem>
//                          <MenuItem
//                            icon={<EditIcon />}
//                            onClick={onChangeUsernameOpen}
//                          >
//                            Change Username
//                          </MenuItem>
//                          <MenuItem
//                            icon={<BiWalletAlt />}
//                            onClick={() => {
//                              window.open(
//                                getEtherscanUrl(
//                                  chain.id,
//                                  EtherscanContext.ADDRESS,
//                                  walletAddress
//                                ),
//                                "_blank"
//                              );
//                            }}
//                          >
//                            Transaction History
//                          </MenuItem>
//                        </MenuGroup>

//                        <MenuDivider />

//                        <MenuGroup title="Family Members">
//                          <MenuItem
//                            icon={<AiOutlinePlus />}
//                            onClick={onAddChildOpen}
//                          >
//                            Add Member
//                          </MenuItem>
//                          <MenuItem
//                            icon={<BiTransfer />}
//                            onClick={() => alert("Transfer to all kids")}
//                          >
//                            Airdrop
//                          </MenuItem>
//                        </MenuGroup>
//                      </MenuList>
//                    </>
//                  )}
//                </Menu>
//              ) : (
//                <IconButton
//                  variant="outline"
//                  colorScheme="white"
//                  aria-label="Call Sage"
//                  fontSize="30px"
//                  icon={<HiMenu />}
//                  onClick={onParentDetailsOpen}
//                  style={{ border: "1px solid transparent" }}
//                />
//              )}
//            </Flex>
//          </Container>
//        </Container>

//        <Container
//          maxW="container.lg"
//          my="16"
//          className={childrenLoading && "animate-pulse"}
//        >
//          {children.length > 0 ? (
//            <>
//              <Center my="2rem">
//                <Heading fontSize="2xl">FAMILY MEMBERS</Heading>
//              </Center>

//              <Wrap direction="row" justify="center" spacing="8rem">
//                {children.map((c, i) => (
//                  <WrapItem key={c.wallet}>
//                    <Child
//                      childDetails={c}
//                      {...c}
//                      {...childrenStakes[c.wallet]}
//                      onOpen={onOpenChildDetails}
//                      setChildKey={setChildKey}
//                      childKey={i}
//                    />
//                  </WrapItem>
//                ))}
//              </Wrap>
//            </>
//          ) : (
//            <Center my="2rem">
//              <Heading fontSize="2xl">No Family Members</Heading>
//            </Center>
//          )}
//        </Container>

//        <AddChildModal
//          isOpen={isAddChildOpen}
//          onClose={onAddChildClose}
//          onAdd={() => fetchChildren()}
//        />

//        <ChangeAvatarModal
//          isOpen={isOpen}
//          onClose={onClose}
//          activeStep={activeStep}
//          loading={loading}
//          handleSubmit={handleSubmit}
//          children={children}
//          childKey={childKey}
//          familyURI={familyDetails.avatarURI}
//        />

//        <ChildDetailsDrawer
//          isOpen={isOpenChildDetails}
//          onClose={onCloseChildDetails}
//          placement="left"
//          onOpen={onOpen}
//          childKey={childKey}
//          children={children}
//          setChildKey={setChildKey}
//          fetchChildren={fetchChildren}
//          onOpenChangeUsername={onChangeUsernameOpen}
//          onSendFundsOpen={onSendFundsOpen}
//        />

//        <UsernameModal
//          isOpen={isChangeUsernameOpen}
//          onClose={onChangeUsernameClose}
//          childKey={childKey}
//          children={children}
//          familyId={familyDetails.familyId}
//          fetchChildren={fetchChildren}
//          fetchFamilyDetails={fetchFamilyDetails}
//        />

//        <SendFundsModal
//          isOpen={isSendFundsOpen}
//          onClose={onSendFundsClose}
//          childKey={childKey}
//          children={children}
//          fetchChildren={fetchChildren}
//          fetchFamilyDetails={fetchFamilyDetails}
//        />

//        {isMobileSize && (
//          <ParentDetailsDrawer
//            isOpen={isParentDetailsOpen}
//            onClose={onParentDetailsClose}
//            placement="bottom"
//            onOpen={onOpen}
//            walletAddress={walletAddress}
//            onChangeUsernameOpen={onChangeUsernameOpen}
//            onAddChildOpen={onAddChildOpen}
//          />
//        )}
//      </Box>

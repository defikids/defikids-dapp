/* eslint-disable react/no-children-prop */
import {
  QuestionOutlineIcon,
  SettingsIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Slide,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import Username from "./parentDashboard/Username";
import ParentAvatar from "./parentDashboard/Avatar";
import AccountBalance from "./parentDashboard/AccountBalance";
import ButtonMenu from "./parentDashboard/ButtonMenu";
import ChildAvatarGroup from "./parentDashboard/ChildAvatarGroup";
import { ParentDashboardTabs } from "@/data-schema/enums";
import { ChildDetails, User } from "@/data-schema/types";
import { useAuthStore } from "@/store/auth/authStore";
import shallow from "zustand/shallow";
import { EtherscanLogoCircle } from "@/components/logos/EtherscanLogoCircle";
import { colors } from "@/services/chakra/theme";
import InfoModal from "@/components/Modals/InfoModal";

export const ExpandedDashboardMenu = ({
  familyDetails,
  children,
  onAddChildOpen,
  setSelectedTab,
  onToggleCollapsedMenu,
  onToggleExtendedMenu,
  isOpenExtendedMenu,
  onOpenEtherScan,
  isMobileSize,
}: {
  familyDetails: User;
  children: ChildDetails[];
  onAddChildOpen: () => void;
  setSelectedTab: (tab: ParentDashboardTabs) => void;
  onToggleCollapsedMenu: () => void;
  onToggleExtendedMenu: () => void;
  isOpenExtendedMenu: boolean;
  onOpenEtherScan: () => void;
  isMobileSize: boolean;
}) => {
  const { setLogout, userDetails, mobileMenuOpen, setMobileMenuOpen } =
    useAuthStore(
      (state) => ({
        setLogout: state.setLogout,
        userDetails: state.userDetails,
        mobileMenuOpen: state.mobileMenuOpen,
        setMobileMenuOpen: state.setMobileMenuOpen,
      }),
      shallow
    );

  const showMenu = () => {
    if (!isOpenExtendedMenu && !isMobileSize) {
      return true;
    }

    if (isMobileSize && mobileMenuOpen) {
      return true;
    }
  };

  const {
    isOpen: isOpenInfoModal,
    onOpen: onOpenInfoModal,
    onClose: onCloseInfoModal,
  } = useDisclosure();

  return (
    <>
      <Slide in={showMenu()} direction={isMobileSize ? "top" : "left"}>
        <Box
          bgGradient={[`linear(to-b, black,${colors.brand.purple})`]}
          maxWidth={isMobileSize ? "100%" : "350px"}
          height={isMobileSize ? "100vh" : "96vh"}
          // height={"100vh"}
          ml={!isMobileSize && "1rem"}
          mt={5}
          borderRadius={!isMobileSize && "1.5rem"}
          style={{
            boxShadow: "0px 0px 10px 15px rgba(0,0,0,0.75)",
          }}
        >
          <Flex direction="column" h="100%" justify="space-between">
            <Box>
              <Flex
                direction="row"
                justify="flex-end"
                align="center"
                onClick={() => {
                  if (isMobileSize) setMobileMenuOpen(!mobileMenuOpen);
                  onToggleExtendedMenu();
                  setTimeout(() => {
                    onToggleCollapsedMenu();
                  }, 500);
                }}
              >
                <IconButton
                  mx={5}
                  mt={2}
                  colorScheme="gray"
                  aria-label="button"
                  size="md"
                  icon={<TriangleUpIcon />}
                />
              </Flex>
              <Username familyDetails={familyDetails} mt={5} />
              <ParentAvatar familyDetails={familyDetails} />
              <AccountBalance walletAddress={userDetails?.wallet} />

              <ButtonMenu
                onAddChildOpen={onAddChildOpen}
                setSelectedTab={setSelectedTab}
                children={children}
              />

              <ChildAvatarGroup children={children} />

              <VStack
                spacing={4}
                align="stretch"
                justify="space-between"
                mt={10}
                mx={5}
                mb="3rem"
              >
                {children.length && (
                  <Button
                    variant="outline"
                    colorScheme="white"
                    onClick={(e) => {
                      onAddChildOpen();
                      e.stopPropagation();
                    }}
                    _hover={{ borderColor: "gray" }}
                  >
                    Member Profiles
                  </Button>
                )}
              </VStack>
            </Box>

            {/* Footer Buttons */}
            <Box m={5} pb={isMobileSize && 5}>
              <Flex direction="row" justify="flex-end" align="center">
                <Button
                  size="lg"
                  w="100%"
                  variant="solid"
                  colorScheme="gray"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLogout();
                  }}
                  fontSize={isMobileSize ? "md" : "sm"}
                >
                  Disconnect
                </Button>

                <IconButton
                  ml={4}
                  colorScheme="gray"
                  aria-label="button"
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenEtherScan();
                  }}
                  icon={
                    <EtherscanLogoCircle
                      fill="white"
                      width="22px"
                      height="22px"
                    />
                  }
                />

                <IconButton
                  mx={4}
                  colorScheme="gray"
                  aria-label="button"
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    // onOpenInfoModal();
                    setSelectedTab(ParentDashboardTabs.INFORMATION);
                  }}
                  icon={
                    <QuestionOutlineIcon
                      style={{ width: "22px", height: "22px" }}
                    />
                  }
                />
                <IconButton
                  colorScheme="gray"
                  aria-label="button"
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTab(ParentDashboardTabs.SETTINGS);
                    onToggleCollapsedMenu();
                    onToggleExtendedMenu();
                  }}
                  icon={
                    <SettingsIcon style={{ width: "22px", height: "22px" }} />
                  }
                />
              </Flex>
            </Box>
          </Flex>
        </Box>
      </Slide>
      <InfoModal isOpen={isOpenInfoModal} onClose={onCloseInfoModal} />
    </>
  );
};

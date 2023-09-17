"use client";

/* eslint-disable react/no-children-prop */
import {
  QuestionOutlineIcon,
  SettingsIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton, Slide } from "@chakra-ui/react";
import Username from "./parentDashboard/Username";
import ParentAvatar from "./parentDashboard/Avatar";
import AccountBalance from "./parentDashboard/AccountBalance";
import ButtonMenu from "./parentDashboard/ButtonMenu";
import { ParentDashboardTabs } from "@/data-schema/enums";
import { ChildDetails, User } from "@/data-schema/types";
import { useAuthStore } from "@/store/auth/authStore";
import shallow from "zustand/shallow";
import { EtherscanLogoCircle } from "@/components/logos/EtherscanLogoCircle";
import { colors } from "@/services/chakra/theme";
import { useRouter } from "next/navigation";

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
  onOpenSettingsModal,
  onOpenInfoModal,
  onOpenSendFundsModal,
  onOpenNetworkModal,
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
  onOpenSettingsModal: () => void;
  onOpenInfoModal: () => void;
  onOpenSendFundsModal: () => void;
  onOpenNetworkModal: () => void;
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

  const router = useRouter();

  const showMenu = () => {
    if (!isOpenExtendedMenu && !isMobileSize) {
      return true;
    }

    if (isMobileSize && mobileMenuOpen) {
      return true;
    }
  };

  return (
    <>
      <Slide in={showMenu()} direction={isMobileSize ? "top" : "left"}>
        <Box
          bgGradient={[`linear(to-b, black,${colors.brand.purple})`]}
          maxWidth={isMobileSize ? "100%" : "350px"}
          height={isMobileSize ? "100vh" : "96vh"}
          ml={!isMobileSize ? "1rem" : 0}
          mt={mobileMenuOpen ? 0 : 5}
          borderRadius={!isMobileSize ? "1.5rem" : 0}
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
                  if (isMobileSize) {
                    !mobileMenuOpen
                      ? setMobileMenuOpen(true)
                      : setMobileMenuOpen(false);
                  }

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
                onOpenEtherScan={onOpenEtherScan}
                onOpenSettingsModal={onOpenSettingsModal}
                onOpenInfoModal={onOpenInfoModal}
                onOpenSendFundsModal={onOpenSendFundsModal}
                onOpenNetworkModal={onOpenNetworkModal}
                children={children}
              />
            </Box>

            {/* Footer Buttons */}
            <Box m={5} pb={isMobileSize ? 5 : 0}>
              <Flex direction="row" justify="flex-end" align="center">
                <Button
                  size="lg"
                  w="100%"
                  variant="solid"
                  colorScheme="gray"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLogout();
                    router.push("/");
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
                    onOpenInfoModal();
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
                    onOpenSettingsModal();
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
    </>
  );
};

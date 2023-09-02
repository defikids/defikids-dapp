import {
  QuestionOutlineIcon,
  SettingsIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton, Slide, VStack } from "@chakra-ui/react";
import Username from "./parentDashboard/Username";
import ParentAvatar from "./parentDashboard/Avatar";
import AccountBalance from "./parentDashboard/AccountBalance";
import ButtonMenu from "./parentDashboard/ButtonMenu";
import ChildAvatarGroup from "./parentDashboard/ChildAvatarGroup";
import { ParentDashboardTabs } from "@/dataSchema/enums";
import { ChildDetails, User } from "@/dataSchema/types";
import { useAuthStore } from "@/store/auth/authStore";
import shallow from "zustand/shallow";
import { EtherscanLogoCircle } from "@/components/logos/EtherscanLogoCircle";

export const ExpandedDashboardMenu = ({
  familyDetails,
  userDetails,
  children,
  onChangeUsernameOpen,
  onAddChildOpen,
  setSelectedTab,
  onToggleCollapsedMenu,
  onToggleExtendedMenu,
  isOpenExtendedMenu,
  onOpenEtherScan,
}: {
  familyDetails: User;
  userDetails: User;
  children: ChildDetails[];
  onChangeUsernameOpen: () => void;
  onAddChildOpen: () => void;
  setSelectedTab: (tab: ParentDashboardTabs) => void;
  onToggleCollapsedMenu: () => void;
  onToggleExtendedMenu: () => void;
  isOpenExtendedMenu: boolean;
  onOpenEtherScan: () => void;
}) => {
  const { setLogout } = useAuthStore(
    (state) => ({
      setLogout: state.setLogout,
    }),
    shallow
  );

  return (
    <Slide in={!isOpenExtendedMenu} direction="left">
      <Box
        bgGradient={["linear(to-b, black,#4F1B7C)"]}
        // width="12rem"
        // width="25%"
        maxWidth="350px"
        height="96vh"
        ml="1rem"
        mt={5}
        borderRadius="1.5rem"
        style={{
          boxShadow: "0px 0px 10px 15px rgba(0,0,0,0.75)",
        }}
        onClick={() => {
          onToggleExtendedMenu();
          setTimeout(() => {
            onToggleCollapsedMenu();
          }, 500);
        }}
      >
        <Flex direction="column" h="100%" justify="space-between">
          <Box>
            <Flex direction="row" justify="flex-end" align="center">
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
          <Box m={5}>
            <Flex direction="row" justify="flex-end" align="center">
              <Button
                w="100%"
                variant="solid"
                colorScheme="gray"
                onClick={(e) => {
                  e.stopPropagation();
                  setLogout();
                }}
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
                    // style={{ margin: "5px" }}
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
                  setSelectedTab(ParentDashboardTabs.SETTINGS);
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
  );
};

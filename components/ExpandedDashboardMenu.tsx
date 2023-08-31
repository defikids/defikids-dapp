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
}) => {
  return (
    <Slide in={!isOpenExtendedMenu} direction="left">
      <Box
        bgGradient={["linear(to-b, black,#4F1B7C)"]}
        width="25%"
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
                    e.stopPropagation();
                    onAddChildOpen;
                  }}
                  _hover={{ borderColor: "gray" }}
                >
                  Member Profiles
                </Button>
              )}
            </VStack>
          </Box>
          <Box
            m={5}
            //  bgColor="yellow"
          >
            <Flex direction="row" justify="flex-end" align="center">
              <Button w="100%" variant="solid" colorScheme="gray">
                Disconnect
              </Button>

              <IconButton
                mx={5}
                colorScheme="gray"
                aria-label="button"
                size="md"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTab(ParentDashboardTabs.SETTINGS);
                }}
                icon={<QuestionOutlineIcon />}
              />
              <IconButton
                colorScheme="gray"
                aria-label="button"
                size="md"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTab(ParentDashboardTabs.SETTINGS);
                }}
                icon={<SettingsIcon />}
              />
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Slide>
  );
};

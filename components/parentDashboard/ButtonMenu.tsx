import { Button, VStack } from "@chakra-ui/react";
import { ChildDetails } from "@/dataSchema/types";
import { ParentDashboardTabs } from "@/dataSchema/enums";

const ButtonMenu = ({
  onOpen,
  onChangeUsernameOpen,
  onAddChildOpen,
  setSelectedTab,
  children,
}: {
  onOpen: () => void;
  onChangeUsernameOpen: () => void;
  onAddChildOpen: () => void;
  setSelectedTab: (tab: ParentDashboardTabs) => void;
  children?: ChildDetails[];
}) => {
  return (
    <VStack spacing={4} align="stretch" justify="space-between" mt={10} mx={5}>
      {/* <Button
        variant="outline"
        colorScheme="white"
        onClick={onOpen}
        _hover={{ borderColor: "gray" }}
      >
        Change Avatar
      </Button> */}
      {/* <Button
        variant="outline"
        colorScheme="white"
        _hover={{ borderColor: "gray" }}
      >
        Change Background
      </Button> */}
      {/* <Button
        variant="outline"
        colorScheme="white"
        onClick={onChangeUsernameOpen}
        _hover={{ borderColor: "gray" }}
      >
        Change Username
      </Button> */}

      <Button
        variant="outline"
        colorScheme="white"
        _hover={{ borderColor: "gray" }}
        onClick={() => setSelectedTab(ParentDashboardTabs.DASHBOARD)}
      >
        Dashboard
      </Button>
      <Button
        variant="outline"
        colorScheme="white"
        _hover={{ borderColor: "gray" }}
        onClick={() => setSelectedTab(ParentDashboardTabs.SETTINGS)}
      >
        Settings
      </Button>

      <Button
        variant="outline"
        colorScheme="white"
        _hover={{ borderColor: "gray" }}
        onClick={() => setSelectedTab(ParentDashboardTabs.SUPPORT)}
      >
        Support
      </Button>

      {children.length == 0 && (
        <Button
          variant="outline"
          colorScheme="white"
          onClick={() => setSelectedTab(ParentDashboardTabs.MEMBER_PROFILES)}
          _hover={{ borderColor: "gray" }}
        >
          Add Member
        </Button>
      )}
    </VStack>
  );
};

export default ButtonMenu;

import { CardGroup } from "@/components/CardGroup";
import { ParentDashboardTabs } from "@/dataSchema/enums";
import { User } from "@/dataSchema/types";
import { Box, Flex, Heading } from "@chakra-ui/react";

export const Settings = ({
  onOpenAvatar,
  onChangeUsernameOpen,
  familyDetails,
  fetchFamilyDetails,
}: {
  onOpenAvatar: () => void;
  onChangeUsernameOpen: () => void;
  familyDetails: User;
  fetchFamilyDetails: () => void;
}) => {
  const data = [
    {
      title: "Avatar",
      description:
        "Avatars offer a dynamic way to represent yourself in the digital world. They enhance personal identity, allowing creative expression while maintaining privacy.",
      buttonTitle: "Change Avatar",
    },
    {
      title: "Username",
      description:
        "Usernames enhance security by reducing the need for sharing personal information. They play a pivotal role in fostering community, making connections, and building a consistent online presence.",
      buttonTitle: "Change Username",
      action: onChangeUsernameOpen,
    },
    {
      title: "Background",
      description:
        "Backgrounds add a personal touch to your profile. They can be used to express your personality, interests, and hobbies.",
      buttonTitle: "Change Background",
      action: onOpenAvatar,
    },
    {
      title: "Family Id",
      description:
        "Your Family ID is a unique identifier that is used to link your family members together. It is also used to identify your family on the blockchain.",
      buttonTitle: "Change Family Id",
      action: onOpenAvatar,
    },
  ];
  return (
    <Box h="100%" overflowY="scroll">
      <Flex direction="row" justify="center">
        <Heading size="xl" mb="3rem" mt={2}>
          Settings
        </Heading>
      </Flex>
      <Flex direction="column" justify="center" alignContent="center">
        <CardGroup
          data={data}
          columns={2}
          familyDetails={familyDetails}
          fetchFamilyDetails={fetchFamilyDetails}
        />
      </Flex>
    </Box>
  );
};

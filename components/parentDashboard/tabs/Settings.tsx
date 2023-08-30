import { CardGroup } from "@/components/CardGroup";
import { Box, Center, Flex, Heading } from "@chakra-ui/react";
import Head from "next/head";

export const Settings = ({
  onOpenAvatar,
  onChangeUsernameOpen,
}: {
  onOpenAvatar: () => void;
  onChangeUsernameOpen: () => void;
}) => {
  const data = [
    {
      title: "Avatar",
      description:
        "Avatars offer a dynamic way to represent yourself in the digital world. They enhance personal identity, allowing creative expression while maintaining privacy.",
      buttonTitle: "Change Avatar",
      action: onOpenAvatar,
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
    <Box>
      <Heading size="xl" mb="3rem">
        Settings
      </Heading>
      <Flex direction="column" justify="center" alignContent="center">
        <CardGroup data={data} columns={2} />
      </Flex>
    </Box>
  );
};

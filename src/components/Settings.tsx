import { AvatarSelection } from "@/components/AvatarSelection";
import { BackgroundSelection } from "@/components/BackgroundSelection";
import { EditFamilyId } from "@/components/forms/FamilyIdForm";
import { EditUsername } from "@/components/forms/UserNameForm";
import { EditEmail } from "@/components/forms/EmailForm";
import Permissions from "@/app/permissions/page";
import { User } from "@/data-schema/types";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";

export const Settings = ({
  onChangeUsernameOpen,
  familyDetails,
  fetchFamilyDetails,
  onOpenBackgroundDefaults,
  cardOpacity,
  setCardOpacity,
  setBackgroundOpacity,
  isMobileSize,
  isOpenExtendedMenu,
  closeTab,
}: {
  onChangeUsernameOpen: () => void;
  familyDetails: User;
  fetchFamilyDetails: () => void;
  onOpenBackgroundDefaults: () => void;
  cardOpacity: number;
  setCardOpacity: (value: number) => void;
  setBackgroundOpacity: (value: number) => void;
  isMobileSize: boolean;
  isOpenExtendedMenu: boolean;
  closeTab: () => void;
}) => {
  const data = [
    {
      title: "Avatar",
      description:
        "Avatars offer a dynamic way to represent yourself in the digital world. They enhance personal identity, allowing creative expression while maintaining privacy.",
      buttonTitle: "Change Avatar",
    },
    {
      title: "Email",
      description:
        "Your email is used to verify your account and to send you notifications.",
      buttonTitle: "Change Email",
    },
    {
      title: "Family Id",
      description:
        "Your Family ID is a unique identifier that is used to link your family members together. It is also used to identify your family on the blockchain.",
      buttonTitle: "Change Family Id",
    },
    {
      title: "Permissions",
      description:
        "Allows you to control who can view or interact with features.",
      buttonTitle: "Change Permissions",
    },
    {
      title: "Username",
      description:
        "Usernames enhance security by reducing the need for sharing personal information. They play a pivotal role in fostering community, making connections, and building a consistent online presence.",
      buttonTitle: "Change Username",
      action: onChangeUsernameOpen,
    },
    // {
    //   title: "Background",
    //   description:
    //     "Backgrounds add a personal touch to your profile. They can be used to express your personality, interests, and hobbies.",
    //   buttonTitle: "Change Background",
    // },
  ];

  // These are the title labels for the settings
  enum SelectedSetting {
    AVATAR = "Avatar",
    BACKGROUND = "Background",
    USERNAME = "Username",
    FAMILY_ID = "Family Id",
    EMAIL = "Email",
    PERMISSIONS = "Permissions",
  }

  const router = useRouter();

  return (
    <>
      <Container zIndex={2} overflowY="scroll">
        <Flex
          direction="column"
          justify="center"
          alignContent="center"
          my="3rem"
        >
          <Accordion allowToggle>
            {data.map(({ title, description, buttonTitle }) => (
              <AccordionItem key={title}>
                <h2>
                  <AccordionButton borderBottom="1px">
                    <Box as="span" flex="1" textAlign="left">
                      <Heading as="h3" size="md" color="black">
                        {title}
                      </Heading>
                    </Box>
                    <AccordionIcon color="black" />
                  </AccordionButton>
                </h2>
                <AccordionPanel my={5}>
                  {title === SelectedSetting.AVATAR && <AvatarSelection />}

                  {title === SelectedSetting.USERNAME && (
                    <EditUsername
                      familyDetails={familyDetails}
                      fetchFamilyDetails={fetchFamilyDetails}
                    />
                  )}
                  {title === SelectedSetting.FAMILY_ID && (
                    <EditFamilyId
                      familyDetails={familyDetails}
                      fetchFamilyDetails={fetchFamilyDetails}
                    />
                  )}

                  {title === SelectedSetting.BACKGROUND && (
                    <BackgroundSelection
                      familyDetails={familyDetails}
                      fetchFamilyDetails={fetchFamilyDetails}
                      onOpenBackgroundDefaults={onOpenBackgroundDefaults}
                      setBackgroundOpacity={setBackgroundOpacity}
                      setCardOpacity={setCardOpacity}
                    />
                  )}
                  {title === SelectedSetting.EMAIL && (
                    <EditEmail
                      familyDetails={familyDetails}
                      fetchFamilyDetails={fetchFamilyDetails}
                    />
                  )}
                  {title === SelectedSetting.PERMISSIONS && (
                    <>
                      <Text>{description}</Text>
                      <Flex justify="flex-end">
                        <Button
                          colorScheme="blue"
                          size="sm"
                          onClick={() => {
                            router.push("/permissions");
                          }}
                        >
                          {buttonTitle}
                        </Button>
                      </Flex>
                    </>
                  )}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Flex>
      </Container>
    </>
  );
};

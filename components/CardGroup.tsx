"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  IconButton,
} from "@chakra-ui/react";
import CardFlip from "@/styles/CardFlip.module.css";
import { User } from "@/data-schema/types";
import { CloseIcon } from "@chakra-ui/icons";
import { AvatarSelection } from "./AvatarSelection";
import { EditUsername } from "@/components/forms/UserNameForm";
import { EditFamilyId } from "@/components/forms/FamilyIdForm";
import { BackgroundSelection } from "@/components/BackgroundSelection";

interface CardProps {
  title: string;
  description: string;
  buttonTitle?: string;
  image?: string;
  link?: string;
}

// These are the title labels for the settings
enum SelectedSetting {
  AVATAR = "Avatar",
  BACKGROUND = "Background",
  USERNAME = "Username",
  FAMILY_ID = "Family Id",
}

export const CardGroup = ({
  data,
  columns,
  familyDetails,
  fetchFamilyDetails,
  onOpenBackgroundDefaults,
  cardOpacity,
  setCardOpacity,
  setBackgroundOpacity,
}: {
  data: CardProps[];
  columns?: number;
  familyDetails: User;
  fetchFamilyDetails: () => void;
  onOpenBackgroundDefaults: () => void;
  cardOpacity: number;
  setCardOpacity: (value: number) => void;
  setBackgroundOpacity: (value: number) => void;
}) => {
  const handleCardFlip = (e: any, index: string) => {
    e.preventDefault();
    const innerCard = document.getElementById(index);
    if (innerCard.style.transform === "") {
      innerCard.style.transform = "rotateY(180deg)";
    } else {
      innerCard.style.transform = "";
    }
  };

  return (
    <SimpleGrid
      columns={columns || 2}
      spacingX="20px"
      spacingY="20px"
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {data.length &&
        data.map((item, index) => (
          <Card
            key={index}
            className={CardFlip.flipcard}
            opacity={cardOpacity || familyDetails?.opacity?.card || 1}
          >
            <div className={CardFlip.flipcardinner} id={index.toString()}>
              <div className={CardFlip.flipcardfront}>
                {/* FRONT CONTENT */}
                <Card h="100%">
                  <CardHeader>
                    <Heading size="md">{item.title}</Heading>
                  </CardHeader>
                  <CardBody>
                    <Text>{item.description}</Text>
                  </CardBody>
                  <Flex justify="flex-end" pr={3} mb={3}>
                    <Button
                      id={`flipbutton${index}`}
                      onClick={(e) => {
                        handleCardFlip(e, index.toString());
                      }}
                    >
                      Edit
                    </Button>
                  </Flex>
                </Card>
              </div>

              <div className={CardFlip.flipcardback}>
                {/* BACK CONTENT */}
                <Card h="100%">
                  <CardHeader>
                    <Flex justify="space-between" align="center">
                      <Heading size="md">{item.title}</Heading>
                      <IconButton
                        colorScheme="gray"
                        aria-label="Call Segun"
                        size="md"
                        id={`flipbutton${index}`}
                        onClick={(e) => {
                          handleCardFlip(e, index.toString());
                        }}
                        icon={<CloseIcon />}
                      />
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    {item.title === SelectedSetting.AVATAR && (
                      <AvatarSelection
                        familyDetails={familyDetails}
                        fetchFamilyDetails={fetchFamilyDetails}
                      />
                    )}

                    {item.title === SelectedSetting.USERNAME && (
                      <EditUsername
                        familyDetails={familyDetails}
                        fetchFamilyDetails={fetchFamilyDetails}
                      />
                    )}
                    {item.title === SelectedSetting.FAMILY_ID && (
                      <EditFamilyId
                        familyDetails={familyDetails}
                        fetchFamilyDetails={fetchFamilyDetails}
                      />
                    )}

                    {item.title === SelectedSetting.BACKGROUND && (
                      <BackgroundSelection
                        familyDetails={familyDetails}
                        fetchFamilyDetails={fetchFamilyDetails}
                        onOpenBackgroundDefaults={onOpenBackgroundDefaults}
                        setBackgroundOpacity={setBackgroundOpacity}
                        setCardOpacity={setCardOpacity}
                      />
                    )}
                  </CardBody>
                </Card>
              </div>
            </div>
          </Card>
        ))}
    </SimpleGrid>
  );
};

import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  Avatar,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import CardFlip from "@/styles/CardFlip.module.css";
import { ParentDashboardTabs } from "@/dataSchema/enums";
import { useState } from "react";
// import Avatar from "@/components/parentDashboard/Avatar";
import { User } from "@/dataSchema/types";
import { CloseIcon } from "@chakra-ui/icons";
import { AvatarSelection } from "./AvatarSelection";
import { EditUsername } from "@/components/forms/UserNameForm";
import { EditFamilyId } from "@/components/forms/FamilyIdForm";

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
}: {
  data: CardProps[];
  columns?: number;
  familyDetails: User;
  fetchFamilyDetails: () => void;
}) => {
  const isMobileSize = useBreakpointValue({
    base: true,
    sm: false,
    md: false,
    lg: false,
  });

  const handleCardFlip = (e: any, index: string) => {
    console.log(e);
    console.log(index);
    e.preventDefault();
    const innerCard = document.getElementById(index);
    // const flipbutton = document.getElementById("flipbutton" + index);
    if (innerCard.style.transform === "") {
      //   flipbutton.innerHTML = "Continue";
      innerCard.style.transform = "rotateY(180deg)";
    } else {
      innerCard.style.transform = "";
      //   flipbutton.innerHTML = <CloseIcon />;
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
          <Card key={index} className={CardFlip.flipcard}>
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
                  <Flex justify="flex-end" pr={5} my={2}>
                    <Button
                      id={`flipbutton${index}`}
                      onClick={(e) => {
                        handleCardFlip(e, index.toString());
                      }}
                    >
                      Change
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
                  </CardBody>
                </Card>
              </div>
            </div>
          </Card>
        ))}
    </SimpleGrid>
  );
};

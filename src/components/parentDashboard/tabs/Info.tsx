import {
  Card,
  CardBody,
  CardHeader,
  CloseButton,
  Container,
  Flex,
  Grid,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { menuCards } from "@/data/landingPage/menuCards";
import { NextRouter, useRouter } from "next/router";

const CustomCard = ({
  title,
  description,
  link,
  router,
  setShowLearnMore,
  showLearnMore,
  index,
  closeTab,
}: {
  title: string;
  description: string;
  link: string;
  router: NextRouter;
  setShowLearnMore: (value: { [key: number]: boolean }) => void;
  showLearnMore: { [key: number]: boolean };
  index: number;
  closeTab: () => void;
}) => (
  <Card
    style={{
      minHeight: "200px",
      backgroundColor: "#4F1B7C",
      position: "relative",
      overflow: "hidden",
      cursor: "pointer",
      border: showLearnMore[index]
        ? "2px solid white"
        : "2px solid transparent",
    }}
    onClick={() => {
      closeTab();
      router.push(link);
    }}
    onMouseEnter={() => setShowLearnMore({ ...showLearnMore, [index]: true })}
    onMouseLeave={() => setShowLearnMore({ ...showLearnMore, [index]: false })}
  >
    <CardHeader>
      <Heading size="md">{title}</Heading>
    </CardHeader>
    <CardBody>
      <Text>{description}</Text>
    </CardBody>
  </Card>
);

export const Info = ({
  isMobileSize,
  isOpenExtendedMenu,
  closeTab,
}: {
  isMobileSize: boolean;
  isOpenExtendedMenu: boolean;
  closeTab: () => void;
}) => {
  //=============================================================================
  //                             STATE
  //=============================================================================

  const [showLearnMore, setShowLearnMore] = useState<{
    [key: number]: boolean;
  }>({
    0: false,
    1: false,
    2: false,
    3: false,
  });

  //=============================================================================
  //                             HOOKS
  //=============================================================================

  const router = useRouter();
  return (
    <>
      <Container
        size={isMobileSize ? "xl" : "3xl"}
        overflowY="scroll"
        bgColor="#121212"
        borderRadius={isMobileSize && isOpenExtendedMenu ? "0px" : "20px"}
      >
        <Flex justify="flex-end" mt={3} onClick={closeTab}>
          <CloseButton />
        </Flex>

        <Flex direction="row" justify="center">
          <Heading size="2xl" my="2rem">
            Information
          </Heading>
        </Flex>

        <Flex direction="column" justify="center" alignContent="center" mb={5}>
          <Grid
            my={4}
            templateColumns={isMobileSize ? "1fr" : "repeat(2, 1fr)"}
            gap="2rem"
            justifyContent="center"
          >
            {menuCards.map((card, i) => (
              <CustomCard
                key={i}
                title={card.title}
                description={card.description}
                link={card.link}
                router={router}
                setShowLearnMore={setShowLearnMore}
                showLearnMore={showLearnMore}
                index={i}
                closeTab={closeTab}
              />
            ))}
          </Grid>
        </Flex>
      </Container>
    </>
  );
};

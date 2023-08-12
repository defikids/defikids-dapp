import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  Flex,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { NextRouter, useRouter } from "next/router";
import { menuCards } from "@/data/landingPage/menuCards";
import { useState } from "react";

const CustomCard = ({
  title,
  description,
  link,
  router,
  setShowLearnMore,
  showLearnMore,
  index,
  setMenuOpen,
}: {
  title: string;
  description: string;
  link: string;
  router: NextRouter;
  setShowLearnMore: (value: { [key: number]: boolean }) => void;
  showLearnMore: { [key: number]: boolean };
  index: number;
  setMenuOpen: (value: boolean) => void;
}) => (
  <Card
    mx={2}
    mb={2}
    style={{
      backgroundColor: "#4F1B7C",
      position: "relative",
      overflow: "hidden",
      cursor: "pointer",
      border: showLearnMore[index]
        ? "2px solid white"
        : "2px solid transparent",
    }}
    onClick={() => {
      setMenuOpen(false);
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

export const MenuPopover = ({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
}) => {
  //=============================================================================
  //                             HOOKS
  //=============================================================================

  const router = useRouter();
  const isMobileSize = useBreakpointValue({
    base: true,
    sm: false,
    md: false,
    lg: false,
  });

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

  return (
    <Popover
      isOpen={menuOpen}
      onClose={() => setMenuOpen(false)}
      closeOnBlur={true}
    >
      <PopoverContent
        color="black"
        top="5.5rem"
        mb={10}
        w="100vw"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.70)",
          border: "none",
        }}
      >
        <PopoverBody mt={2} w="100vw">
          <Flex
            direction={isMobileSize ? "column" : "row"}
            align="space-evenly"
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
                setMenuOpen={setMenuOpen}
              />
            ))}
          </Flex>
        </PopoverBody>

        <PopoverArrow bg="white" />
      </PopoverContent>
    </Popover>
  );
};

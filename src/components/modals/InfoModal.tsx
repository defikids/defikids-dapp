"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useBreakpointValue,
  CardHeader,
  Heading,
  CardBody,
  Text,
  Card,
  Grid,
} from "@chakra-ui/react";
import { menuCards } from "@/data/landingPage/menuCards";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CustomCard = ({
  title,
  description,
  link,
  router,
  setShowLearnMore,
  showLearnMore,
  index,
  onClose,
}: {
  title: string;
  description: string;
  link: string;
  router: any;
  setShowLearnMore: (value: { [key: number]: boolean }) => void;
  showLearnMore: { [key: number]: boolean };
  index: number;
  onClose: () => void;
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
      onClose();
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

const InfoModal = ({ isOpen, onClose }) => {
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

  const isMobileSize = useBreakpointValue({
    base: true,
    sm: false,
    md: false,
    lg: false,
  });

  const router = useRouter();
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader />
        <ModalCloseButton />
        <ModalBody>
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
                onClose={onClose}
              />
            ))}
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InfoModal;

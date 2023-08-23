import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Card,
  Image,
  Stack,
  CardBody,
  Heading,
  Text,
  CardFooter,
  Button,
  ModalFooter,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { RegisterParentForm } from "@/components/forms/RegisterParentForm";

const RegisterModal = ({ isOpen, onClose }) => {
  const [isStarted, setIsStarted] = useState(false);

  const isMobileSize = useBreakpointValue({
    base: true,
    sm: false,
    md: false,
    lg: false,
  });

  const welcomeMessage = () => {
    return (
      <Card
        direction={isMobileSize ? "column" : "row"}
        overflow="hidden"
        variant="outline"
        bg="white"
      >
        <Image
          objectFit="cover"
          maxW={{ base: "100%", sm: "300px" }}
          src="/images/kids-on-computers.png"
          alt="kids-on-computers"
        />

        <Stack>
          <CardBody>
            <Heading size="md" color="#82add9">
              Welcome to DefiKids
            </Heading>

            <Text py="2" color="#82add9">
              Register to access the DefiKids platform. A transaction will be
              required to store a family record that is associated with this
              connected wallet on the blockchain.
            </Text>
          </CardBody>

          <CardFooter>
            <Button
              variant="solid"
              colorScheme="blue"
              onClick={() => setIsStarted(true)}
              w="100%"
            >
              Get Started
            </Button>
          </CardFooter>
        </Stack>
      </Card>
    );
  };

  const register = () => {
    return <RegisterParentForm onClose={onClose} />;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onCloseComplete={() => setIsStarted(false)}
      size={!isMobileSize ? (isStarted ? "md" : "6xl") : "md"}
      isCentered
      closeOnOverlayClick={false}
    >
      <ModalOverlay
        bg="none"
        backdropFilter="auto"
        backdropInvert="10%"
        backdropBlur="4px"
      />
      <ModalContent>
        <ModalHeader>Register</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{!isStarted ? welcomeMessage() : register()}</ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

export default RegisterModal;

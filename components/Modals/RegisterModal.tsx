import HostContract from "@/services/contract";
import { useAuthStore } from "@/store/auth/authStore";
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
  useToast,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import shallow from "zustand/shallow";
import Sequence from "@/services/sequence";
import { useState } from "react";

const RegisterModal = ({ isOpen, onClose }) => {
  const router = useRouter();
  const toast = useToast();

  const [familyId, setFamilyId] = useState("");
  const [avatarURI, setAvatarURI] = useState("");
  const [username, setUsername] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const { walletAddress } = useAuthStore(
    (state) => ({
      walletAddress: state.walletAddress,
    }),
    shallow
  );

  const isIdError = familyId === "";

  const handleParent = async () => {
    try {
      setHasSubmitted(true);

      if (isIdError) {
        return;
      }

      const signer = Sequence.wallet?.getSigner();
      const contract = await HostContract.fromProvider(signer, walletAddress);
      const hash = await contract.hashFamilyId(walletAddress, familyId);
      const avatarURI = "";
      await contract.registerParent(hash, avatarURI, username);
      localStorage.setItem("defi-kids.family-id", familyId);
      router.push("/parent");
      onClose();
    } catch (e) {
      console.log(e);
      if (e.code === 4001) {
        toast({
          title: "Transaction Error",
          description: "User rejected transaction",
          status: "error",
        });
        return;
      }
      toast({
        title: "Error",
        description: "Network error",
        status: "error",
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
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
        <ModalBody>
          <Card
            direction={{ base: "column", sm: "row" }}
            overflow="hidden"
            variant="outline"
            bg="white"
            pb={3}
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
                  Register to access the DefiKids platform. A transaction will
                  be required to store a family record that is associated with
                  this connected wallet on the blockchain.
                </Text>

                {/* Family Id */}
                <FormControl isInvalid={isIdError && hasSubmitted}>
                  <FormLabel mt={3} color="black">{`Your username`}</FormLabel>
                  <Input
                    type="text"
                    color="black"
                    placeholder="Create a family id."
                    value={familyId}
                    onChange={(e) => setFamilyId(e.target.value)}
                    borderColor={
                      isIdError && hasSubmitted ? "red.500" : "black"
                    }
                    _hover={{
                      borderColor: "gray.300",
                    }}
                    _focus={{
                      borderColor: "blue.500",
                    }}
                  />
                  {isIdError && hasSubmitted && (
                    <FormErrorMessage color="red.500">
                      Family Id is required.
                    </FormErrorMessage>
                  )}
                </FormControl>

                {/* Avatar URI*/}
                <FormControl>
                  <FormLabel
                    mt={3}
                    color="black"
                  >{`Your profile image (optional)`}</FormLabel>
                  <Input
                    type="text"
                    color="black"
                    placeholder="Provide image url."
                    value={avatarURI}
                    onChange={(e) => setAvatarURI(e.target.value)}
                    borderColor="black"
                    _hover={{
                      borderColor: "gray.300",
                    }}
                    _focus={{
                      borderColor: "blue.500",
                    }}
                  />
                </FormControl>

                {/* Username*/}
                <FormControl>
                  <FormLabel mt={3} color="black">
                    Username
                  </FormLabel>
                  <Input
                    type="text"
                    color="black"
                    placeholder="Provide username."
                    value={avatarURI}
                    onChange={(e) => setUsername(e.target.value)}
                    borderColor="black"
                    _hover={{
                      borderColor: "gray.300",
                    }}
                    _focus={{
                      borderColor: "blue.500",
                    }}
                  />
                </FormControl>
              </CardBody>

              <CardFooter>
                <Button
                  variant="solid"
                  colorScheme="blue"
                  onClick={handleParent}
                  w="100%"
                >
                  Register as a parent
                </Button>
              </CardFooter>
            </Stack>
          </Card>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default RegisterModal;

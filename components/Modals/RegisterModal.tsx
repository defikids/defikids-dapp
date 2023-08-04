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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import shallow from "zustand/shallow";
import Sequence from "@/services/sequence";

const RegisterModal = ({ isOpen, onClose }) => {
  const router = useRouter();

  const { walletAddress } = useAuthStore(
    (state) => ({
      walletAddress: state.walletAddress,
    }),
    shallow
  );

  const handleParent = async () => {
    try {
      const signer = Sequence.wallet?.getSigner();
      const contract = await HostContract.fromProvider(signer, walletAddress);
      await contract.registerParent();
      router.push("/parent");
      onClose();
    } catch (e) {
      console.log(e);
      if (e.code === 4001) {
        toast.error("User rejected transaction");
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Register</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Card
            direction={{ base: "column", sm: "row" }}
            overflow="hidden"
            variant="outline"
          >
            <Image
              objectFit="cover"
              maxW={{ base: "100%", sm: "300px" }}
              src="/images/kids-on-computers.png"
              alt="Caffe Latte"
            />

            <Stack>
              <CardBody>
                <Heading size="md">Welcome to DefiKids</Heading>

                <Text py="2">
                  We require confirmation that you are a parent. This will allow
                  you to access the DefiKids platform. A transaction will be
                  required to store your user type on the blockchain.
                </Text>
              </CardBody>

              <CardFooter>
                <Button
                  variant="solid"
                  colorScheme="blue"
                  onClick={handleParent}
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

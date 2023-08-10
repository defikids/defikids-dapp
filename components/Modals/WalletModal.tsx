import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Card,
  Stack,
} from "@chakra-ui/react";
import { WalletDetails } from "@/components/WalletMenuBar";
import { UserType } from "@/services/contract";
import { OpenWalletIntent, Settings } from "@0xsequence/provider";
import Sequence from "@/services/sequence";
import { useAuthStore } from "@/store/auth/authStore";
import shallow from "zustand/shallow";

const WalletModal = ({ isOpen, onClose }) => {
  const { walletAddress, setIsLoggedIn, setUserType, setWalletAddress } =
    useAuthStore(
      (state) => ({
        walletAddress: state.walletAddress,
        isLoggedIn: state.isLoggedIn,
        setIsLoggedIn: state.setIsLoggedIn,
        setUserType: state.setUserType,
        setWalletAddress: state.setWalletAddress,
      }),
      shallow
    );

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================
  const openWalletWithSettings = () => {
    const wallet = Sequence.wallet;

    const settings: Settings = {
      theme: "dark",
      includedPaymentProviders: ["moonpay", "ramp", "wyre"],
      defaultFundingCurrency: "eth",
      signInOptions: ["email", "google", "apple", "discord", "facebook"],
    };

    const intent: OpenWalletIntent = {
      type: "openWithOptions",
      options: {
        app: "DefiKids",
        settings,
      },
    };

    const path = "wallet";
    wallet.openWallet(path, intent);
  };

  const handleLogoutClick = () => {
    onClose();
    Sequence.wallet?.disconnect();

    //update user state
    setUserType(UserType.UNREGISTERED);
    setWalletAddress("");
    setIsLoggedIn(false);
    window.location.replace("/");
  };

  const openWalletOnBlockchain = () => {
    const chain = Sequence.wallet.getChainId();
    if (chain === 137) {
      window.open(
        ` https://polygonscan.com/address//${walletAddress}`,
        "_blank"
      );
    } else if (chain === 80001) {
      window.open(
        ` https://mumbai.polygonscan.com/address/${walletAddress}`,
        "_blank"
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      isCentered
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader />
        <ModalCloseButton />
        <ModalBody>
          <Card overflow="hidden" variant="outline" bg="white" pb={3}>
            <WalletDetails />
          </Card>
        </ModalBody>

        <Stack direction="column" spacing={2} align="center">
          <Button
            w="90%"
            size="md"
            variant="solid"
            colorScheme="blue"
            cursor="pointer"
            onClick={openWalletOnBlockchain}
          >
            Transactions
          </Button>
          <Button
            w="90%"
            size="md"
            variant="solid"
            colorScheme="blue"
            cursor="pointer"
            onClick={openWalletWithSettings}
          >
            Open Wallet
          </Button>
          <Button
            w="90%"
            mb={2}
            size="md"
            variant="solid"
            color="red.500"
            cursor="pointer"
            onClick={handleLogoutClick}
          >
            Disconnect Wallet
          </Button>
        </Stack>
      </ModalContent>
    </Modal>
  );
};

export default WalletModal;

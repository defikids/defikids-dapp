import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";
import Sequence from "@/services/sequence";
import { UserType } from "@/services/contract";
import { OpenWalletIntent, Settings } from "@0xsequence/provider";
import { Badge, Stack, useColorMode } from "@chakra-ui/react";

const WalletNavbar: React.FC = () => {
  const { colorMode } = useColorMode();

  const { setIsLoggedIn, setUserType, setWalletAddress } = useAuthStore(
    (state) => ({
      isLoggedIn: state.isLoggedIn,
      setIsLoggedIn: state.setIsLoggedIn,
      setUserType: state.setUserType,
      setWalletAddress: state.setWalletAddress,
    }),
    shallow
  );

  const openWalletWithSettings = () => {
    const wallet = Sequence.wallet;

    const settings: Settings = {
      theme: colorMode,
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
    Sequence.wallet?.disconnect();

    //update user state
    setUserType(UserType.UNREGISTERED);
    setWalletAddress("");
    setIsLoggedIn(false);
    window.location.replace("/");
  };

  const handleSelectOption = (option: string) => {
    if (option === "Open Wallet" && Sequence.wallet?.isConnected) {
      openWalletWithSettings();
      return;
    }
    handleLogoutClick();
  };

  return (
    <Stack direction="row" justifyContent="flex-end">
      <Badge
        variant="subtle"
        colorScheme="blue"
        cursor="pointer"
        px={3}
        onClick={() => handleSelectOption("Open Wallet")}
        style={{ borderRadius: "10px" }}
      >
        Open Wallet
      </Badge>

      <Badge
        variant="subtle"
        colorScheme="blue"
        cursor="pointer"
        px={3}
        onClick={() => handleSelectOption("Disconnect")}
        style={{ borderRadius: "10px" }}
      >
        Disconnect Wallet
      </Badge>
    </Stack>
  );
};

export default WalletNavbar;

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

  const closeWallet = () => {
    const wallet = Sequence.wallet;
    wallet.closeWallet();
  };

  const handleLogoutClick = () => {
    Sequence.wallet?.disconnect();

    setUserType(UserType.UNREGISTERED);
    setWalletAddress("");
    setIsLoggedIn(false);
    window.location.replace("/");
  };

  const options = ["Open Wallet", "Close Wallet", "Disconnect"];

  const handleSelectOption = (option: string) => {
    console.log(option);

    switch (option) {
      case "Open Wallet":
        openWalletWithSettings();
        break;
      case "Close Wallet":
        closeWallet();
        break;
      case "Disconnect":
        handleLogoutClick();

        break;

      default:
        handleLogoutClick();
        break;
    }
  };

  return (
    <Stack direction="row" justifyContent={"flex-end"} pr={8}>
      {options.map((option, index) => (
        <Badge
          variant="subtle"
          colorScheme="blue"
          key={index}
          style={{ cursor: "pointer" }}
          onClick={() => handleSelectOption(option)}
        >
          {option}
        </Badge>
      ))}
    </Stack>
  );
};

export default WalletNavbar;

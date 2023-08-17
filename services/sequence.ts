import { sequence } from "0xsequence";
import { ChainId } from "@0xsequence/network";
import { ConnectOptions } from "@0xsequence/provider";
import HostContract from "./contract";

type ConnectedUser = {
  success: boolean;
  userType?: number;
  address?: string;
};

const defaultChainId = ChainId.POLYGON_MUMBAI;

sequence.initWallet({ defaultNetwork: defaultChainId });
const wallet = sequence.getWallet().getProvider();

const getUserType = async (connectDetails: any) => {
  const { session } = connectDetails;
  const { accountAddress } = session;
  const signer = wallet.getSigner();

  const contract = await HostContract.fromProvider(signer, accountAddress);
  const userType = await contract.getUserType(accountAddress);
  return userType;
};

const connectWallet = async (authorize: boolean = false) => {
  const defaultConnectOptions: ConnectOptions = {
    app: "Defi Kids",
    askForEmail: true,
  };

  let connectOptions = {
    app: "Defi Kids",
    askForEmail: true,
    authorize,
  } as ConnectOptions;

  connectOptions = {
    ...defaultConnectOptions,
    ...connectOptions,
    settings: {
      ...defaultConnectOptions.settings,
      ...connectOptions.settings,
      theme: "light",
      signInOptions: [
        "email",
        "google",
        "apple",
        "discord",
        "facebook",
        "twitch",
      ],
    },
  };

  try {
    const wallet = sequence.getWallet();
    const connectDetails = await wallet.connect(connectOptions);

    if (connectDetails.connected) {
      const { session } = connectDetails;
      const { accountAddress } = session;

      const userType = await getUserType(connectDetails);

      return { success: true, userType, accountAddress } as ConnectedUser;
    } else {
      return { success: false } as ConnectedUser;
    }
  } catch (e) {
    console.error(e);
  }
};

export default { connectWallet, wallet };

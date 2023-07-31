import { sequence } from "0xsequence";
import { ChainId } from "@0xsequence/network";
import { ConnectOptions } from "@0xsequence/provider";
import { ethers } from "ethers";
import HostContract from "./contract";

type ConnectedUser = {
  success: boolean;
  userType?: number;
  address?: string;
};

const defaultChainId = ChainId.POLYGON_MUMBAI;

sequence.initWallet({ defaultNetwork: defaultChainId });
const wallet = sequence.getWallet().getProvider();

const getUserType = async (connectDetails: any, chainId: any) => {
  const rpcUrl = connectDetails.networks.find(
    (n) => n.chainId === Number(chainId)
  ).rpcUrl;

  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

  const address = connectDetails.accountAddress;
  const contract = await HostContract.fromProvider(provider, address);
  const userType = await contract.getUserType();
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
    },
  };

  try {
    const wallet = sequence.getWallet();
    const connectDetails = await wallet.connect(connectOptions);

    if (connectDetails.connected) {
      const chainId = connectDetails.chainId;

      const address = connectDetails.session.accountAddress;

      const userType = await getUserType(connectDetails.session, chainId);

      return { success: true, userType, address } as ConnectedUser;
    } else {
      return { success: false } as ConnectedUser;
    }
  } catch (e) {
    console.error(e);
  }
};

export default { connectWallet, wallet, getUserType };

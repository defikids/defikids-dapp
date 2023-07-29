import { sequence } from "0xsequence";
import { ChainId } from "@0xsequence/network";
import { ConnectOptions } from "@0xsequence/provider";
import { ETHAuth } from "@0xsequence/ethauth";
import { ethers } from "ethers";
import HostContract from "./contract";

const defaultChainId = ChainId.POLYGON_MUMBAI;
const DEFAULT_API_URL = "https://api.sequence.app";

sequence.initWallet({ defaultNetwork: defaultChainId });
const wallet = sequence.getWallet().getProvider();

const defaultConnectOptions: ConnectOptions = {
  app: "Defi Kids",
  askForEmail: true,
};

const appendConsoleLine = (message: string, clear = false) => {
  console.log(message);
};

const connectWallet = async (authorize: boolean = false) => {
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
    appendConsoleLine("Connecting");
    const wallet = sequence.getWallet();

    const connectDetails = await wallet.connect(connectOptions);

    // Example of how to verify using ETHAuth via Sequence API
    if (connectOptions.authorize) {
      let apiUrl = DEFAULT_API_URL;

      const api = new sequence.api.SequenceAPIClient(apiUrl);

      const { isValid } = await api.isValidETHAuthProof({
        chainId: connectDetails.chainId,
        walletAddress: connectDetails.session.accountAddress,
        ethAuthProofString: connectDetails.proof!.proofString,
      });

      appendConsoleLine(`isValid (API)?: ${isValid}`);
    }

    // Example of how to verify using ETHAuth directl on the client
    if (connectOptions.authorize) {
      const ethAuth = new ETHAuth();

      if (connectDetails.proof) {
        const decodedProof = await ethAuth.decodeProof(
          connectDetails.proof.proofString,
          true
        );

        const isValid = await wallet.utils.isValidTypedDataSignature(
          wallet.getAddress(),
          connectDetails.proof.typedData,
          decodedProof.signature,
          ethers.BigNumber.from(connectDetails.chainId).toNumber()
        );

        appendConsoleLine(
          `connected using chainId: ${ethers.BigNumber.from(
            connectDetails.chainId
          ).toString()}`
        );
        appendConsoleLine(`isValid (client)?: ${isValid}`);
      }
    }

    if (connectDetails.connected) {
      const chainId = connectDetails.chainId;
      const rpcUrl = connectDetails.session.networks.find(
        (n) => n.chainId === Number(chainId)
      ).rpcUrl;

      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

      localStorage.setItem("@defikids.isLoggedIn", "true");

      const address = connectDetails.session.accountAddress;
      const contract = await HostContract.fromProvider(provider, address);
      const userType = await contract.getUserType();

      localStorage.setItem("@defikids.userType", userType.toString());

      appendConsoleLine("Wallet connected!");
      appendConsoleLine(`shared email: ${connectDetails.email}`);
      return true;
    } else {
      appendConsoleLine("Failed to connect wallet - " + connectDetails.error);
      return false;
    }
  } catch (e) {
    console.error(e);
  }
};

export default { connectWallet, wallet };

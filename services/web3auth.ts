import { Web3Auth } from "@web3auth/web3auth";
import {
  ADAPTER_STATUS,
  CHAIN_NAMESPACES,
  CONNECTED_EVENT_DATA,
  CustomChainConfig,
} from "@web3auth/base";
import { ADAPTER_EVENTS } from "@web3auth/base";
import { LOGIN_MODAL_EVENTS } from "@web3auth/ui";
import { ethers } from "ethers";

function subscribeAuthEvents(
  web3auth: Web3Auth,
  onLogin: (data: CONNECTED_EVENT_DATA) => void,
  onLogout: () => void
) {
  web3auth.on(ADAPTER_EVENTS.CONNECTED, onLogin);

  web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
    console.log("connecting");
  });

  web3auth.on(ADAPTER_EVENTS.DISCONNECTED, onLogout);

  web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
    console.log("some error or user have cancelled login request", error);
  });

  web3auth.on(LOGIN_MODAL_EVENTS.MODAL_VISIBILITY, (isVisible) => {
    console.log("modal visibility", isVisible);
  });
}

// const polygonMumbaiConfig: CustomChainConfig = {
//   chainNamespace: CHAIN_NAMESPACES.EIP155,
//   rpcTarget:
//     "https://polygon-mumbai.g.alchemy.com/v2/ZAX72ViWMKnFEGQDlo6K_X333b1teboA",
//   blockExplorer: "https://mumbai-explorer.matic.today",
//   chainId: "0x13881",
//   displayName: "Polygon Mumbai Testnet",
//   ticker: "matic",
//   tickerName: "matic",
// };

const id =
  "BP1JhQo3c-qAvGrNsSrETm-Q1sirqRQiKK8Aau-MQVl_PwzHIc3xR3ubmDrzW_764PW8rY2zMO9jX9Nz3kC4agM";
const web3auth = new Web3Auth({
  //   clientId: process.env.WEB3AUTH_CLIENT_ID, // Get your Client ID from Web3Auth Dashboard
  clientId: id,
  chainConfig: {
    chainNamespace: "eip155",
    chainId: "0x5", // Please use 0x5 for Goerli Testnet
    rpcTarget: "https://rpc.ankr.com/eth",
  },
});

export const initializeModal = async (
  onLogin: (data: CONNECTED_EVENT_DATA) => void,
  onLogout: () => void
) => {
  subscribeAuthEvents(web3auth, onLogin, onLogout);
  try {
    await web3auth.initModal();
  } catch {}
};

export function connect() {
  return web3auth.connect();
}

export function getUserInfo() {
  return web3auth.getUserInfo();
}

export function logout() {
  if (web3auth.status === ADAPTER_STATUS.CONNECTED) {
    return web3auth.logout({ cleanup: true });
  }
}

export async function getSigner() {
  const web3authProvider = await web3auth.connect();
  const provider = new ethers.providers.Web3Provider(web3authProvider);
  const signer = await provider.getSigner();
  return signer;
}

export default {
  initializeModal,
  connect,
  getUserInfo,
  logout,
  getSigner,
  web3auth,
};

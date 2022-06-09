import { Web3Auth } from "@web3auth/web3auth";
import {
  ADAPTER_STATUS,
  CHAIN_NAMESPACES,
  CONNECTED_EVENT_DATA,
  CustomChainConfig,
} from "@web3auth/base";
import { ADAPTER_EVENTS } from "@web3auth/base";
import { LOGIN_MODAL_EVENTS } from "@web3auth/ui";

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

const polygonMumbaiConfig: CustomChainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  rpcTarget:
    "https://polygon-mumbai.g.alchemy.com/v2/ZAX72ViWMKnFEGQDlo6K_X333b1teboA",
  blockExplorer: "https://mumbai-explorer.matic.today",
  chainId: "0x13881",
  displayName: "Polygon Mumbai Testnet",
  ticker: "matic",
  tickerName: "matic",
};

const web3auth = new Web3Auth({
  chainConfig: polygonMumbaiConfig,
  clientId: `BHsKjc_cnKkg3LS_k1ydp3k4faZag2_5QTUCmhHBZGhixhk5IZRzR-zUeinmgpuKjGH8aJ2t_mG_4A7y5AhjONI`,
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

export default { initializeModal, connect, getUserInfo, logout, web3auth };

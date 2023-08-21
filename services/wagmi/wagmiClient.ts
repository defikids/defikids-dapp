import { infuraProvider } from "@wagmi/core/providers/infura";
import { configureChains, mainnet, goerli } from "@wagmi/core";
import { createClient } from "wagmi";
import { publicProvider } from "@wagmi/core/providers/public";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { trustWallet } from "@rainbow-me/rainbowkit/wallets";
import { rainbowWallet } from "@rainbow-me/rainbowkit/wallets";
import { coinbaseWallet } from "@rainbow-me/rainbowkit/wallets";
import { walletConnectWallet } from "@rainbow-me/rainbowkit/wallets";

const infuraApiKey = process.env.NEXT_PUBLIC_INFURA_API_KEY_GOERLI;
const projectId = process.env.NEXT_PUBLIC_RAINBOW_PROJECT_ID;

// This is used to interact with a local node
const localhostChain = {
  name: "localhost",
  network: "localhost",
  id: 1337,
  nativeCurrency: {
    name: "LocalETH",
    symbol: "LETH",
    decimals: 18,
  },
  testnet: true,
  rpcUrls: {
    default: { http: ["http://localhost:8545"] },
    public: { http: ["http://localhost:8545"] },
  },
};

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, goerli, localhostChain],
  [
    infuraProvider({ apiKey: infuraApiKey } as {
      apiKey: string;
    }),
    publicProvider(),
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: "Popular",
    wallets: [
      metaMaskWallet({
        projectId,
        chains,
      }),
      trustWallet({
        projectId,
        chains,
      }),
      rainbowWallet({ projectId, chains }),
      coinbaseWallet({
        appName: "Web3",
        chains,
      }),
      walletConnectWallet({ projectId, chains }),
    ],
  },
]);
export { chains };

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { polygonMumbai, polygon } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

const { chains, publicClient } = configureChains(
  [polygonMumbai, polygon],
  [alchemyProvider({ apiKey: alchemyApiKey }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "DefiKids",
  projectId: projectId,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
});

export { chains, wagmiConfig };

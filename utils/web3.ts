import { ethers } from "ethers";

// wei to eth
export const weiToEth = (wei: string) => {
  return ethers.utils.formatEther(wei);
};

export const trimAddress = (address: string) => {
  const addr = address
    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    : "";

  return addr;
};

export const getRPCUrl = (chainId: number) => {
  let rpcUrl = "";
  switch (chainId) {
    case 1:
      rpcUrl = `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_MAINNET_RPC}`;
      break;
    case 5:
      rpcUrl = `https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_GOERLI_RPC}`;
      break;
    default:
      rpcUrl = `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_MAINNET_RPC}`;
      break;
  }

  return rpcUrl;
};

export const getEtherscanUrl = (
  chainId: number,
  context: string,
  id: string
) => {
  let etherscanUrl = "";
  switch (chainId) {
    case 1:
      etherscanUrl = `https://etherscan.io/${context}/${id}`;
      break;
    case 5:
      etherscanUrl = `https://goerli.etherscan.io/${context}/${id}`;
      break;
    default:
      etherscanUrl = `https://etherscan.io/${context}/${id}`;
      break;
  }

  return etherscanUrl;
};

import { watchAccount, watchNetwork } from "@wagmi/core";
import { useState } from "react";
import { useAccount, useNetwork } from "wagmi";

type Web3User = {
  address: undefined | string;
  isConnected: boolean;
  isConnecting: boolean;
  blockchainId?: number;
  id?: string;
};

export function useWeb3User(): Web3User {
  const { address, isConnecting, isConnected } = useAccount();
  const { chain } = useNetwork();
  const [web3User, setWeb3User] = useState<Web3User>({
    address,
    isConnected,
    isConnecting,
  });
  const [blockchainId, setBlockchainId] = useState<number | undefined>(
    chain?.id
  );

  watchAccount(async ({ address, isConnected, isConnecting }) => {
    setWeb3User({ ...web3User, address, isConnected, isConnecting });
  });

  watchNetwork(({ chain }) => {
    setBlockchainId(chain?.id);
  });

  return { ...web3User, blockchainId };
}

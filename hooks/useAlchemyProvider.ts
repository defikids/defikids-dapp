import { useEffect, useState } from "react";
import { ethers } from "ethers";

export const useAlchemyProvider = (blockchainId: number): any => {
  const [provider, setProvider] = useState(null) as any;
  const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
  console.log("alchemyApiKey", alchemyApiKey);
  const networkName = blockchainId === 137 ? "polygon" : "maticmum";

  useEffect(() => {
    const AlchemyProvider = new ethers.providers.AlchemyProvider(
      "maticmum",
      process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
    );
  }, [alchemyApiKey, networkName]);

  return provider;
};

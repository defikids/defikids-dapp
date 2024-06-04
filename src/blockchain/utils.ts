import { ethers } from "ethers";

export const connectedSigner = async (provider: any) => {
  const signer = await provider.getSigner();
  return signer;
};

export const readOnlyProvider = async () => {
  const alchemyProvider = new ethers.AlchemyProvider(
    "goerli",
    process.env.NEXT_PUBLIC_ALCHEMY_GOERLI
  );
  return alchemyProvider;
};

export const getSigner = async (provider?: any) => {
  if (!provider) {
    const readOnly = await readOnlyProvider();
    return readOnly;
  }
  const signer = await connectedSigner(provider);
  return signer;
};

export const getSignerAddress = async () => {
  //@ts-ignore
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const signerAddress = await signer.getAddress();
  return signerAddress;
};

export const isWalletConnected = async () => {
  const connectedAccount = await getSignerAddress();
  if (!connectedAccount) {
    return false;
  }
  return true;
};

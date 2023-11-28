import { ethers } from "ethers";
import {
  DEFIKIDS_PROXY_ADDRESS,
  GOERLI_DK_STABLETOKEN_ADDRESS,
  TOKEN_LOCKERS_ADDRESS,
} from "./contract-addresses";
import { defikidsCoreABI } from "./artifacts/goerli/defikids-core";
import { stableTokenABI } from "./artifacts/goerli/stable-token";
import { tokenLockersABI } from "./artifacts/goerli/tokenLockers";

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

const getSigner = async (provider?: any) => {
  console.log("provider", provider);
  if (!provider) {
    const readOnly = await readOnlyProvider();
    return readOnly;
  }
  const signer = await connectedSigner(provider);
  return signer;
};

export const defiDollarsContractInstance = async (provider?: any) => {
  const instance = new ethers.Contract(
    DEFIKIDS_PROXY_ADDRESS,
    defikidsCoreABI,
    await getSigner(provider)
  );
  return instance;
};

export const stableTokenContractInstance = async (provider?: any) => {
  const instance = new ethers.Contract(
    GOERLI_DK_STABLETOKEN_ADDRESS,
    stableTokenABI,
    await getSigner(provider)
  );
  return instance;
};

export const tokenLockersContractInstance = async (provider?: any) => {
  const instance = new ethers.Contract(
    TOKEN_LOCKERS_ADDRESS,
    tokenLockersABI,
    await getSigner(provider)
  );
  console.log("instance", instance);
  return instance;
};

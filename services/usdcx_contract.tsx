import { ethers } from "ethers";
import USDCX_ABI from "../abis/USDCx.json";
import { UsdCx } from "../types/ethers-contracts/UsdCx";

export const CONTRACT_ADDRESS = "0x42bb40bF79730451B11f6De1CbA222F17b87Afd7";

export async function getUSDCXBalance(
  provider: ethers.providers.Web3Provider,
  wallet: string
) {
  const signer = provider.getSigner(wallet);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, USDCX_ABI, signer);
  let result = await contract.balanceOf(wallet);
  return ethers.utils.formatEther(result);
}

export async function approveUSDCX(
  provider: ethers.providers.Web3Provider,
  sender,
  amount,
  receiver
) {
  const signer = provider.getSigner(sender);
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    USDCX_ABI,
    signer
  ) as UsdCx;
  const tokens = ethers.utils.parseUnits(amount.toString(), 18);
  const allowance = await contract.allowance(sender, receiver);
  if (allowance.lt(tokens)) {
    await contract.approve(receiver, tokens.sub(allowance));
  }
  return;
}

export async function transferUSDCX(
  provider: ethers.providers.Web3Provider,
  sender,
  amount,
  receiver
) {
  const signer = provider.getSigner(sender);
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    USDCX_ABI,
    signer
  ) as UsdCx;
  const tokens = ethers.utils.parseUnits(amount.toString(), 18);
  const allowance = await contract.allowance(sender, receiver);
  if (allowance.lt(tokens)) {
    await contract.approve(receiver, tokens.sub(allowance));
  }
  const result = await contract.transfer(receiver, tokens);
  return result;
}

export default { getUSDCXBalance, transferUSDCX };

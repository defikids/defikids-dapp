import { ethers } from "ethers";
import { USDCX_ABI } from "../abis/USDCx";

const CONTRACT_ADDRESS = "0x42bb40bF79730451B11f6De1CbA222F17b87Afd7";

async function getUSDCXBalance(
  provider: ethers.providers.Web3Provider,
  wallet: string
) {
  const signer = provider.getSigner(wallet);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, USDCX_ABI, signer);
  let result = await contract.balanceOf(wallet);
  return ethers.utils.formatEther(result);
}

export default getUSDCXBalance;

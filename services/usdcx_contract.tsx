import { ethers } from "ethers";
import { USDCX_ABI } from "../abis/USDCx";

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

export async function transferUSDCX(
  provider: ethers.providers.Web3Provider,
  sender,
  amount,
  receiver
) {
  const signer = provider.getSigner(sender);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, USDCX_ABI, signer);
  const tokens = ethers.utils.parseUnits(amount.toString(), 18);
  const result = await contract.transfer(receiver, tokens);
  return result;
  // const transaction = {
  //   from: sender,
  //   to: receiver,
  //   value: ethers.utils.parseEther(amount),
  //   nonce: provider.getTransactionCount(sender, "latest"),
  //   gasPrice,
  //   // gasLimit: ethers.utils.hexlify(gas_limit), // 100000
  // };

  // return signer.sendTransaction(transaction);
}

export default { getUSDCXBalance, transferUSDCX };

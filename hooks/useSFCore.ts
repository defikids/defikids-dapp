import { customHttpProvider } from "../config";
import { Framework } from "@superfluid-finance/sdk-core";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import USDC_ABI from "../abis/USDC.json";
import USDCX_ABI from "../abis/USDCx.json";
import { CONTRACT_ADDRESS } from "../services/usdcx_contract";

const fUSDC_contract_address = "0xbe49ac1EadAc65dccf204D4Df81d650B50122aB2";
const fUSDCx_contract_address = "0x42bb40bF79730451B11f6De1CbA222F17b87Afd7";

export const getUSDCBalances = async (provider, address) => {
  // Signing the transaction
  const signer = provider.getSigner(address);

  // Create a contract instance that we can interact with
  const USDC = new ethers.Contract(fUSDC_contract_address, USDC_ABI, signer);

  // Create a contract instance that we can interact with
  const USDCx = new ethers.Contract(fUSDCx_contract_address, USDCX_ABI, signer);

  // Get the current value of the token
  const USDCBalance = await USDC.balanceOf(address);
  const USDCxBalance = await USDCx.balanceOf(address);
  return {
    USDCBalance: ethers.utils.formatEther(USDCBalance),
    USDCxBalance: ethers.utils.formatEther(USDCxBalance),
  };
};

export const upgradeToken = async (amount, provider, address) => {
  const sf = await Framework.create({
    // networkName: "kovan",
    networkName: "mumbai",
    provider: customHttpProvider,
  });

  // Signing the transaction
  const signer = provider.getSigner(address);

  // Create a contract instance that we can interact with
  const USDC = new ethers.Contract(fUSDC_contract_address, USDC_ABI, signer);

  // Convert the amount to wei
  const convertedAmount = ethers.utils.parseEther(amount.toString());

  // Approve the contract to spend the amount
  const usdcApprove = await USDC.approve(
    fUSDCx_contract_address,
    convertedAmount
  );

  // Wait for the transaction to be mined
  let usdcApproveReceipt = await usdcApprove.wait();

  // Return the transaction receipt
  usdcApproveReceipt = `https://mumbai.polygonscan.com/tx/${usdcApproveReceipt.transactionHash}`;

  // Create a contract instance of the Superfluid token that we can interact with
  const usdcx = await sf.loadSuperToken(CONTRACT_ADDRESS);

  // Upgrade the USDC token to USDCx
  const usdcUpgrade = usdcx.upgrade({
    amount: convertedAmount.toString(),
  });

  // Wait for the transaction to be mined
  let usdcUpgradeReceipt = await usdcUpgrade.exec(signer);
  await usdcUpgradeReceipt.wait();

  // Return the transaction receipt
  // usdcUpgradeReceipt = `https://mumbai.polygonscan.com/tx/${usdcUpgradeReceipt.hash}`;

  //   return { usdcApproveReceipt, usdcUpgradeReceipt };
  const newBalances = await getUSDCBalances(provider, address);
  return { newBalances };
};

export const downgradeToken = async (amount, provider, address) => {
  const sf = await Framework.create({
    // networkName: "kovan",
    networkName: "mumbai",
    provider: customHttpProvider,
  });

  // Signing the transaction
  const signer = provider.getSigner(address);

  // Convert the amount to wei
  const convertedAmount = ethers.utils.parseEther(amount.toString());

  // Create a contract instance that we can interact with
  const usdcx = await sf.loadSuperToken(CONTRACT_ADDRESS);

  // Downgrade the USDCx token to USDC
  const usdcDowngrade = await usdcx.downgrade({
    amount: convertedAmount.toString(),
  });

  // Wait for the transaction to be mined
  let usdcDowngradeReceipt = await usdcDowngrade.exec(signer);
  await usdcDowngradeReceipt.wait();

  // Return the transaction receipt
  // usdcDowngradeReceipt = `https://mumbai.polygonscan.com/tx/${usdcDowngradeReceipt.hash}`;

  // return { usdcApproveReceipt, usdcUpgradeReceipt };
  const newBalances = await getUSDCBalances(provider, address);
  return { newBalances };
};

export const createFlow = async (
  provider,
  sender,
  recipient,
  flowRate: string
) => {
  const sf = await Framework.create({
    // networkName: "kovan",
    networkName: "mumbai",
    provider: customHttpProvider,
  });
  const signer = provider.getSigner(sender);

  // Create a contract instance that we can interact with
  const usdcx = CONTRACT_ADDRESS;

  try {
    const createFlowOperation = sf.cfaV1.createFlow({
      sender: sender,
      receiver: recipient,
      flowRate: flowRate,
      superToken: usdcx,
      // userData?: string
    });

    let usdcCreateFlowReceipt = await createFlowOperation.exec(signer);
    await usdcCreateFlowReceipt.wait();

    // transaction receipt
    // usdcCreateFlowReceipt = `https://mumbai.polygonscan.com/tx/${usdcCreateFlowReceipt.hash}`;

    // return updated balances
    const newBalances = await getUSDCBalances(provider, sender);
    return { newBalances };
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
    );
    console.error(error);
  }
};

export const updateFlow = async (provider, sender, recipient, flowRate) => {
  const sf = await Framework.create({
    networkName: "mumbai",
    provider: customHttpProvider,
  });

  // Signing the transaction
  const signer = provider.getSigner(sender);

  // Create a contract instance that we can interact with
  const usdcx = CONTRACT_ADDRESS;

  try {
    const updateFlowOperation = sf.cfaV1.updateFlow({
      sender: sender,
      receiver: recipient,
      flowRate: flowRate,
      superToken: usdcx,
      // userData?: string
    });

    let usdcUpdateFlowReceipt = await updateFlowOperation.exec(signer);
    await usdcUpdateFlowReceipt.wait();

    // the transaction receipt
    // usdcUpdateFlowReceipt = `https://mumbai.polygonscan.com/tx/${usdcUpdateFlowReceipt.hash}`;

    // return updated balances
    const newBalances = await getUSDCBalances(provider, sender);
    return { newBalances };
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
    );
    console.error(error);
  }
};

export const deleteFlow = async (provider, sender, recipient) => {
  const sf = await Framework.create({
    networkName: "mumbai",
    provider: customHttpProvider,
  });

  // Signing the transaction
  const signer = provider.getSigner(sender);

  // Create a contract instance that we can interact with
  const usdcx = "0x42bb40bF79730451B11f6De1CbA222F17b87Afd7";

  try {
    const deleteFlowOperation = sf.cfaV1.deleteFlow({
      sender: sender,
      receiver: recipient,
      superToken: usdcx,
      // userData?: string
    });

    let usdcDeleteFlowReceipt = await deleteFlowOperation.exec(signer);
    await usdcDeleteFlowReceipt.wait();

    // the transaction receipt
    // usdcDeleteFlowReceipt = `https://mumbai.polygonscan.com/tx/${usdcDeleteFlowReceipt.hash}`;

    // return updated balances
    const newBalances = await getUSDCBalances(provider, sender);
    return { newBalances };
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
    );
    console.error(error);
  }
};

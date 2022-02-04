import { customHttpProvider } from "../config";
import { Framework } from "@superfluid-finance/sdk-core";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { USDC_ABI } from "../abis/USDC";
import { USDCX_ABI } from "../abis/USDCx";
import { useStore } from "../services/store";

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
  return { USDCBalance, USDCxBalance };
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
  const usdcx = await sf.loadSuperToken(
    "0x42bb40bF79730451B11f6De1CbA222F17b87Afd7"
  );

  // Upgrade the USDC token to USDCx
  const usdcUpgrade = usdcx.upgrade({
    amount: convertedAmount,
  });

  // Wait for the transaction to be mined
  let usdcUpgradeReceipt = await usdcUpgrade.exec(signer);
  await usdcUpgradeReceipt.wait();

  // Return the transaction receipt
  usdcUpgradeReceipt = `https://mumbai.polygonscan.com/tx/${usdcUpgradeReceipt.hash}`;

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
  const usdcx = await sf.loadSuperToken(
    "0x42bb40bF79730451B11f6De1CbA222F17b87Afd7"
  );

  // Downgrade the USDCx token to USDC
  const usdcDowngrade = await usdcx.downgrade({
    amount: convertedAmount,
  });

  // Wait for the transaction to be mined
  let usdcDowngradeReceipt = await usdcDowngrade.exec(signer);
  await usdcDowngradeReceipt.wait();

  // Return the transaction receipt
  usdcDowngradeReceipt = `https://mumbai.polygonscan.com/tx/${usdcDowngradeReceipt.hash}`;

  //   return { usdcApproveReceipt, usdcUpgradeReceipt };
  const newBalances = await getUSDCBalances(provider, address);
  return { newBalances };
};

export const createFlow = async (sender, recipient, flowRate) => {
  const sf = await Framework.create({
    networkName: "mumbai",
    provider: customHttpProvider,
  });

  // Signing the transaction
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();

  // Create a contract instance that we can interact with
  const usdcx = "0x42bb40bF79730451B11f6De1CbA222F17b87Afd7";

  try {
    const createFlowOperation = sf.cfaV1.createFlow({
      sender: sender,
      receiver: recipient,
      flowRate: flowRate,
      superToken: usdcx,
      // userData?: string
    });

    const usdcCreateFlowReceipt = await createFlowOperation.exec(signer);

    // Return the transaction receipt
    usdcCreateFlowReceipt = `https://mumbai.polygonscan.com/tx/${usdcCreateFlowReceipt.hash}`;

    return { usdcCreateFlowReceipt };
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
    );
    console.error(error);
  }
};

export const updateFlow = async (sender, recipient, flowRate) => {
  const sf = await Framework.create({
    networkName: "mumbai",
    provider: customHttpProvider,
  });

  // Signing the transaction
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();

  // Create a contract instance that we can interact with
  const usdcx = "0x42bb40bF79730451B11f6De1CbA222F17b87Afd7";

  try {
    const updateFlowOperation = sf.cfaV1.updateFlow({
      sender: sender,
      receiver: recipient,
      flowRate: flowRate,
      superToken: usdcx,
      // userData?: string
    });

    const usdcUpdateFlowReceipt = await updateFlowOperation.exec(signer);

    // Return the transaction receipt
    usdcUpdateFlowReceipt = `https://mumbai.polygonscan.com/tx/${usdcUpdateFlowReceipt.hash}`;

    return { usdcUpdateFlowReceipt };
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
    );
    console.error(error);
  }
};

export const deleteFlow = async (sender, recipient) => {
  const sf = await Framework.create({
    networkName: "mumbai",
    provider: customHttpProvider,
  });

  // Signing the transaction
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();

  // Create a contract instance that we can interact with
  const usdcx = "0x42bb40bF79730451B11f6De1CbA222F17b87Afd7";

  try {
    const deleteFlowOperation = sf.cfaV1.deleteFlow({
      sender: sender,
      receiver: recipient,
      superToken: usdcx,
      // userData?: string
    });

    const usdcDeleteFlowReceipt = await deleteFlowOperation.exec(signer);

    // Return the transaction receipt
    usdcDeleteFlowReceipt = `https://mumbai.polygonscan.com/tx/${usdcDeleteFlowReceipt.hash}`;

    return { usdcDeleteFlowReceipt };
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
    );
    console.error(error);
  }
};

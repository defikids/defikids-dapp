import SuperfluidSDK from "@superfluid-finance/js-sdk";
import { Web3Provider } from "@ethersproject/providers";

// Contracts:
const fUSDC = "0xbe49ac1EadAc65dccf204D4Df81d650B50122aB2";
const fUSDCx = "0x42bb40bF79730451B11f6De1CbA222F17b87Afd7";

// Abis:
import USDCabi from "../abis/USDC";
import USDCXabi from "../abis/USDCx";

let sf;

const init = async (s, r) => {
  let sender = s;
  let receiver = r;

  sf = new SuperfluidSDK.Framework({
    ethers: new Web3Provider(window.ethereum),
    tokens: ["fUSDC"],
  });
  await sf.initialize();

  sender = sf.user({
    address: s,
    // token: sf.tokens.fUSDCx.address,
    token: fUSDCx,
  });

  if (r) {
    receiver = sf.user({
      address: r,
      // token: sf.tokens.fUSDCx.address,
      token: fUSDCx,
    });
  }

  return { sender, receiver };
};

export const createFlow = async (s, r, f) => {
  const { _sender, _receiver } = await init(s, r);
  const tx = await _sender.flow({
    recipient: _receiver,
    flowRate: f,
    onTransaction: (hash) => {
      return hash;
    },
  });
  return tx;
};

export const deleteFlow = async (s, r) => {
  const { sender, receiver } = await init(s, r);
  const tx = await sender.flow({
    recipient: receiver,
    flowRate: "0",
    onTransaction: (hash) => {
      return hash;
    },
  });
  return tx;
};

export const flowDetails = async (s) => {
  const { sender } = await init(s);
  return await sender.details();
};

export const loadOutflows = async () => {
  const result = await flowDetails(account);
  const outflows = result.cfa.flows.outFlows;
  return outflows;
};

import BigNumber from "bignumber.js";

export const ethers = require("ethers");
export const network = ethers.providers.getNetwork(80001);

// Ethers.js provider initialization
export const url =
  "https://polygon-mumbai.g.alchemy.com/v2/ZAX72ViWMKnFEGQDlo6K_X333b1teboA";

export const customHttpProvider = new ethers.providers.JsonRpcProvider(url);

export function calculateFlowRate(amount) {
  let fr = amount / (86400 * 30);
  return Math.floor(fr);
}

export function calculateStream(flowRate) {
  const stream = new BigNumber(flowRate * (86400 * 30)).shiftedBy(-18);
  return stream.toFixed(2);
}

export function calculateEndDate(bal, outflow) {
  let t = Number(bal) / (Number(outflow) * -1);
  let secondsLeft = t * 86400 * 30;
  let end = new Date(Date.now() + secondsLeft * 1000);
  let endDay = end.toLocaleString();
  return endDay;
}

export function calculateStreamPerSecond(amount) {
  let streamSecond = amount / (86400 * 30);
  return streamSecond;
}

export function getTotalOutflows(outflows) {
  let _totalOutflows = 0;
  let outFlows = outflows;
  for (let i = 0; i <= outFlows.length; i++) {
    if (outFlows[i] !== undefined) {
      let stream = calculateStream(outFlows[i].flowRate);
      _totalOutflows = _totalOutflows - Number(stream);
    }
  }
  return _totalOutflows;
}

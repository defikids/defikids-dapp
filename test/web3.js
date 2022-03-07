export const etherToWei = (n) => {
  return new web3.utils.BN(web3.utils.toWei(n.toString(), "ether"));
};
export const tokens = (n) => etherToWei(n);

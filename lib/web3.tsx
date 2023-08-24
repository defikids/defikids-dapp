export const trimAddress = (address: string) => {
  const addr = address
    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    : "";

  return addr;
};

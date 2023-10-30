interface CustomWindow extends Window {
  ethereum?: any;
}

export const AddUSDCTokenToWallet = async () => {
  const customWindow = window as CustomWindow;
  const ethereum = customWindow.ethereum;

  if (ethereum && ethereum.isMetaMask) {
    await ethereum
      .request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            symbol: "USDC",
            decimals: 18,
            image:
              "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
          },
        },
      })
      .then((success) => {
        if (success) {
          console.log("USDC Token successfully added to wallet!");
        } else {
          throw new Error("Something went wrong.");
        }
      })
      .catch(console.error);
  } else {
    console.error("Please install MetaMask!");
  }
};

export const AddDefiDollarsTokenToWallet = async () => {
  const customWindow = window as CustomWindow;
  const ethereum = customWindow.ethereum;

  if (ethereum && ethereum.isMetaMask) {
    await ethereum
      .request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: "0x34bFb9AEb5eDb1Cc9A59952534708cA6A2F5dc53",
            symbol: "DD",
            decimals: 18,
            image:
              "https://storage.googleapis.com/defikids_bucket/token-logo.svg",
          },
        },
      })
      .then((success) => {
        if (success) {
          console.log("DefiDollars Token successfully added to wallet!");
        } else {
          throw new Error("Something went wrong.");
        }
      })
      .catch(console.error);
  } else {
    console.error("Please install MetaMask!");
  }
};

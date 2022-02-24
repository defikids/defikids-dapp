import { sequence } from "0xsequence";

const wallet = new sequence.Wallet("mumbai");

const init = (
  handleLogin: (accounts: string[], wallet: sequence.provider.Wallet) => void,
  handleLogout: () => void
) => {
  wallet.on("message", (message) => {
    console.log("wallet event (message):", message);
  });

  wallet.on("accountsChanged", (p) => {
    console.log("wallet event (accountsChanged):", p);
    handleLogin(p, wallet);
  });

  wallet.on("chainChanged", (p) => {
    console.log("wallet event (chainChanged):", p);
  });

  wallet.on("connect", (p) => {
    console.log("wallet event (connect):", p);
  });

  wallet.on("disconnect", (p) => {
    console.log("wallet event (disconnect):", p);
    handleLogout();
  });

  wallet.on("open", (p) => {
    console.log("wallet event (open):", p);
  });

  wallet.on("close", (p) => {
    console.log("wallet event (close):", p);
  });

  return wallet;
};

const connectWallet = async (authorize: boolean = false) => {
  return await wallet.connect({
    app: "Defi Kids",
    authorize,
  });
};

export default { init, connectWallet, wallet };

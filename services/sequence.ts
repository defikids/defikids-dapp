import { sequence } from "0xsequence";

let wallet: sequence.provider.Wallet;

const init = (
  handleLogin: (details: sequence.provider.ConnectDetails) => void,
  handleLogout: () => void
) => {
  wallet = new sequence.Wallet("mumbai");

  wallet.on("message", (message) => {
    console.log("wallet event (message):", message);
  });

  wallet.on("accountsChanged", (p) => {
    console.log("wallet event (accountsChanged):", p);
  });

  wallet.on("chainChanged", (p) => {
    console.log("wallet event (chainChanged):", p);
  });

  wallet.on("connect", (p) => {
    console.log("wallet event (connect):", p);
    handleLogin(p);
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
};

const connectWallet = async (authorize: boolean = false) => {
  return await wallet.connect({
    app: "Allocate",
    authorize,
  });
};

export default { init, connectWallet, wallet };

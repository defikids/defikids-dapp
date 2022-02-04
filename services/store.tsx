import { ethers } from "ethers";
import React from "react";

import HOST_ABI from "../artifacts/contracts/Host.sol/Host.json";
const CONTRACT_ADDRESS = "0xC92A93D03cFA2b34A904fE5A48c20Aa86aE54396";

enum UserType {
  PARENT = 1,
  CHILD = 2,
  UNREGISTERED = 3,
}

export enum StoreAction {
  LOGIN,
  LOGOUT,
}
export interface IStoreAction {
  type: StoreAction;
  payload?: Partial<IStoreState>;
}
interface IStoreState {
  loggedIn: boolean;
  wallet?: string;
  provider?: ethers.providers.Web3Provider;
  userType?: UserType;
}
type IStoreDispatch = (action: IStoreAction) => void;

const StoreContext = React.createContext<
  { state: IStoreState; dispatch?: IStoreDispatch } | undefined
>(undefined);

function storeReducer(state: IStoreState, action: IStoreAction): IStoreState {
  switch (action.type) {
    case StoreAction.LOGIN: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case StoreAction.LOGOUT: {
      return { loggedIn: false };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function StoreProvider({ children }) {
  const [state, dispatch] = React.useReducer(storeReducer, { loggedIn: false });

  const value = { state, dispatch };
  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

function useStore() {
  const context = React.useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}

async function loginUser(
  provider: ethers.providers.Web3Provider,
  dispatch: IStoreDispatch
) {
  const accounts = await provider.send("eth_requestAccounts", []);
  const wallet = accounts[0];
  const signer = provider.getSigner(wallet);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, HOST_ABI.abi, signer);
  let result = await contract.getUserType(wallet);
  const userType = parseInt(result._hex, 16);

  dispatch({
    type: StoreAction.LOGIN,
    payload: { wallet, provider, userType },
  });
}

export { StoreProvider, useStore, loginUser };

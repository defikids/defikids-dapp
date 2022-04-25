import { ethers } from "ethers";
import React from "react";
import HostContract, { UserType } from "./contract";
import StakeContract from "./stake";

export enum StoreAction {
  LOGIN,
  LOGOUT,
  STAKE_CONTRACT,
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
  contract?: HostContract;
  stakeContract?: StakeContract;
  logout?: () => void;
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
        loggedIn: true,
        ...action.payload,
      };
    }
    case StoreAction.LOGOUT: {
      return { loggedIn: false };
    }
    case StoreAction.STAKE_CONTRACT: {
      return {
        ...state,
        stakeContract: action.payload as any as StakeContract,
      };
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
  logout: () => void,
  dispatch: IStoreDispatch,
  address?: string
) {
  console.log(provider, address);
  const contract = await HostContract.fromProvider(provider, address);
  const userType = await contract.getUserType();
  const wallet = contract.getWallet();

  dispatch({
    type: StoreAction.LOGIN,
    payload: { provider, userType, contract, wallet, logout },
  });
}

export { StoreProvider, useStore, loginUser };

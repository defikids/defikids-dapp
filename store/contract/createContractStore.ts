import { create, StoreApi, UseBoundStore } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Contract } from "ethers";

import { shallow } from "zustand/shallow";
import { sequence } from "0xsequence";

type State = {
  readOnlyProvider: any;
  provider: any;
  connectedSigner: sequence.provider.SequenceSigner;
  contractInstance: Contract;
};

type Actions = {
  setReadOnlyProvider: (readOnlyProvider: any) => void;
  setProvider: (provider: any) => void;
  setConnectedSigner: (signer: sequence.provider.SequenceSigner) => void;
  setContactInstance: (contractInstance: Contract) => void;
};

type MyStore = State & Actions;

const initialState: State = {
  readOnlyProvider: null,
  provider: null,
  connectedSigner: null,
  contractInstance: null,
};

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

// Setters
const setters = (set: any) => ({
  setReadOnlyProvider: (readOnlyProvider: any) => {
    set((state: { readOnlyProvider: any }) => {
      state.readOnlyProvider = readOnlyProvider;
    }, shallow);
  },
  setProvider: (provider: any) => {
    set((state: { provider: any }) => {
      state.provider = provider;
    }, shallow);
  },
  setConnectedSigner: (signer: sequence.provider.SequenceSigner) => {
    set((state: { connectedSigner: sequence.provider.SequenceSigner }) => {
      state.connectedSigner = signer;
    }, shallow);
  },
  setContactInstance: (contractInstance: Contract) => {
    set((state: { contractInstance: Contract }) => {
      state.contractInstance = contractInstance;
    }, shallow);
  },
});

// Store
export const contractStore = create<
  MyStore,
  [["zustand/devtools", never], ["zustand/immer", never]]
>(
  devtools(
    immer((set) => ({
      ...initialState,
      ...setters(set),
    }))
  )
);

// Selectors
const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S
) => {
  let store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (let k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

export const createContractStore = () => createSelectors(contractStore);

import { create, StoreApi, UseBoundStore } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Contract } from "ethers";

import { shallow } from "zustand/shallow";

type State = {
  readOnlyProvider: any;
  provider: any;
};

type Actions = {
  setReadOnlyProvider: (readOnlyProvider: any) => void;
  setProvider: (provider: any) => void;
};

type MyStore = State & Actions;

const initialState: State = {
  readOnlyProvider: null,
  provider: null,
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

import { create, StoreApi, UseBoundStore } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { shallow } from "zustand/shallow";
import { UserType } from "../../services/contract";

type State = {
  walletAddress: "";
  isLoggedIn: boolean;
  userType: UserType;
};

type Actions = {
  setWalletAddress: (walletAddress: string) => void;
  setIsLoggedIn: (isLoggingIn: boolean) => void;
  setUserType: (userType: UserType) => void;
};

type MyStore = State & Actions;

const initialState: State = {
  walletAddress: "",
  isLoggedIn: false,
  userType: UserType.UNREGISTERED,
};

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

// Setters
const setters = (set: any) => ({
  setWalletAddress: (walletAddress: string) => {
    set((state: { walletAddress: string }) => {
      state.walletAddress = walletAddress;
    }, shallow);
  },
  setIsLoggedIn: (isLoggedIn: boolean) => {
    set((state: { isLoggedIn: boolean }) => {
      state.isLoggedIn = isLoggedIn;
    }, shallow);
  },
  setUserType: (userType: UserType) => {
    set((state: { userType: UserType }) => {
      state.userType = userType;
    }, shallow);
  },
});

// Store
export const authStore = create<
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

export const createAuthStore = () => createSelectors(authStore);

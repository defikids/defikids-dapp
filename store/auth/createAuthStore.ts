import { StoreApi, UseBoundStore } from "zustand";
import { createWithEqualityFn } from "zustand/traditional";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { shallow } from "zustand/shallow";
import { UserType } from "../../services/contract";
import { disconnect } from "@wagmi/core";

type State = {
  walletAddress: "";
  isLoggedIn: boolean;
  userType: UserType;
  navigationSection: string;
  logout: () => void;
};

type Actions = {
  setWalletAddress: (walletAddress: string) => void;
  setIsLoggedIn: (isLoggingIn: boolean) => void;
  setUserType: (userType: UserType) => void;
  setNavigationSection: (section: string) => void;
  setLogout: () => void;
};

type MyStore = State & Actions;

const initialState: State = {
  walletAddress: "",
  isLoggedIn: false,
  userType: UserType.UNREGISTERED,
  navigationSection: "DefiKids",
  logout: () => {},
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
  setNavigationSection: (section: string) => {
    set((state: { navigationSection: string }) => {
      state.navigationSection = section;
    }, shallow);
  },
  setLogout: () => {
    set(
      (state: {
        walletAddress: string;
        isLoggedIn: boolean;
        userType: UserType;
      }) => {
        state.walletAddress = "";
        state.isLoggedIn = false;
        state.userType = UserType.UNREGISTERED;
      },
      shallow
    );
    localStorage.removeItem("defi-kids.family-id");
    localStorage.removeItem("defi-kids.wallet-address");

    if (window.location.pathname !== "/") {
      window.location.href = "/";
    }

    disconnect();
  },
});

// Store
export const authStore = createWithEqualityFn<
  MyStore,
  [["zustand/devtools", never], ["zustand/immer", never]]
>(
  devtools(
    immer((set) => ({
      ...initialState,
      ...setters(set),
    }))
  ),
  shallow
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

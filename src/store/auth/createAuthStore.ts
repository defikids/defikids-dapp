import { StoreApi, UseBoundStore } from "zustand";
import { createWithEqualityFn } from "zustand/traditional";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { shallow } from "zustand/shallow";
import { disconnect } from "@wagmi/core";
import { IActivity } from "@/models/Activity";

type State = {
  connectedWallet: string;
  isLoggedIn: boolean;
  navigationSection: string;
  reset: () => void;
  logout: () => void;
  mobileMenuOpen: boolean;
  recentActivity: IActivity[];
};

type Actions = {
  setConnectedWallet: (connectedWallet: string) => void;
  setIsLoggedIn: (isLoggingIn: boolean) => void;
  setNavigationSection: (section: string) => void;
  setLogout: () => void;
  setMobileMenuOpen: (mobileMenuOpen: boolean) => void;
  reset: () => void;
  setRecentActivity: (recentActivity: IActivity[]) => void;
};

type MyStore = State & Actions;

export const initialState: State = {
  connectedWallet: "",
  isLoggedIn: false,
  navigationSection: "DefiKids",
  mobileMenuOpen: false,
  logout: () => {},
  reset: () => void {},
  recentActivity: [],
};

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

// Setters
const setters = (set: any) => ({
  setConnectedWallet: (connectedWallet: string) => {
    set((state: { connectedWallet: string }) => {
      state.connectedWallet = connectedWallet;
    }, shallow);
  },
  setIsLoggedIn: (isLoggedIn: boolean) => {
    set((state: { isLoggedIn: boolean }) => {
      state.isLoggedIn = isLoggedIn;
    }, shallow);
  },

  setNavigationSection: (section: string) => {
    set((state: { navigationSection: string }) => {
      state.navigationSection = section;
    }, shallow);
  },
  setLogout: () => {
    disconnect();
  },

  setMobileMenuOpen: (mobileMenuOpen: boolean) => {
    set((state: { mobileMenuOpen: boolean }) => {
      state.mobileMenuOpen = mobileMenuOpen;
    }, shallow);
  },

  setRecentActivity: (recentActivity: IActivity[]) => {
    set((state: { recentActivity: IActivity[] }) => {
      state.recentActivity = recentActivity;
    }, shallow);
  },
  reset: () => {
    set((state: State) => {
      state = { ...initialState };
    }, shallow);
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

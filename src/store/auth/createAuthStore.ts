import { StoreApi, UseBoundStore } from "zustand";
import { createWithEqualityFn } from "zustand/traditional";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { shallow } from "zustand/shallow";
import { UserType } from "@/data-schema/enums";
import { disconnect } from "@wagmi/core";
import { User } from "@/data-schema/types";
import { NetworkType, TestnetNetworks } from "@/data-schema/enums";
import { IActivity } from "@/models/Activity";

type State = {
  connectedWallet: string;
  isLoggedIn: boolean;
  walletConnected: boolean;
  navigationSection: string;
  reset: () => void;
  logout: () => void;
  userDetails: User;
  mobileMenuOpen: boolean;
  fetchedUserDetails: boolean;
  familyMembers: User[];
  recentActivity: IActivity[];
};

type Actions = {
  setConnectedWallet: (connectedWallet: string) => void;
  setIsLoggedIn: (isLoggingIn: boolean) => void;
  setWalletConnected: (walletConnected: boolean) => void;
  setNavigationSection: (section: string) => void;
  setLogout: () => void;
  setUserDetails: (userDetails: User) => void;
  setMobileMenuOpen: (mobileMenuOpen: boolean) => void;
  setFetchedUserDetails: (fetchedUserDetails: boolean) => void;
  setFamilyMembers: (familyMembers: User[]) => void;
  reset: () => void;
  setRecentActivity: (recentActivity: IActivity[]) => void;
};

type MyStore = State & Actions;

export const initialState: State = {
  connectedWallet: "",
  isLoggedIn: false,
  walletConnected: false,
  navigationSection: "DefiKids",
  mobileMenuOpen: false,
  fetchedUserDetails: false,
  familyMembers: [],
  logout: () => {},
  reset: () => void {},
  userDetails: {
    _id: null,
    accountId: null,
    email: "",
    wallet: "",
    avatarURI: "",
    defaultNetwork: TestnetNetworks.GOERLI,
    defaultNetworkType: NetworkType.TESTNET,
    username: "",
    termsAgreed: false,
    userType: UserType.UNREGISTERED,
    sandboxMode: undefined,
    permissions: [],
    balance: "",
  },
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
  setWalletConnected: (walletConnected: boolean) => {
    set((state: { walletConnected: boolean }) => {
      state.walletConnected = walletConnected;
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
  setUserDetails: (userDetails: User) => {
    set((state: { userDetails: User }) => {
      state.userDetails = userDetails;
    }, shallow);
  },

  setMobileMenuOpen: (mobileMenuOpen: boolean) => {
    set((state: { mobileMenuOpen: boolean }) => {
      state.mobileMenuOpen = mobileMenuOpen;
    }, shallow);
  },
  setFetchedUserDetails: (fetchedUserDetails: boolean) => {
    set((state: { fetchedUserDetails: boolean }) => {
      state.fetchedUserDetails = fetchedUserDetails;
    }, shallow);
  },
  setFamilyMembers: (familyMembers: User[]) => {
    set((state: { familyMembers: User[] }) => {
      state.familyMembers = familyMembers;
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

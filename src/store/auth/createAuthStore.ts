import { StoreApi, UseBoundStore } from "zustand";
import { createWithEqualityFn } from "zustand/traditional";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { shallow } from "zustand/shallow";
import { UserType } from "@/data-schema/enums";
import { disconnect } from "@wagmi/core";
import { User, ChildDetails } from "@/data-schema/types";
import {
  AccountStatus,
  AccountPackage,
  NetworkType,
  MainnetNetworks,
  TestnetNetworks,
} from "@/data-schema/enums";

type State = {
  isLoggedIn: boolean;
  walletConnected: boolean;
  navigationSection: string;
  logout: () => void;
  userDetails: User | ChildDetails;
  opacity: 0;
  mobileMenuOpen: boolean;
};

type Actions = {
  setIsLoggedIn: (isLoggingIn: boolean) => void;
  setWalletConnected: (walletConnected: boolean) => void;
  setNavigationSection: (section: string) => void;
  setLogout: () => void;
  setUserDetails: (userDetails: User | ChildDetails) => void;
  setOpacity: (opacity: number) => void;
  setMobileMenuOpen: (mobileMenuOpen: boolean) => void;
};

type MyStore = State & Actions;

const initialState: State = {
  isLoggedIn: false,
  walletConnected: false,
  navigationSection: "DefiKids",
  logout: () => {},
  userDetails: {
    account: {
      id: "",
      status: AccountStatus.INACTIVE,
      memberSince: 0,
      package: AccountPackage.BASIC,
    },
    defaultNetwork: TestnetNetworks.GOERLI,
    defualtNetworkType: NetworkType.TESTNET,
    opacity: {
      background: 0,
      card: 0,
    },
    familyName: "",
    email: "",
    familyId: "",
    wallet: "",
    avatarURI: "",
    backgroundURI: "",
    username: "",
    termsAgreed: false,
    userType: UserType.UNREGISTERED,
    children: [],
  },
  opacity: 0,
  mobileMenuOpen: false,
};

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

// Setters
const setters = (set: any) => ({
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
    set(
      (state: {
        walletAddress: string;
        isLoggedIn: boolean;
        userType: UserType;
        walletConnected: boolean;
      }) => {
        state.walletAddress = "";
        state.isLoggedIn = false;
        state.userType = UserType.UNREGISTERED;
        state.walletConnected = false;
      },
      shallow
    );
    disconnect();
  },
  setUserDetails: (userDetails: User | ChildDetails) => {
    set((state: { userDetails: User | ChildDetails }) => {
      state.userDetails = userDetails;
    }, shallow);
  },
  setOpacity: (opacity: number) => {
    set((state: { opacity: number }) => {
      state.opacity = opacity;
    }, shallow);
  },
  setMobileMenuOpen: (mobileMenuOpen: boolean) => {
    set((state: { mobileMenuOpen: boolean }) => {
      state.mobileMenuOpen = mobileMenuOpen;
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

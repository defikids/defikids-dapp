import { StoreApi, UseBoundStore } from "zustand";
import { createWithEqualityFn } from "zustand/traditional";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { shallow } from "zustand/shallow";
import { PermissionType, UserType } from "@/data-schema/enums";
import { disconnect } from "@wagmi/core";
import { User } from "@/data-schema/types";
import { NetworkType, TestnetNetworks } from "@/data-schema/enums";
import { IUser } from "@/models/User";

type State = {
  isLoggedIn: boolean;
  walletConnected: boolean;
  navigationSection: string;
  reset: () => void;
  logout: () => void;
  userDetails: User;
  opacity: 0;
  mobileMenuOpen: boolean;
  fetchedUserDetails: boolean;
};

type Actions = {
  setIsLoggedIn: (isLoggingIn: boolean) => void;
  setWalletConnected: (walletConnected: boolean) => void;
  setNavigationSection: (section: string) => void;
  setLogout: () => void;
  setUserDetails: (userDetails: User) => void;
  setOpacity: (opacity: number) => void;
  setMobileMenuOpen: (mobileMenuOpen: boolean) => void;
  setFetchedUserDetails: (fetchedUserDetails: boolean) => void;
  reset: () => void;
};

type MyStore = State & Actions;

const initialState: State = {
  isLoggedIn: false,
  walletConnected: false,
  navigationSection: "DefiKids",
  logout: () => {},
  reset: () => void {},
  userDetails: {
    accountId: "",
    familyId: "",
    familyName: "",
    email: "",
    wallet: "",
    avatarURI: "",
    backgroundURI: "",
    defaultNetwork: TestnetNetworks.GOERLI,
    defaultNetworkType: NetworkType.TESTNET,
    username: "",
    termsAgreed: false,
    userType: UserType.UNREGISTERED,
    members: [],
    invitations: [],
    sandboxMode: undefined,
    permissions: {
      general: {
        avatar: PermissionType.ENABLED,
        email: PermissionType.ENABLED,
        username: PermissionType.ENABLED,
      },
    },
    balance: "",
  },
  opacity: 0,
  mobileMenuOpen: false,
  fetchedUserDetails: false,
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
  setUserDetails: (userDetails: User) => {
    set((state: { userDetails: User }) => {
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
  setFetchedUserDetails: (fetchedUserDetails: boolean) => {
    set((state: { fetchedUserDetails: boolean }) => {
      state.fetchedUserDetails = fetchedUserDetails;
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

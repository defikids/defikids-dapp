import { StoreApi, UseBoundStore } from "zustand";
import { createWithEqualityFn } from "zustand/traditional";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { shallow } from "zustand/shallow";
import { UserType } from "@/dataSchema/enums";
import { disconnect } from "@wagmi/core";
import { User, ChildDetails } from "@/dataSchema/types";
import { AccountStatus, AccountPackage } from "@/dataSchema/enums";

type State = {
  walletAddress: "";
  isLoggedIn: boolean;
  userType: UserType;
  navigationSection: string;
  logout: () => void;
  userDetails: User | ChildDetails;
  opacity: 0;
  mobileMenuOpen: boolean;
};

type Actions = {
  setWalletAddress: (walletAddress: string) => void;
  setIsLoggedIn: (isLoggingIn: boolean) => void;
  setUserType: (userType: UserType) => void;
  setNavigationSection: (section: string) => void;
  setLogout: () => void;
  setUserDetails: (userDetails: User | ChildDetails) => void;
  setOpacity: (opacity: number) => void;
  setMobileMenuOpen: (mobileMenuOpen: boolean) => void;
};

type MyStore = State & Actions;

const initialState: State = {
  walletAddress: "",
  isLoggedIn: false,
  userType: UserType.UNREGISTERED,
  navigationSection: "DefiKids",
  logout: () => {},
  userDetails: {
    account: {
      id: "",
      status: AccountStatus.INACTIVE,
      memberSince: 0,
      package: AccountPackage.BASIC,
    },
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
    if (window.location.pathname !== "/") {
      window.location.href = "/";
    }

    setTimeout(() => {
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
      disconnect();
    }, 100);
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

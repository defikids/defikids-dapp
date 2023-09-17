import {
  UserType,
  AccountStatus,
  AccountPackage,
  NetworkType,
  MainnetNetworks,
  TestnetNetworks,
} from "./enums";

export type ChildDetails = {
  familyName: string;
  familyId: string;
  email: string;
  username: string;
  avatarURI: string;
  backgroundURI: string;
  defaultNetwork: MainnetNetworks | TestnetNetworks;
  defaultNetworkType: NetworkType;
  opacity: {
    background: 1;
    card: 1;
  };
  userType: UserType;
  memberSince: number;
  wallet: string;
  sandboxMode: boolean;
  balance?: string;
};

export type User = {
  account: AccountDetails;
  familyId: string;
  familyName: string;
  email: string;
  wallet: string;
  avatarURI: string;
  backgroundURI: string;
  defaultNetwork: MainnetNetworks | TestnetNetworks;
  defaultNetworkType: NetworkType;
  opacity: {
    background: number;
    card: number;
  };
  username: string;
  termsAgreed: boolean;
  userType: UserType;
  emailVerified?: boolean;
  children?: string[];
  invitations?: string[];
};

export type AccountDetails = {
  id: string;
  status: AccountStatus;
  memberSince: number;
  package: AccountPackage;
  maxMembers?: number;
  expiry?: number; // timestamp in seconds
};

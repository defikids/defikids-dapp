import {
  UserType,
  AccountStatus,
  AccountPackage,
  NetworkType,
  MainnetNetworks,
  TestnetNetworks,
} from "./enums";

export type User = {
  account?: AccountDetails;
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
  termsAgreed?: boolean;
  userType: UserType;
  emailVerified?: boolean;
  sandboxMode: boolean;
  balance?: string;
  children?: string[];
  invitations?:
    | [
        {
          email: string;
          dateSent: number;
        }
      ]
    | [];
};

export type AccountDetails = {
  id: string;
  status: AccountStatus;
  memberSince: number;
  package: AccountPackage;
  maxMembers?: number;
  expiry?: number; // timestamp in seconds
};

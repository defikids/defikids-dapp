import { UserType, AccountStatus, AccountPackage } from "./enums";

export type ChildDetails = {
  familyId: string;
  email: string;
  username: string;
  avatarURI: string;
  backgroundURI: string;
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
  opacity: {
    background: number;
    card: number;
  };
  username: string;
  termsAgreed: boolean;
  userType: UserType;
  emailVerified?: boolean;
  children?: string[];
};

export type AccountDetails = {
  id: string;
  status: AccountStatus;
  memberSince: number;
  package: AccountPackage;
  maxMembers?: number;
  expiry?: number; // timestamp in seconds
};

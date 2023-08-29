import { UserType, AccountStatus, AccountPackage } from "./enums";

export type ChildDetails = {
  familyId: string;
  username: string;
  avatarURI: string;
  backgroundURI: string;
  userType: UserType;
  memberSince: number;
  wallet: string;
  sandboxMode: boolean;
  balance?: string;
};

export type User = {
  account: AccountDetails;
  familyId: string;
  wallet: string;
  avatarURI: string;
  backgroundURI: string;
  username: string;
  termsAgreed: boolean;
  userType: UserType;
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

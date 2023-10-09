import {
  UserType,
  AccountStatus,
  AccountPackage,
  NetworkType,
  MainnetNetworks,
  TestnetNetworks,
  PermissionType,
} from "./enums";
import { ObjectId } from "mongoose";

export type UserPermissions = {
  general: {
    avatar: PermissionType;
    email: PermissionType;
    username: PermissionType;
  };
};

export type User = {
  accountId?: ObjectId;
  permissions?: UserPermissions;
  familyId: string;
  familyName: string;
  email: string;
  wallet: string;
  avatarURI: string;
  backgroundURI: string;
  defaultNetwork: MainnetNetworks | TestnetNetworks;
  defaultNetworkType: NetworkType;

  username: string;
  termsAgreed?: boolean;
  userType: UserType;
  emailVerified?: boolean;
  sandboxMode: boolean | undefined;
  balance?: string;
  // children?: string[];
  // invitations?:
  //   | [
  //       {
  //         email: string;
  //         dateSent: number;
  //       }
  //     ]
  //   | [];
};

export type AccountDetails = {
  id: string;
  status: AccountStatus;
  memberSince: number;
  package: AccountPackage;
  maxMembers?: number;
  expiry?: number; // timestamp in seconds
};

import mongoose, { Schema, Document, model } from "mongoose";

import {
  UserType,
  NetworkType,
  MainnetNetworks,
  TestnetNetworks,
  PermissionType,
} from "@/data-schema/enums";

export interface IUser extends Document {
  accountId: mongoose.Schema.Types.ObjectId;
  email: string;
  wallet: string;
  avatarURI: string;
  defaultNetwork: MainnetNetworks | TestnetNetworks;
  defaultNetworkType: NetworkType;
  username: string;
  termsAgreed?: boolean;
  userType: UserType;
  emailVerified?: boolean;
  sandboxMode: boolean | undefined;
  balance?: string;
  permissions: PermissionType[];
}

const userSchema = new Schema<IUser>(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    email: {
      type: String,
      required: true,
    },
    wallet: {
      type: String,
      required: true,
    },
    avatarURI: {
      type: String,
    },
    defaultNetwork: {
      type: String,
      required: true,
    },
    defaultNetworkType: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    termsAgreed: {
      type: Boolean,
      required: true,
    },
    userType: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Boolean,
    },
    sandboxMode: {
      type: Boolean,
      required: true,
    },
    balance: {
      type: String,
    },
    permissions: [
      {
        type: String,
        enum: PermissionType,
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.models.User || model<IUser>("User", userSchema);

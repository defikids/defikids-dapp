import mongoose, { Schema, Document, model, ObjectId } from "mongoose";
import {
  UserType,
  NetworkType,
  MainnetNetworks,
  TestnetNetworks,
} from "@/data-schema/enums";

export interface IUser extends Document {
  accountId: ObjectId;
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
}

const userSchema = new Schema<IUser>(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    familyId: {
      type: String,
      required: true,
    },
    familyName: {
      type: String,
      required: true,
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
  },
  { timestamps: true }
);

export const User = mongoose.models.User || model<IUser>("User", userSchema);

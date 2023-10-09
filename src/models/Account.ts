import mongoose, { Schema, Document, model } from "mongoose";
import { AccountStatus, AccountPackage } from "@/data-schema/enums";

export interface IAccount extends Document {
  status: AccountStatus;
  memberSince: number;
  package: AccountPackage;
  maxMembers?: number;
  expiry?: number; // timestamp in seconds
}

const accountSchema = new Schema<IAccount>(
  {
    status: {
      type: String,
      enum: AccountStatus,
      required: true,
    },
    memberSince: {
      type: Number,
      required: true,
    },
    package: {
      type: String,
      enum: AccountPackage,
      required: true,
    },
    maxMembers: {
      type: Number,
    },
    expiry: {
      type: Number,
    },
  },
  { timestamps: true }
);

export const Account =
  mongoose.models.Account || model<IAccount>("Account", accountSchema);

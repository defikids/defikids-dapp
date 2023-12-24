import mongoose, { Schema, Document, model } from "mongoose";

export interface IWithdrawRequest extends Document {
  accountId: mongoose.Schema.Types.ObjectId;
  spender: string;
  owner: string;
  value: string;
  deadline: number;
  v: number;
  r: string;
  s: string;
  date: number;
}

const withdrawRequestSchema = new Schema<IWithdrawRequest>(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    spender: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    deadline: {
      type: Number,
      required: true,
    },
    v: {
      type: Number,
      required: true,
    },
    r: {
      type: String,
      required: true,
    },
    s: {
      type: String,
      required: true,
    },
    date: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const WithdrawRequest =
  mongoose.models.WithdrawRequest ||
  model<IWithdrawRequest>("WithdrawRequest", withdrawRequestSchema);

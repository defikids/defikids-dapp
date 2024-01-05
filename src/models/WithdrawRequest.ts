import mongoose, { Schema, Document, model } from "mongoose";

export enum WithdrawRequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface IWithdrawRequest extends Document {
  accountId: mongoose.Schema.Types.ObjectId;
  spender: string;
  owner: string;
  value: string;
  deadline: number;
  v: number;
  r: string;
  s: string;
  requestDate: number;
  withdrawDate?: number;
  status: WithdrawRequestStatus;
}

const withdrawRequestSchema = new Schema<IWithdrawRequest>({
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
  requestDate: {
    type: Number,
    required: true,
  },
  withdrawDate: {
    type: Number,
  },
  status: {
    type: String,
    enum: Object.values(WithdrawRequestStatus),
    default: WithdrawRequestStatus.PENDING,
    required: true,
  },
});

let WithdrawRequest: mongoose.Model<IWithdrawRequest>;

if (mongoose.models && mongoose.models.WithdrawRequest) {
  WithdrawRequest = mongoose.model<IWithdrawRequest>("WithdrawRequest");
} else {
  WithdrawRequest = model<IWithdrawRequest>(
    "WithdrawRequest",
    withdrawRequestSchema
  );
}

export { WithdrawRequest };

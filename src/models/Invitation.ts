import mongoose, { Schema, Document, model } from "mongoose";

export interface IInvitation extends Document {
  accountId: mongoose.Schema.Types.ObjectId;
  date: number;
  email: string;
  token: string;
}

const invitationSchema = new Schema<IInvitation>(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    date: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Invitation =
  mongoose.models.Invitation ||
  model<IInvitation>("Invitation", invitationSchema);

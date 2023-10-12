import mongoose, { Schema, Document, model } from "mongoose";

export interface IActivity extends Document {
  accountId: mongoose.Schema.Types.ObjectId;
  wallet: string;
  date: number;
  type: string;
}

const activitySchema = new Schema<IActivity>(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    wallet: {
      type: String,
      required: true,
    },
    date: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Activity =
  mongoose.models.Activity || model<IActivity>("Activity", activitySchema);

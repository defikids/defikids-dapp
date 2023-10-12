import { getAllActivity } from "@/services/mongo/database";
import mongoose from "mongoose";
import { IActivity } from "@/models/Activity";

export const getActivityByAccount = async (
  accountId: mongoose.Schema.Types.ObjectId
) => {
  const allActivity = (await getAllActivity()) as IActivity[];
  const activityByAccount = allActivity.filter((invite) => {
    if (invite.accountId === accountId) {
      return invite;
    }
  });
  const sortedActivity = activityByAccount.sort(
    (a, b) => b.date - a.date
  ) as IActivity[];

  return sortedActivity;
};

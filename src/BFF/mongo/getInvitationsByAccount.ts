import { getAllInvitations } from "@/services/mongo/routes/invitation";
import { IInvitation } from "@/models/Invitation";
import mongoose from "mongoose";

export const getInvitationsByAccount = async (
  accountId: mongoose.Schema.Types.ObjectId
) => {
  const allInvitations = (await getAllInvitations()) as IInvitation[];
  const invitesByAccount = allInvitations.filter((invite) => {
    if (invite.accountId === accountId) {
      return invite;
    }
  });
  const sortedInvites = invitesByAccount.sort(
    (a, b) => b.date - a.date
  ) as IInvitation[];

  return sortedInvites;
};

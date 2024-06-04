import { IUser } from "@/models/User";
import { User } from "@/data-schema/types";
import { getAllUsers } from "@/services/mongo/routes/user";
import { UserType } from "@/data-schema/enums";
import mongoose from "mongoose";

export const getParentDetailsByUserAccount = async (
  accountId: mongoose.Schema.Types.ObjectId
) => {
  const users = (await getAllUsers()) as IUser[];
  const members = users.filter((user) => {
    if (user.accountId === accountId && user.userType === UserType.PARENT) {
      return {
        email: user.email,
        wallet: user.wallet,
        avatarURI: user.avatarURI,
        defaultNetwork: user.defaultNetwork,
        defaultNetworkType: user.defaultNetworkType,
        username: user.username,
        termsAgreed: user.termsAgreed,
        userType: user.userType,
        emailVerified: user.emailVerified,
        sandboxMode: user.sandboxMode,
        balance: user.balance,
      };
    }
  }) as unknown as User[];

  return members;
};

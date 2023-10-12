import { IUser } from "@/models/User";
import { User } from "@/data-schema/types";
import { getAllUsers } from "@/services/mongo/database";
import { UserType } from "@/data-schema/enums";
import mongoose from "mongoose";

export const getFamilyMembers = async (
  accountId: mongoose.Schema.Types.ObjectId,
  includeParent?: boolean
) => {
  const users = (await getAllUsers()) as IUser[];
  const members = users.filter((user) => {
    const checkForParent = () => {
      if (includeParent) {
        return true;
      }
      return user.userType !== UserType.PARENT;
    };

    if (user.accountId === accountId && checkForParent()) {
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

import { IUser } from "@/models/User";
import { ObjectId } from "mongodb";
import { User } from "@/data-schema/types";
import { getAllUsers } from "@/services/mongo/database";
import { UserType } from "@/data-schema/enums";

export const getFamilyMembers = async (accountId: "") => {
  const users = (await getAllUsers()) as IUser[];
  const members = users.filter((user) => {
    if (
      String(user.accountId) === accountId &&
      user.userType === UserType.PARENT
    ) {
      return {
        familyId: user.familyId,
        familyName: user.familyName,
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
  }) as User[];

  return members;
};

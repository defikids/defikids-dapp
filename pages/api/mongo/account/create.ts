import type { NextApiRequest, NextApiResponse } from "next";
import { Account, IAccount } from "@/models/Account";
import { User } from "@/models/User";
import dbConnect from "@/services/mongo/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const wallet = req.query.wallet as string;

    await dbConnect();
    const user = await User.findOne({ wallet });

    if (user) {
      res.status(400).json({ error: "Account already exists" });
    } else {
      const account: IAccount = await Account.create(new Account(req.body));
      res.json(account);
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error saving account: ${(error as Error).message}` });
  }
}

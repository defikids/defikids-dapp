import type { NextApiRequest, NextApiResponse } from "next";
import { Account, IAccount } from "@/models/Account";
import dbConnect from "@/services/mongo/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();
    const account: IAccount = await Account.create(new Account(req.body));

    res.json(account);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error saving account: ${(error as Error).message}` });
  }
}

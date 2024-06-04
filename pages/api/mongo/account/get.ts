import type { NextApiRequest, NextApiResponse } from "next";
import { Account } from "@/models/Account";
import dbConnect from "@/services/mongo/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();

    const { _id } = req.query as { _id: string };

    const account = await Account.findOne({ _id });

    if (!account) {
      res.status(404).json({ message: "Account not found" });
      return;
    }

    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({
      error: `Error fetching account: ${(error as Error).message}`,
    });
  }
}

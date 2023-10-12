import type { NextApiRequest, NextApiResponse } from "next";
import { Account } from "@/models/Account";
import dbConnect from "@/services/mongo/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();

    const accounts = await Account.find({});

    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({
      error: `Error fetching accounts: ${(error as Error).message}`,
    });
  }
}

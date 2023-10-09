import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/models/User";
import dbConnect from "@/services/mongo/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();

    const walletAddress = req.query.walletAddress || req.body.walletAddress;

    const user = await User.findOne({ wallet: walletAddress });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      error: `Error fetching user: ${(error as Error).message}`,
    });
  }
}

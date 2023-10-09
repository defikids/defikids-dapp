import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/models/User";
import dbConnect from "@/services/mongo/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();

    const users = await User.find({});

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      error: `Error fetching user: ${(error as Error).message}`,
    });
  }
}

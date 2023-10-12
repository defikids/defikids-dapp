import type { NextApiRequest, NextApiResponse } from "next";
import { Activity } from "@/models/Activity";
import dbConnect from "@/services/mongo/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();

    const activity = await Activity.find({});

    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({
      error: `Error fetching activity: ${(error as Error).message}`,
    });
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import { Activity, IActivity } from "@/models/Activity";
import dbConnect from "@/services/mongo/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();

    const activity: IActivity = await Activity.create(new Activity(req.body));

    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({
      error: `Error creating activity: ${(error as Error).message}`,
    });
  }
}

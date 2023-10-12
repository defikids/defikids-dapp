import type { NextApiRequest, NextApiResponse } from "next";
import { Invitation } from "@/models/Invitation";
import dbConnect from "@/services/mongo/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();

    const invitations = await Invitation.find({});

    res.status(200).json(invitations);
  } catch (error) {
    res.status(500).json({
      error: `Error fetching invitations: ${(error as Error).message}`,
    });
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import { Invitation } from "@/models/Invitation";
import dbConnect from "@/services/mongo/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();

    const { accountId, email } = req.query;

    const invitation = await Invitation.findOne({ accountId, email });

    if (!invitation) {
      res.status(404).json({ message: "Invitation not found" });
      return;
    }

    res.status(200).json(invitation);
  } catch (error) {
    res.status(500).json({
      error: `Error fetching invitation: ${(error as Error).message}`,
    });
  }
}

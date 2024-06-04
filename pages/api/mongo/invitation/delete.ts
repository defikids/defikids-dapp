import { NextApiRequest, NextApiResponse } from "next";
import { Invitation } from "@/models/Invitation";
import dbConnect from "@/services/mongo/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();

    const deletedInvitation = await Invitation.findByIdAndDelete(req.body.id);

    if (!deletedInvitation) {
      res.status(404).json({ error: "Invitation not found" });
    } else {
      res.json({ success: "Successfully deleted" });
    }
  } catch (error) {
    console.log(`Error deleting invitation: ${(error as Error).message}`);
    res.status(500).json({ error: "Something went wrong" });
  }
}

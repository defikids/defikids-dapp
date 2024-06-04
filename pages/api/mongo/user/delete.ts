import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/models/User";
import dbConnect from "@/services/mongo/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();

    const deletedUser = await User.findByIdAndDelete(req.body.id);

    if (!deletedUser) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.json({ success: "Successfully deleted" });
    }
  } catch (error) {
    console.log(`Error deleting user: ${(error as Error).message}`);
    res.status(500).json({ error: "Something went wrong" });
  }
}

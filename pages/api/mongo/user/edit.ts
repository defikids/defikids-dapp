import { NextApiRequest, NextApiResponse } from "next";
import { User, IUser } from "@/models/User";
import dbConnect from "@/services/mongo/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();
    const { _id, permissions } = req.body as IUser;

    const result = await User.updateOne({ _id }, permissions);

    if (result.modifiedCount) {
      res.json(result.modifiedCount);
    } else {
      res.json({ error: "Something went wrong" });
    }
  } catch (error) {
    res.status(500).json({
      error: `Error updating use: ${(error as Error).message}`,
    });
  }
}

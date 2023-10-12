import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/models/User";
import dbConnect from "@/services/mongo/dbConnect";
import mongoose from "mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();
    const { _id } = req.query as { _id: string };
    const id = _id as unknown as mongoose.Schema.Types.ObjectId;

    const result = await User.updateOne({ accountId: id }, req.body);

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

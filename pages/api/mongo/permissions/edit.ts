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
    const { _id, wallet } = req.query as { _id: string; wallet: string };
    const id = _id as unknown as mongoose.Schema.Types.ObjectId;

    const result = await User.updateOne(
      { accountId: id, wallet },
      { $set: { permissions: req.body.permissions } }
    );

    if (result.modifiedCount) {
      res.json(result.modifiedCount);
    } else {
      res.json({ error: "Something went wrong updating permissions" });
    }
  } catch (error) {
    res.status(500).json({
      error: `Error updating permissions: ${(error as Error).message}`,
    });
  }
}

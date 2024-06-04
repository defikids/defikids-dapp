import type { NextApiRequest, NextApiResponse } from "next";
import { User, IUser } from "@/models/User";
import dbConnect from "@/services/mongo/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();
    const user: IUser = await User.create(new User(req.body));

    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error saving user: ${(error as Error).message}` });
  }
}

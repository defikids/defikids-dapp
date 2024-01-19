import type { NextApiRequest, NextApiResponse } from "next";
import { WithdrawRequest } from "@/models/WithdrawRequest";
import dbConnect from "@/services/mongo/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();

    const withdrawRequests = await WithdrawRequest.find({});

    res.status(200).json(withdrawRequests);
  } catch (error) {
    res.status(500).json({
      error: `Error fetching withdraw requests: ${(error as Error).message}`,
    });
  }
}

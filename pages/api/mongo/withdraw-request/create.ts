import type { NextApiRequest, NextApiResponse } from "next";
import { WithdrawRequest, IWithdrawRequest } from "@/models/WithdrawRequest";
import dbConnect from "@/services/mongo/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();
    const request: IWithdrawRequest = await WithdrawRequest.create(
      new WithdrawRequest(req.body)
    );

    res.json(request);
  } catch (error) {
    res.status(500).json({
      error: `Error saving withdraw request: ${(error as Error).message}`,
    });
  }
}

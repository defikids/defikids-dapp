import { NextApiRequest, NextApiResponse } from "next";
import { WithdrawRequest } from "@/models/WithdrawRequest";
import dbConnect from "@/services/mongo/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();

    const deletedRequest = await WithdrawRequest.findByIdAndDelete(req.body.id);

    if (!deletedRequest) {
      res.status(404).json({ error: "Withdraw Request not found" });
    } else {
      res.json({ success: "Successfully deleted" });
    }
  } catch (error) {
    console.log(`Error deleting withdraw request: ${(error as Error).message}`);
    res.status(500).json({ error: "Something went wrong" });
  }
}

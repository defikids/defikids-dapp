import type { NextApiRequest, NextApiResponse } from "next";
import { Invitation, IInvitation } from "@/models/Invitation";
import dbConnect from "@/services/mongo/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();

    const { accountId, date, email, token } = req.body;

    const invitationPayload = {
      accountId,
      date,
      email,
      token,
    };

    const invite: IInvitation = await Invitation.create(
      new Invitation(invitationPayload)
    );

    res.status(200).json(invite);
  } catch (error) {
    res.status(500).json({
      error: `Error creating invitation: ${(error as Error).message}`,
    });
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import inviteMemberHTML from "@/data/emails/inviteMember";
import sgMail, { MailDataRequired } from "@sendgrid/mail";
import jwt from "jsonwebtoken";

export default async function inviteMember(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { parentAddress, sandboxMode, familyId, familyName, email } =
      req.body as {
        parentAddress: string;
        sandboxMode: boolean;
        familyId: string;
        familyName: string;
        email: string;
      };

    const token = jwt.sign(
      {
        parentAddress,
        sandboxMode,
        familyId,
        familyName,
        email,
      },
      process.env.JWT_SECRET || "",
      {
        expiresIn: "24hr",
        jwtid: Date.now().toString(),
      }
    );

    sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");
    const msg = {
      to: email,
      from: process.env.SENDGRID_TRANSPORTER_EMAIL_ADDRESS,
      subject: "New Member Invitaton",
      text: `${familyName} has invited you to DefiKids`,
      html: inviteMemberHTML(token, familyName),
    } as MailDataRequired;

    sgMail
      .send(msg)
      .then(() => {
        console.log(`Employee Invite email successfully sent to ${email}`);
      })
      .catch((error) => {
        console.error(error.response.body);
      });

    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

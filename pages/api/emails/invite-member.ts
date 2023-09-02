import { NextApiRequest, NextApiResponse } from "next";
import inviteMemberHTML from "@/data/emails/inviteMember";
import sgMail from "@sendgrid/mail";
import jwt from "jsonwebtoken";

export default async function inviteMember(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { email, firstName, lastName, familyId } = req.body;

    const token = jwt.sign({ familyId }, process.env.JWT_SECRET, {
      expiresIn: "48hr",
    });

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: process.env.SENDGRID_TRANSPORTER_EMAIL_ADDRESS,
      subject: "DefiKids: New Member Invitaton.",
      text: `${firstName} ${lastName} has invited you to DefiKids`,
      html: inviteMemberHTML(token, firstName, lastName),
    };

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

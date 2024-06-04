import { NextApiRequest, NextApiResponse } from "next";
import sgMail, { MailDataRequired } from "@sendgrid/mail";
import confirmEmailAddressHTML from "@/data/emails/confirmEmailAddress";
import jwt from "jsonwebtoken";

export default async function confirmEmail(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username, email, walletAddress } = req.body;

  const token = jwt.sign({ walletAddress }, process.env.JWT_SECRET || "", {
    expiresIn: "48hr",
  });

  sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");
  const msg = {
    to: email,
    from: process.env.SENDGRID_TRANSPORTER_EMAIL_ADDRESS,
    subject: "Email Confirmation Request",
    html: confirmEmailAddressHTML(username, token),
  } as MailDataRequired;
  sgMail
    .send(msg)
    .then(() => {
      res
        .status(200)
        .json({ message: `Sent email confirmation request to ${email}.` });
    })
    .catch((error) => {
      console.error(error.response.body);
      res.status(500).json({ error: error.response.body });
    });
}

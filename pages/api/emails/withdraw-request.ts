import { NextApiRequest, NextApiResponse } from "next";
import withdrawRequestHTML from "@/data/emails/withdrawRequest";
import sgMail, { MailDataRequired } from "@sendgrid/mail";

export default async function WithdrawRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { token, email, username, amount } = req.body as {
      token: string;
      email: string;
      username: string;
      amount: string;
    };

    console.log("Sending withdraw request email to", email);
    console.log("Token", token);
    console.log("Username", username);
    console.log("Amount", amount);

    sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");
    const msg = {
      to: email,
      from: process.env.SENDGRID_TRANSPORTER_EMAIL_ADDRESS,
      subject: "DefiKids - Member withdrawal request",
      text: `${username} has requested to withdraw funds.`,
      html: withdrawRequestHTML(token, username, "7", amount),
    } as MailDataRequired;

    sgMail
      .send(msg)
      .then(() => {
        console.log(`Withdraw request email successfully sent to ${email}`);
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

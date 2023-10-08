import { kv } from "@vercel/kv";
import { NextApiRequest, NextApiResponse } from "next";

//https://redis.io/commands/hset/

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { key, value } = req.query as unknown as {
      key: string;
      value: string;
    };

    // value = "<walletAddress>::<eventDescription>"

    const data = await kv.hset(`activity::${key}`, {
      [Math.floor(Date.now() / 1000)]: value,
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "An error occurred" });
  }
}

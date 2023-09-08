import { kv } from "@vercel/kv";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { key, value } = req.query as {
      key: string;
      value: string;
    };

    console.log("key", key);
    console.log("value", value);

    const result = await kv.set(key, value);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "An error occurred" });
  }
}

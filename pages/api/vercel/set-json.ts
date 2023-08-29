import { kv } from "@vercel/kv";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { key, value } = req.body as {
      key: string;
      value: string;
    };

    const formatted = JSON.stringify(value);
    const result = await kv.json.set(key, "$", formatted);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "An error occurred" });
  }
}

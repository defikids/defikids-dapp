import pinataSDK from "@pinata/sdk";

import dotenv from "dotenv";
dotenv.config();

export async function unpin({ hash }: { hash: string }) {
  console.log("hash", hash);
  const PINATA_KEY = process.env.PINATA_KEY;
  const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

  const pinata = new pinataSDK(PINATA_KEY, PINATA_SECRET_KEY);

  try {
    const result = await pinata.unpin(hash);
    return result;
  } catch (error) {
    console.error("Error unpinning file on IPFS:", error);
    return { mediaError: "Internal Server Error" };
  }
}

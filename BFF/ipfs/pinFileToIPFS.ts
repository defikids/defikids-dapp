import pinataSDK from "@pinata/sdk";

import dotenv from "dotenv";
dotenv.config();

export async function pinFileToIPFS({
  payload,
  fileName,
}: {
  payload: any;
  fileName: string;
}) {
  const PINATA_KEY = process.env.PINATA_KEY;
  const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

  const pinata = new pinataSDK(PINATA_KEY, PINATA_SECRET_KEY);

  try {
    const options = {
      pinataMetadata: {
        name: fileName || "Untitled",
      },
    };

    const result = await pinata.pinFileToIPFS(payload, options);
    return { mediaHash: result.IpfsHash };
  } catch (error) {
    console.error("Error uploading file to IPFS:", error);
    return { mediaError: "Internal Server Error" };
  }
}

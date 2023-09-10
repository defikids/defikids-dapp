import { NextApiRequest, NextApiResponse } from "next";
import { unpin } from "@/BFF/ipfs/unpin";

export default async function unpinFromIpfsRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { ipfsHash } = req.query as { ipfsHash: string };
  console.log("ipfsHash - req.query", ipfsHash);

  try {
    const result = await unpin({ hash: ipfsHash });
    return res.status(200).json({ success: true });
  } catch (error) {
    if (error.reason === "CURRENT_USER_HAS_NOT_PINNED_CID") {
      return res.status(200).json({ success: true });
    } else {
      console.error("Error unpinning file on IPFS:", error);
      return { mediaError: "Internal Server Error" };
    }
  }
}

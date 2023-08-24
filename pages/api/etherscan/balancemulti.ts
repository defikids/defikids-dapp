import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";

export default async function uploadToIpfsRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { addresses } = req.body;

    if (!Array.isArray(addresses) || addresses.length === 0) {
      return res.status(400).json({ error: "Invalid addresses data" });
    }

    const apiKey = process.env.ETHERSCAN_API_KEY;

    const endpoint = `https://api-goerli.etherscan.io/api?module=account&action=balancemulti&address=${addresses.join(
      ","
    )}&tag=latest&apikey=${apiKey}`;

    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(
        `Etherscan API request failed with status: ${response.status}`
      );
    }

    const data = await response.json();

    const normalizedData = data.result.map((item: any) => {
      return {
        balance: Number(ethers.utils.formatEther(item.balance)).toFixed(4),
        account: item.account,
      };
    });

    res.status(200).json(normalizedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

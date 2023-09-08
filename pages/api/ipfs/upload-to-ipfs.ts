import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { Readable } from "stream";
import { pinFileToIPFS } from "@/BFF/ipfs/pinFileToIPFS";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // Disable built-in body parsing
  },
};

export default async function uploadToIpfsRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  // parse form data
  const form = new formidable.IncomingForm({
    multiples: true,
    maxFileSize: 500 * 1024 * 1024, // (500MB)
  });

  const formData = new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files });
    });
  });

  //---------------------
  // Parse form data
  //---------------------
  const { files, fields } = (await formData) as {
    files: formidable.Files;
    fields: formidable.Fields;
  };

  const uploadedFile = files.file as formidable.File;
  const { description } = fields;

  const { filepath, size } = uploadedFile;
  const imageFileSize = size as number;

  //---------------------
  // Generate Readable Streams
  //---------------------
  const generateAssetReadableStream = async (assetPath: string) => {
    if (!assetPath) return { byteLength: 0, readStream: null };

    const buffer = await fs.promises.readFile(assetPath);
    const { byteLength } = buffer;

    const readStream = new Readable();
    readStream.push(buffer);
    readStream.push(null);

    return { byteLength, readStream };
  };

  const fileReadStreams = {} as {
    imageReadStream?: Readable | null;
  };

  if (filepath) {
    const { readStream: imageReadStream } = await generateAssetReadableStream(
      filepath
    );
    fileReadStreams.imageReadStream = imageReadStream;
  }

  //---------------------
  // Validation
  //---------------------
  if (imageFileSize && imageFileSize > 400 * 1024 * 1024) {
    return res
      .status(400)
      .json({ validationError: "Image file too large", ifpsHash: "" });
  }

  //---------------------
  // Image upload to IPFS
  //---------------------

  let imageHash = undefined;
  if (fileReadStreams.imageReadStream) {
    // return the IPFS hash of the uploaded image
    const { mediaHash, mediaError: imageError } = await pinFileToIPFS({
      payload: fileReadStreams.imageReadStream,
      // @ts-ignore
      fileName: `DefiKids-${description}-${String(
        uploadedFile.originalFilename.split(".")[0]
      )}`,
    });
    if (imageError) {
      return res.status(500).json(imageError);
    }

    imageHash = mediaHash;
  }

  return res.status(200).json({ validationError: "", ifpsHash: imageHash });
}

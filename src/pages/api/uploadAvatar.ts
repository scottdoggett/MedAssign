import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

// ✅ Disable Next.js default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// ✅ Handle file upload & renaming
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const form = new IncomingForm({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Error parsing file upload." });
    }

    const memberID = fields.id?.[0]; // ✅ Extract staff ID correctly
    const file = files.file?.[0]; // ✅ Ensure file exists

    if (!memberID || !file) {
      return res.status(400).json({ error: "Missing file or member ID." });
    }

    const uploadsDir = path.join(process.cwd(), "public", "headshots");
    const newFilePath = path.join(uploadsDir, `${memberID}.jpeg`);
    const backupFilePath = path.join(uploadsDir, `${memberID}Old.jpeg`);

    try {
      // ✅ Rename old image (if it exists)
      if (fs.existsSync(newFilePath)) {
        fs.renameSync(newFilePath, backupFilePath);
      }

      // ✅ Move the uploaded file (use `file.filepath`)
      fs.copyFileSync(file.filepath, newFilePath);
      fs.unlinkSync(file.filepath); // ✅ Delete temp file

      return res.status(200).json({ message: "Avatar uploaded successfully." });
    } catch (error) {
      console.error("Error saving uploaded file:", error);
      return res.status(500).json({ error: "Error saving uploaded file." });
    }
  });
}

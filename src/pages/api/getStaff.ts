import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // ✅ Read latest staff data from file
  const staffFilePath = path.join(process.cwd(), "src/data/staff.json");

  if (!fs.existsSync(staffFilePath)) {
    return res.status(404).json({ message: "Staff data not found" });
  }

  const staffData = JSON.parse(fs.readFileSync(staffFilePath, "utf-8"));

  // ✅ Prevent caching
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.status(200).json(staffData);
}

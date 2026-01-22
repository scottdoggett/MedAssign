import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Read the latest schedules from file instead of importing a static JSON
  const schedulesFilePath = path.join(process.cwd(), "src/data/schedules.json");

  if (!fs.existsSync(schedulesFilePath)) {
    return res.status(404).json({ message: "Schedules not found" });
  }

  const schedulesData = JSON.parse(fs.readFileSync(schedulesFilePath, "utf-8"));

  // Prevent Next.js from caching this response
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.status(200).json(schedulesData);
}

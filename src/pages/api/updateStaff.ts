import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

// Path to the JSON file
const filePath = path.join(process.cwd(), "src/data/staff.json");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const updatedStaff = req.body; // Receive updated staff list

      if (!Array.isArray(updatedStaff)) {
        return res.status(400).json({ error: "Invalid staff data format" });
      }

      // Load the existing full JSON data
      const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      // Replace only the "staff" section
      jsonData.staff = updatedStaff;

      // Write the updated JSON back to the file, preserving all other sections
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

      res.status(200).json({ message: "Staff updated successfully" });
    } catch (error) {
      console.error("Error updating staff data:", error);
      res.status(500).json({ error: "Error updating staff data" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
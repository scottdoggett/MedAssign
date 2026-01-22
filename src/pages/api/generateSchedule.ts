import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { execFile } from "child_process";

interface StaffMember {
  ID: number;
  Name: string;
  SeniorityLevel: number;
  PreferredShifts: Array<{ shift: string; weight: number }>;
  DaysOff: Array<{ day: string; weight: number }>;
  schedule?: string[];
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Set file paths
    const staffFilePath = path.join(process.cwd(), "src/data/staff.json");
    const properStaffFilePath = path.join(process.cwd(), "src/data/properStaff.json");
    const schedulesFilePath = path.join(process.cwd(), "src/data/schedules.json");

    // Read and parse staff.json
    const staffData = JSON.parse(fs.readFileSync(staffFilePath, "utf-8"));

    // Remove "schedule" property from each staff member
    staffData.staff = staffData.staff.map((member: StaffMember) => {
      if (member.hasOwnProperty("schedule")) {
        delete member.schedule;
      }
      return member;
    });

    // Save the modified staff.json
    fs.writeFileSync(properStaffFilePath, JSON.stringify(staffData, null, 2));

    // Run the Python script and wait for completion
    const pythonScript = path.join(process.cwd(), "src/solver/main.py");
    const dataFile = path.join(process.cwd(), "src/data/properStaff.json");

    execFile("python3", [pythonScript, dataFile], (error, stdout, stderr) => {
      if (error) {
        console.error("Error running script:", error);
        return res.status(500).json({ error: "Failed to generate schedule", details: stderr });
      }

      // Ensure `schedules.json` is updated before returning response
      let attempts = 0;
      const MAX_ATTEMPTS = 20; // 10 seconds total
      const checkFileUpdate = setInterval(() => {
        if (fs.existsSync(schedulesFilePath)) {
          clearInterval(checkFileUpdate);
          res.status(200).json({ message: "Schedule generated successfully", output: stdout });
        } else if (++attempts >= MAX_ATTEMPTS) {
          clearInterval(checkFileUpdate);
          res.status(500).json({ error: "Schedule generation timeout" });
        }
      }, 500); // Check every 500ms
    });
  } catch (error) {
    console.error("Error processing schedule:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

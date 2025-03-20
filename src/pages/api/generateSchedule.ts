import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { exec } from "child_process";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // ✅ Locate staff.json
    const staffFilePath = path.join(process.cwd(), "src/data/staff.json");
    const properStaffFilePath = path.join(process.cwd(), "src/data/properStaff.json");
    const schedulesFilePath = path.join(process.cwd(), "src/data/schedules.json");

    // ✅ Read and parse staff.json
    const staffData = JSON.parse(fs.readFileSync(staffFilePath, "utf-8"));

    // ✅ Remove "schedule" property from each staff member
    staffData.staff = staffData.staff.map((member: any) => {
      if (member.hasOwnProperty("schedule")) {
        console.log(`Removing schedule for Staff ID ${member.ID}`);
        delete member.schedule; // ✅ Correct key casing
      }
      return member;
    });

    // ✅ Save the modified staff.json
    fs.writeFileSync(properStaffFilePath, JSON.stringify(staffData, null, 2));

    console.log("✅ Updated staff.json after schedule removal:", staffData);

    // ✅ Run the Python script and wait for completion
    const pythonCommand = `python3 src/solver/main.py src/data/properStaff.json`;
    exec(pythonCommand, (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Error running script:", error);
        return res.status(500).json({ error: "Failed to generate schedule", details: stderr });
      }

      console.log("✅ Python script output:", stdout);

      // ✅ Ensure `schedules.json` is updated before returning response
      const checkFileUpdate = setInterval(() => {
        if (fs.existsSync(schedulesFilePath)) {
          clearInterval(checkFileUpdate);
          res.status(200).json({ message: "Schedule generated successfully", output: stdout });
        }
      }, 500); // Check every 500ms
    });
  } catch (error) {
    console.error("❌ Error processing schedule:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

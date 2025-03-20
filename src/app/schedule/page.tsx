"use client";
// @ts-ignore
import domToImage from "dom-to-image-more";
import { Download, CalendarCog } from "lucide-react"; // Import Download icon
import React, { useState, useRef, useEffect } from "react"; // 🟢 Add `useRef`
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DateNavigation from "@/components/ui/DateNavigation";
import { format, addDays } from "date-fns";
import { useStaff, StaffMember } from "@/context/StaffContext";


export default function SchedulePage() {
  const { staffData, setStaffData } = useStaff();
  const [updatedStaff, setUpdatedStaff] = useState(staffData);
  useEffect(() => {
    setUpdatedStaff(staffData); // ✅ Reacts to changes
  }, [staffData]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const scheduleRef = useRef<HTMLDivElement>(null); // 🟢 Reference for the schedule grid
  const [date, setDate] = useState<Date>(new Date());

  const handleGenerateSchedule = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
        // ✅ Step 1: Generate the new schedule
        const response = await fetch("/api/generateSchedule", { method: "POST" });

        if (!response.ok) {
            throw new Error("Failed to generate schedule.");
        }

        // ✅ Step 2: Wait until `schedules.json` is updated
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2s before fetching

        let schedulesJson;
        let retries = 5;
        while (retries > 0) {
            const schedulesResponse = await fetch("/api/getSchedules");
            schedulesJson = await schedulesResponse.json();
            if (Object.keys(schedulesJson).length > 0) break; // ✅ Stop retrying if data is found
            retries--;
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s before retrying
        }

        if (!schedulesJson) {
            throw new Error("Failed to fetch updated schedules.");
        }

        // ✅ Step 3: Fetch latest staff data
        const staffResponse = await fetch("/api/getStaff");
        const staffJson = await staffResponse.json();

        // ✅ Step 4: Merge updated schedules into staff data
        const updatedStaff = staffJson.staff.map((staff: StaffMember) => ({
            ...staff,
            schedule: schedulesJson[staff.ID] || {}, // ✅ Assign new schedule if exists
        }));

        // ✅ Step 5: Update UI immediately
        setStaffData(updatedStaff);

        // ✅ Step 6: Persist updated staff list
        const responseSave = await fetch("/api/updateStaff", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedStaff),
        });

        if (!responseSave.ok) {
            throw new Error("Failed to save updated staff data.");
        }

        setSuccess(true);
    } catch (err) {
        console.error("Error:", err);
        setError("An error occurred while generating the schedule.");
    } finally {
        setLoading(false);
    }
};


  const handleSaveSchedule = async () => {
    if (!scheduleRef.current) return;

    try {
      // ✅ Save original styles to restore after capturing
      const originalHeight = scheduleRef.current.style.height;
      const originalOverflow = scheduleRef.current.style.overflow;

      // ✅ Expand the grid to capture the full content
      scheduleRef.current.style.height = `${scheduleRef.current.scrollHeight}px`;
      scheduleRef.current.style.overflow = "visible";

      // ✅ Generate image with full content
      const blob = await domToImage.toBlob(scheduleRef.current, {
        bgcolor: "#ffffff",
        quality: 1,
        width: scheduleRef.current.scrollWidth,
        height: scheduleRef.current.scrollHeight,
      });

      // ✅ Restore the original styles
      scheduleRef.current.style.height = originalHeight;
      scheduleRef.current.style.overflow = originalOverflow;

      // ✅ Create a link and download the image
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Schedule_${format(date, "yyyy-MM-dd")}.png`;
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header Row with Save Button */}
      <div className="flex items-center justify-between w-full">
        {/* Title aligned to the left with whitespace-nowrap to prevent wrapping */}
        <h1 className="text-5xl font-bold whitespace-nowrap">Schedule View</h1>

        {/* Centered Date Navigation */}
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-5">
          <DateNavigation date={date} setDate={setDate} />
        </div>

        {/* Right-aligned buttons container */}
        <div className="flex gap-4 mt-5">
          {/* Generate Schedule Button */}
          <button
            onClick={handleGenerateSchedule} // ✅ Calls the function properly
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
          >
            <CalendarCog className="w-5 h-5" />
            {loading ? "Generating..." : "Generate Schedule"}
          </button>

          {/* Save Button */}
          <button
            onClick={handleSaveSchedule}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Save
          </button>
        </div>
      </div>

      <div className="mb-8"></div>

      {/* Scrollable container for the grid */}
      <div
        ref={scheduleRef}
        className="overflow-y-auto max-h-[calc(100vh-180px)] border border-gray-200"
      >
        {/* Grid Container */}
        <div className="grid grid-cols-[1.7fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-0 border border-gray-200">
          {/* 🟢 Sticky Top Row (Dates) */}
          <div className="p-4 pl-6 border border-gray-300 text-lg font-semibold bg-gray-100 flex items-center justify-start sticky top-0 z-10">
            Members
          </div>
          {Array.from({ length: 7 }).map((_, index) => {
            const currentDate = addDays(date, index);
            const formattedDate = format(currentDate, "yyyy-MM-dd");

            return (
              <div
                key={formattedDate}
                className="p-4 border border-gray-300 bg-gray-100 flex flex-row items-center sticky top-0 z-10"
              >
                <span className="text-3xl font-bold">
                  {format(currentDate, "dd")}
                </span>
                <div className="flex flex-col ml-2">
                  <span className="text-sm text-gray-600 border border-gray-100">
                    {format(currentDate, "EEE")}
                  </span>
                  <span className="text-xs text-gray-400 border border-gray-100">
                    {format(currentDate, "MMM")}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Staff Names & Shifts */}
          {updatedStaff.map((person, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {/* Staff Name Column - Avatar + Name */}
              <div className="p-4 border border-gray-300 text-left bg-gray-50 flex items-center space-x-3">
                <Avatar>
                  <AvatarImage
                    src={`/headshots/${person.ID}.jpeg`} // ✅ Uses only staff ID for images
                    onError={(e) =>
                      (e.currentTarget.src = "/headshots/default.jpeg")
                    }
                    alt={person.Name}
                  />
                  <AvatarFallback>{person.Name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col leading-tight">
                  <p className="font-semibold text-lg border border-gray-50">
                    {person.Name}
                  </p>
                  <p className="text-sm text-gray-500 border border-gray-50">
                    {person.Seniority.charAt(0).toUpperCase() +
                      person.Seniority.slice(1)}
                  </p>
                </div>
              </div>

              {/* Shift Cells */}
              {Array.from({ length: 7 }).map((_, colIndex) => {
                const currentDate = addDays(date, colIndex);
                const formattedDate = format(currentDate, "yyyy-MM-dd");

                // 🔹 Ensure `schedule` exists in each staff member
                const shift = person.schedule?.[formattedDate] ?? "No Shift";

                return (
                  <div
                    key={`shift-${rowIndex}-${colIndex}`}
                    className="relative p-4 border border-gray-300 min-h-[100px] flex items-center justify-center"
                  >
                    {shift !== "No Shift" ? (
                      <div
                        className={`w-full text-center py-3 text-lg rounded-md ${
                          shift.includes("7 AM - 3 PM")
                            ? "bg-blue-500 text-white"
                            : shift.includes("3 PM - 1 AM")
                            ? "bg-yellow-500 text-white"
                            : shift.includes("1 AM - 7 AM")
                            ? "bg-purple-500 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        {shift}
                      </div>
                    ) : (
                      <span className="text-gray-400">No Shift</span>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

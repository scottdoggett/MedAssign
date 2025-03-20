"use client";

import { useStaff, StaffMember } from "@/context/StaffContext";
import { DialogTitle } from "@/components/ui/dialog"; // ✅ Import DialogTitle
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditableAvatar from "@/components/ui/EditableAvatar"; // ✅ Import EditableAvatar
import { Trash2, Plus } from "lucide-react"; // Import the trash icon
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import DateNavigation from "@/components/ui/DateNavigation";
import { format, addDays, differenceInDays, startOfWeek } from "date-fns";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export default function StaffPage() {
  const [editedShiftDate, setEditedShiftDate] = useState<Date | undefined>();

  const [newDayOffDate, setNewDayOffDate] = useState<Date | undefined>();
  const [newDayOffWeight, setNewDayOffWeight] = useState<number>(10);
  const [newShift, setNewShift] = useState<string | null>(null);
  const [newWeight, setNewWeight] = useState<number>(10); // Default to "Low"
  const [newShiftDate, setNewShiftDate] = useState<Date | undefined>();

  const { staffData, setStaffData } = useStaff();

  const [seniorityFilter, setSeniorityFilter] = useState<string>("All");
  const [shiftFilter, setShiftFilter] = useState<string>("All");

  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // ✅ Start at today

  const getPriorityLabel = (priority: number): string | null => {
    if (priority === 1) return "Low";
    if (priority === 2) return "Medium";
    if (priority === 3) return "High";
    return null; // Hide 0 values
  };

  const getDayOffColor = (priority: number): string => {
    if (priority >= 5) return "bg-red-500 text-white"; // High Priority (Red)
    if (priority >= 3) return "bg-yellow-300 text-black"; // Medium Priority (Yellow)
    return "bg-green-500 text-white"; // Low Priority (Green)
  };

  const getShiftColor = (shift: string): string => {
    if (shift.includes("7 AM - 3 PM")) return "bg-blue-500 text-white"; // Morning Shift
    if (shift.includes("3 PM - 1 AM")) return "bg-yellow-500 text-white"; // Afternoon Shift
    if (shift.includes("1 AM - 7 AM")) return "bg-purple-500 text-white"; // Night Shift
    return "bg-gray-200"; // Default gray for unknown shifts
  };

  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(
    null
  );

  const updateStaffSeniority = async (
    memberID: number,
    newSeniority: "junior" | "senior"
  ) => {
    // ✅ Create an updated staff list
    const updatedStaff = staffData.map((staff) =>
      staff.ID === memberID
        ? { ...staff, Seniority: newSeniority } // ✅ Only update Seniority
        : staff
    );

    // ✅ Update UI immediately
    setStaffData(updatedStaff);

    // ✅ Send full updated staff list to persist changes
    try {
      const response = await fetch("/api/updateStaff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedStaff), // ✅ Send full updated staff list
      });

      if (!response.ok) {
        throw new Error("Failed to save staff seniority.");
      }
    } catch (error) {
      console.error("Error updating staff seniority:", error);
    }
  };

  const updateStaffName = async (memberID: number, newName: string) => {
    // Create an updated staff list with the new name
    const updatedStaff = staffData.map((staff) =>
      staff.ID === memberID
        ? { ...staff, Name: newName } // ✅ Only update the Name field
        : staff
    );

    // Update UI immediately
    setStaffData(updatedStaff);

    // Send the full updated staff list to persist changes
    try {
      const response = await fetch("/api/updateStaff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedStaff), // ✅ Send full updated staff list
      });

      if (!response.ok) {
        throw new Error("Failed to save staff name.");
      }
    } catch (error) {
      console.error("Error updating staff name:", error);
    }
  };

  const updatePreferredShift = async (
    memberID: number,
    updatedShifts: { day: number; shift: string; weight: number }[]
  ) => {
    // Create an updated staff list
    const updatedStaff = staffData.map((staff) =>
      staff.ID === memberID
        ? {
            ...staff,
            Preferences: {
              ...staff.Preferences,
              preferred_shifts: updatedShifts, // ✅ Correctly update only this member's preferred shifts
            },
          }
        : staff
    );

    // Update UI immediately
    setStaffData(updatedStaff);

    // Send the full updated staff list to persist changes
    try {
      const response = await fetch("/api/updateStaff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedStaff), // ✅ Send full updated staff list
      });

      if (!response.ok) {
        throw new Error("Failed to save preferred shifts.");
      }
    } catch (error) {
      console.error("Error updating preferred shifts:", error);
    }
  };

  const updatePreferredDayOff = async (
    memberID: number,
    updatedDaysOff: { day: number; weight: number }[]
  ) => {
    // Create an updated staff list
    const updatedStaff = staffData.map((staff) =>
      staff.ID === memberID
        ? {
            ...staff,
            Preferences: {
              ...staff.Preferences,
              preferred_days_off: updatedDaysOff, // ✅ Correctly update only this member's preferences
            },
          }
        : staff
    );

    // Update UI immediately
    setStaffData(updatedStaff);

    // Send full staff list to API to persist changes
    try {
      const response = await fetch("/api/updateStaff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedStaff), // ✅ Send full updated staff list
      });

      if (!response.ok) {
        throw new Error("Failed to save preferred days off.");
      }
    } catch (error) {
      console.error("Error updating preferred days off:", error);
    }
  };

  const updateStaffMember = async (updatedMember: StaffMember) => {
    // Update state immediately for UI responsiveness
    setStaffData((prevStaff) =>
      prevStaff.map((staff) =>
        staff.ID === updatedMember.ID ? updatedMember : staff
      )
    );

    // Send updated member to backend to save in JSON
    try {
      const response = await fetch("/api/updateStaff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMember),
      });

      if (!response.ok) {
        throw new Error("Failed to save staff data.");
      }
    } catch (error) {
      console.error("Error updating staff data:", error);
    }
  };

  const handleSaveChanges = (updatedMember: StaffMember) => {
    setStaffData((prevStaff) =>
      prevStaff.map((staff) =>
        staff.ID === updatedMember.ID ? updatedMember : staff
      )
    );
    setSelectedMember(null);
  };

  return (
    <div className="p-6 max-w-[1000px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Staff Overview</h1>

        <div className="flex gap-4">
          {/* Seniority Filter */}
          <Select value={seniorityFilter} onValueChange={setSeniorityFilter}>
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Seniority">
                {seniorityFilter === "All"
                  ? "Seniority"
                  : seniorityFilter.charAt(0).toUpperCase() +
                    seniorityFilter.slice(1)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="junior">Junior</SelectItem>
              <SelectItem value="senior">Senior</SelectItem>
            </SelectContent>
          </Select>

          {/* Shift Date Filter - Using Popover & Calendar */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-fit">
                {shiftFilter === "All"
                  ? "Shift Date"
                  : format(new Date(shiftFilter), "EEE, MMM d")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Calendar
                mode="single"
                selected={
                  shiftFilter !== "All" ? new Date(shiftFilter) : undefined
                }
                onSelect={(date) => {
                  if (date) {
                    // Normalize date to midnight local time
                    const normalizedDate = new Date(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate()
                    );
                    const formattedDate = format(normalizedDate, "yyyy-MM-dd");
                    setShiftFilter(formattedDate);
                  } else {
                    setShiftFilter("All");
                  }
                }}
                className="rounded-md border shadow-md"
              />
            </PopoverContent>
          </Popover>

          {/* Reset Button */}
          <Button
            variant="destructive"
            onClick={() => {
              setSeniorityFilter("All");
              setShiftFilter("All");
            }}
          >
            Reset Filter
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {staffData
          .map((member) => {
            // ✅ Fetch the most up-to-date member data
            const updatedMember =
              staffData.find((m) => m.ID === member.ID) || member;
            return updatedMember;
          })
          .filter((member) => {
            // ✅ Seniority Filter
            if (
              seniorityFilter !== "All" &&
              member.Seniority !== seniorityFilter
            )
              return false;

            // ✅ Shift Filter
            if (
              shiftFilter &&
              shiftFilter !== "All" &&
              !Object.keys(member.schedule).includes(shiftFilter)
            )
              return false;

            return true;
          })
          .map((member: StaffMember) => {
            const filteredDaysOff = member.Preferences.preferred_days_off
              .filter((dayOff) => dayOff.weight > 0) // ✅ Only keep days with weight > 0
              .map((dayOff) => ({
                date: format(addDays(new Date(), dayOff.day), "yyyy-MM-dd"), // Convert day offset to real date
                weight: dayOff.weight, // Keep weight value
              }));

            return (
              <div
                key={member.ID}
                className="p-6 border-2 rounded-lg shadow bg-white"
              >
                {/* Top Section - Profile and Edit Button */}
                <div className="flex justify-between items-start">
                  {/* Profile Picture & Info */}
                  <div className="flex items-center space-x-6">
                    <EditableAvatar member={member} />
                    <div>
                      <input
                        type="text"
                        className="text-4xl font-bold bg-transparent border-none outline-none"
                        value={member.Name}
                        onChange={(e) => {
                          const newName = e.target.value;
                          setStaffData((prevStaff) =>
                            prevStaff.map((staff) =>
                              staff.ID === member.ID
                                ? { ...staff, Name: newName }
                                : staff
                            )
                          );
                        }}
                        onBlur={(e) => {
                          updateStaffName(member.ID, e.target.value); // ✅ Save to JSON on blur
                        }}
                      />
                      <Select
                        value={member.Seniority}
                        onValueChange={(value) => {
                          const newSeniority = value as "junior" | "senior"; // ✅ Explicitly cast value
                          updateStaffSeniority(member.ID, newSeniority); // ✅ Update immediately
                        }}
                      >
                        <SelectTrigger className="w-fit bg-transparent ml-[-12px] border-none shadow-none text-xl text-gray-500 focus:ring-0 focus:outline-none">
                          <SelectValue placeholder="Select Seniority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="junior">Junior Staff</SelectItem>
                          <SelectItem value="senior">Senior Staff</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Preferred Shifts & Preferred Days Off Section */}
                <div className="mt-6 flex justify-between">
                  {/* Preferred Shifts Section - More Visual Representation */}
                  {/* Preferred Shifts - Uses Popovers */}
                  {member.Preferences.preferred_shifts.length > 0 && (
                    <div className="w-3/5 pr-4">
                      <div className="flex items-center gap-2 justify-center mb-4">
                        <h3 className="text-2xl font-semibold">
                          Preferred Shifts
                        </h3>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="p-1 bg-gray-400 text-white rounded-sm hover:bg-gray-500">
                              <Plus className="w-4 h-4" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="p-4 bg-white shadow-lg rounded-lg">
                            <h4 className="text-lg font-semibold text-center mb-2">
                              Add Preferred Shift
                            </h4>

                            {/* Shift Time Selector */}
                            <Select
                              value={newShift || ""}
                              onValueChange={(value) => setNewShift(value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Shift Time" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="M">7 AM - 3 PM</SelectItem>
                                <SelectItem value="A">3 PM - 1 AM</SelectItem>
                                <SelectItem value="N">1 AM - 7 AM</SelectItem>
                              </SelectContent>
                            </Select>

                            {/* Priority Selector */}
                            <Select
                              value={String(newWeight)}
                              onValueChange={(value) =>
                                setNewWeight(Number(value))
                              }
                            >
                              <SelectTrigger className="w-full mt-2">
                                <SelectValue placeholder="Select Priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="10">Low</SelectItem>
                                <SelectItem value="25">Medium</SelectItem>
                                <SelectItem value="40">High</SelectItem>
                              </SelectContent>
                            </Select>

                            {/* Calendar */}
                            <Calendar
                              mode="single"
                              selected={newShiftDate} // ✅ Store raw selected date
                              onSelect={(date) => setNewShiftDate(date)} // ✅ No normalization
                              className="mt-3 border rounded-md shadow-md"
                            />

                            {/* Save Button - Updates JSON only when clicked */}
                            <button
                              className="w-full mt-3 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                              onClick={() => {
                                if (!newShiftDate || !newShift) return;

                                const today = new Date();
                                const selectedDate = new Date(newShiftDate);

                                // ✅ Calculate the day offset based on today
                                const newDayOffset =
                                  differenceInDays(selectedDate, today) + 1;

                                // ✅ Save only when explicitly clicked
                                const updatedShifts = [
                                  ...member.Preferences.preferred_shifts,
                                  {
                                    day: newDayOffset,
                                    shift: newShift,
                                    weight: newWeight,
                                  },
                                ];

                                updatePreferredShift(member.ID, updatedShifts); // ✅ Save to JSON
                              }}
                            >
                              Add Shift Preference
                            </button>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="flex flex-col space-y-3">
                        {member.Preferences.preferred_shifts
                          .filter((shift) => shift.weight > 0) // ✅ Only show shifts with priority
                          .map((shift, index) => {
                            const today = new Date();
                            const shiftDate = new Date();
                            shiftDate.setDate(today.getDate() + shift.day); // ✅ Convert "day" to real date

                            // ✅ Convert shift value (M, A, N) into corresponding time
                            const shiftTimes: Record<string, string> = {
                              M: "7 AM - 3 PM",
                              A: "3 PM - 1 AM",
                              N: "1 AM - 7 AM",
                            };

                            const shiftTime =
                              shiftTimes[shift.shift] || "Unknown Shift";

                            // ✅ Categorize priority into Low, Medium, High
                            let priorityLabel = "Low";
                            let priorityBorder = "border-green-600"; // ✅ Strong border color
                            let priorityBackground = "bg-green-50"; // ✅ Lighter background

                            if (shift.weight > 33) {
                              priorityLabel = "High";
                              priorityBorder = "border-red-600";
                              priorityBackground = "bg-red-50";
                            } else if (shift.weight > 16) {
                              priorityLabel = "Medium";
                              priorityBorder = "border-orange-500";
                              priorityBackground = "bg-orange-50";
                            }

                            return (
                              <Popover key={index}>
                                <PopoverTrigger asChild>
                                  <button
                                    className={`p-3 rounded-lg border-2 w-full flex items-center relative ${priorityBorder} ${priorityBackground}`}
                                  >
                                    {/* Date aligned to the left */}
                                    <div className="text-left font-bold text-lg">
                                      {format(shiftDate, "EEE, MMM d")}
                                    </div>

                                    {/* Shift Time - Set distance from the date */}
                                    <div className="text-lg font-bold ml-16 text-center w-max">
                                      {shiftTime}
                                    </div>

                                    {/* Priority stays aligned to the right */}
                                    <div className="ml-auto pr-4 text-lg font-bold">
                                      Priority: {priorityLabel}
                                    </div>
                                  </button>
                                </PopoverTrigger>

                                <PopoverContent className="p-4 bg-white shadow-lg rounded-lg">
                                  <h4 className="text-lg font-semibold text-center mb-2">
                                    Edit Preferred Shift
                                  </h4>
                                  {/* Shift Time Selector */}
                                  <Select
                                    value={shift.shift}
                                    onValueChange={(value) => {
                                      const updatedShifts =
                                        member.Preferences.preferred_shifts.map(
                                          (s, i) =>
                                            i === index
                                              ? { ...s, shift: value }
                                              : s
                                        );

                                      updatePreferredShift(
                                        member.ID,
                                        updatedShifts
                                      ); // ✅ Save to JSON
                                    }}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select Shift" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectLabel>Shift Time</SelectLabel>
                                        <SelectItem value="M">
                                          7 AM - 3 PM
                                        </SelectItem>
                                        <SelectItem value="A">
                                          3 PM - 1 AM
                                        </SelectItem>
                                        <SelectItem value="N">
                                          1 AM - 7 AM
                                        </SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                  {/* Priority Selector */}
                                  <Select
                                    value={String(shift.weight)}
                                    onValueChange={(value) => {
                                      const updatedWeight = Number(value);
                                      const updatedShifts =
                                        member.Preferences.preferred_shifts.map(
                                          (s, i) =>
                                            i === index
                                              ? { ...s, weight: updatedWeight }
                                              : s
                                        );

                                      updatePreferredShift(
                                        member.ID,
                                        updatedShifts
                                      ); // ✅ Save to JSON
                                    }}
                                  >
                                    <SelectTrigger className="w-full mt-2">
                                      <SelectValue placeholder="Select Priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectLabel>Priority</SelectLabel>
                                        <SelectItem value="10">Low</SelectItem>
                                        <SelectItem value="25">
                                          Medium
                                        </SelectItem>
                                        <SelectItem value="40">High</SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                  {/* Calendar for Date Selection */}
                                  {/* Calendar - Stores raw selected date */}
                                  {/* Calendar for Date Selection */}
                                  <Calendar
                                    mode="single"
                                    selected={editedShiftDate || shiftDate} // ✅ Default to existing shift date
                                    onSelect={(date) =>
                                      setEditedShiftDate(date)
                                    } // ✅ No normalization, just store the selected date
                                    className="mt-3 border rounded-md shadow-md"
                                  />
                                  {/* Save Button */}
                                  <button
                                    className="w-full mt-3 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    onClick={() => {
                                      if (!editedShiftDate) return;

                                      const today = new Date();
                                      const selectedDate = new Date(
                                        editedShiftDate
                                      );

                                      // ✅ Calculate the day offset based on today
                                      const newDayOffset =
                                        differenceInDays(selectedDate, today) +
                                        1;

                                      // ✅ Save only when explicitly clicked
                                      const updatedShifts =
                                        member.Preferences.preferred_shifts.map(
                                          (s, i) =>
                                            i === index
                                              ? { ...s, day: newDayOffset }
                                              : s
                                        );

                                      updatePreferredShift(
                                        member.ID,
                                        updatedShifts
                                      ); // ✅ Save to JSON
                                    }}
                                  >
                                    Save
                                  </button>
                                  {/* Delete Button */}
                                  <button
                                    className="w-full mt-3 flex items-center justify-center gap-2 p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                    onClick={() => {
                                      const updatedShifts =
                                        member.Preferences.preferred_shifts.filter(
                                          (_, i) => i !== index
                                        );

                                      updatePreferredShift(
                                        member.ID,
                                        updatedShifts
                                      ); // ✅ Remove & Save to JSON
                                    }}
                                  >
                                    <Trash2 className="w-5 h-5" />
                                    <span>Delete</span>
                                  </button>
                                </PopoverContent>
                              </Popover>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* Preferred Days Off - Aligned Next to Preferred Shifts */}
                  {/* Preferred Days Off - Uses Popovers */}
                  {member.Preferences.preferred_days_off.length > 0 && (
                    <div className="w-2/5 pl-4">
                      <div className="flex items-center gap-2 justify-center mb-4">
                        <h3 className="text-2xl font-semibold">
                          Preferred Days Off
                        </h3>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="p-1 bg-gray-400 text-white rounded-sm hover:bg-gray-500">
                              <Plus className="w-4 h-4" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="p-4 bg-white shadow-lg rounded-lg">
                            <h4 className="text-lg font-semibold text-center mb-2">
                              Add Preferred Day Off
                            </h4>

                            {/* Priority Selector */}
                            <Select
                              value={String(newDayOffWeight)}
                              onValueChange={(value) =>
                                setNewDayOffWeight(Number(value))
                              }
                            >
                              <SelectTrigger className="w-full mt-2">
                                <SelectValue placeholder="Select Priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="10">Low</SelectItem>
                                <SelectItem value="25">Medium</SelectItem>
                                <SelectItem value="40">High</SelectItem>
                              </SelectContent>
                            </Select>

                            {/* Calendar for selecting a date */}
                            <Calendar
                              mode="single"
                              selected={newDayOffDate} // ✅ Store the raw selected date
                              onSelect={(date) => setNewDayOffDate(date)} // ✅ No normalization
                              className="mt-3 border rounded-md shadow-md"
                            />

                            {/* Save Button */}
                            <button
                              className="w-full mt-3 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                              onClick={() => {
                                if (!newDayOffDate) return;

                                const today = new Date();
                                const selectedDate = new Date(newDayOffDate);

                                // ✅ Calculate the day offset based on today
                                const newDayOffset =
                                  differenceInDays(selectedDate, today) + 1;

                                const updatedDaysOff = [
                                  ...member.Preferences.preferred_days_off,
                                  {
                                    day: newDayOffset,
                                    weight: newDayOffWeight,
                                  },
                                ];

                                updatePreferredDayOff(
                                  member.ID,
                                  updatedDaysOff
                                ); // ✅ Save to JSON
                              }}
                            >
                              Add Day Off Preference
                            </button>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="flex flex-col space-y-3">
                        {member.Preferences.preferred_days_off
                          .filter((dayOff) => dayOff.weight > 0) // ✅ Only show days with priority
                          .map((dayOff, index) => {
                            const today = new Date();
                            const offDate = new Date();
                            offDate.setDate(today.getDate() + dayOff.day); // ✅ Convert "day" to real date

                            // ✅ Categorize priority into Low, Medium, High
                            let priorityLabel = "Low";
                            let priorityBorder = "border-green-600"; // ✅ Strong border color
                            let priorityBackground = "bg-green-50"; // ✅ Lighter background

                            if (dayOff.weight > 33) {
                              priorityLabel = "High";
                              priorityBorder = "border-red-600";
                              priorityBackground = "bg-red-50";
                            } else if (dayOff.weight > 16) {
                              priorityLabel = "Medium";
                              priorityBorder = "border-orange-500";
                              priorityBackground = "bg-orange-50";
                            }

                            return (
                              <Popover key={index}>
                                <PopoverTrigger asChild>
                                  <button
                                    className={`p-3 rounded-lg border-2 w-full flex items-center relative ${priorityBorder} ${priorityBackground}`}
                                  >
                                    {/* Date aligned to the left */}
                                    <div className="text-left text-lg font-bold">
                                      {format(offDate, "EEE, MMM d")}
                                    </div>

                                    {/* Priority text aligned to the right with extra spacing */}
                                    <div className="ml-auto text-lg font-bold">
                                      Priority: {priorityLabel}
                                    </div>
                                  </button>
                                </PopoverTrigger>

                                <PopoverContent className="p-4 bg-white shadow-lg rounded-lg">
                                  <h4 className="text-lg font-semibold text-center mb-2">
                                    Edit Preferred Day Off
                                  </h4>

                                  {/* Priority Selector */}
                                  <Select
                                    value={String(dayOff.weight)}
                                    onValueChange={(value) => {
                                      const updatedWeight = Number(value);
                                      const updatedDaysOff =
                                        member.Preferences.preferred_days_off.map(
                                          (d, i) =>
                                            i === index
                                              ? { ...d, weight: updatedWeight }
                                              : d
                                        );

                                      updatePreferredDayOff(
                                        member.ID,
                                        updatedDaysOff
                                      ); // ✅ Save to JSON
                                    }}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select Priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectLabel>Priority</SelectLabel>
                                        <SelectItem value="10">Low</SelectItem>
                                        <SelectItem value="25">
                                          Medium
                                        </SelectItem>
                                        <SelectItem value="40">High</SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>

                                  {/* Calendar for Date Selection */}
                                  <Calendar
                                    mode="single"
                                    selected={newDayOffDate} // ✅ Store the raw selected date
                                    onSelect={(date) => setNewDayOffDate(date)} // ✅ No normalization, just store raw date
                                    className="mt-3 border rounded-md shadow-md"
                                  />

                                  {/* Save Button */}
                                  <button
                                    className="w-full mt-3 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    onClick={() => {
                                      if (!newDayOffDate) return;

                                      const today = new Date();
                                      const selectedDate = new Date(
                                        newDayOffDate
                                      );

                                      // ✅ Calculate the day offset based on today
                                      const newDayOffset =
                                        differenceInDays(selectedDate, today) +
                                        1;

                                      // ✅ Save only when explicitly clicked
                                      const updatedDaysOff =
                                        member.Preferences.preferred_days_off.map(
                                          (d, i) =>
                                            i === index
                                              ? { ...d, day: newDayOffset }
                                              : d
                                        );

                                      updatePreferredDayOff(
                                        member.ID,
                                        updatedDaysOff
                                      ); // ✅ Save to JSON
                                    }}
                                  >
                                    Save
                                  </button>

                                  {/* Delete Button */}
                                  <button
                                    className="w-full mt-3 flex items-center justify-center gap-2 p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                    onClick={() => {
                                      const updatedDaysOff =
                                        member.Preferences.preferred_days_off.filter(
                                          (_, i) => i !== index
                                        );

                                      updatePreferredDayOff(
                                        member.ID,
                                        updatedDaysOff
                                      ); // ✅ Remove & Save to JSON
                                    }}
                                  >
                                    <Trash2 className="w-5 h-5" />
                                    <span>Delete</span>
                                  </button>
                                </PopoverContent>
                              </Popover>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Schedule Section */}
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-3">Schedule</h3>
                  <DateNavigation
                    date={selectedDate}
                    setDate={setSelectedDate}
                  />

                  {/* Minimalist Weekly Schedule (Two-Row Grid) */}
                  <div className="mt-4 border p-4 rounded-md bg-gray-50">
                    <div className="grid grid-cols-7 gap-4 border-b pb-2 text-center font-semibold text-gray-700">
                      {Array.from({ length: 7 }).map((_, index) => {
                        const currentDate = addDays(
                          selectedDate ?? new Date(),
                          index
                        );
                        return (
                          <div key={index} className="text-md">
                            {format(currentDate, "EEE, MMM d")}
                          </div>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-7 gap-4 pt-2 text-center">
                      {Array.from({ length: 7 }).map((_, index) => {
                        const currentDate = addDays(selectedDate, index);
                        const formattedDate = format(currentDate, "yyyy-MM-dd");
                        const shift =
                          (member.schedule ?? {})[formattedDate] || "No Shift";
                        return (
                          <div key={index}>
                            {shift ? (
                              <div
                                className={`px-3 py-2 rounded-md text-sm font-medium ${getShiftColor(
                                  shift
                                )}`}
                              >
                                {shift}
                              </div>
                            ) : (
                              <span className="text-gray-400">No Shift</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

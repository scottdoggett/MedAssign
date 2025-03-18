"use client";
import { useStaff } from "@/app/context/StaffContext";
import { DialogTitle } from "@/components/ui/dialog"; // ✅ Import DialogTitle
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useEffect } from "react";
import { StaffMember } from "@/data/staffData"; // ✅ Fix: Import StaffMember type
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox"; // Ensure Checkbox is imported
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
import { format, addDays, startOfWeek } from "date-fns";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export default function StaffPage() {
  const { staffData, updateStaffMember } = useStaff();

  const [seniorityFilter, setSeniorityFilter] = useState<string>("All");
  const [shiftFilter, setShiftFilter] = useState<string>("All");
  const [dayOffFilter, setDayOffFilter] = useState<string>("All");

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
  ); // ✅ Fix: Add state

  const handleSaveChanges = (updatedMember: StaffMember) => {
    if (updateStaffMember) {
      updateStaffMember(updatedMember);
      setSelectedMember(null);

      // ✅ Ensure scrolling is always restored after edit
      setTimeout(() => {
        document.body.style.overflow = "";
      }, 50);
    } else {
      console.error("updateStaffMember is undefined");
    }
  };

  function EditStaffForm({
    member,
    onSave,
    onCancel,
  }: {
    member: StaffMember;
    onSave: (updatedMember: StaffMember) => void;
    onCancel: () => void;
  }) {
    const [formData, setFormData] = useState({ ...member });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Edit {member.name}</h2>

        {/* Grid Layout for Form Sections */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-6">
          {/* Left Section - Name, Seniority, Preferred Days Off */}
          <div className="space-y-4">
            {/* Name Input */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Seniority Input */}
            <div>
              <Label htmlFor="seniority">Seniority</Label>
              <Select
                value={formData.seniority}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    seniority: value as "Senior" | "Junior",
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Seniority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Junior">Junior</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Preferred Days Off Section */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Preferred Days Off</h3>
              <div className="grid grid-cols-7 gap-2">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <div key={day} className="flex flex-col">
                    <span className="text-sm font-medium">{day}</span>
                    <Select
                      key={day}
                      value={String(formData.daysOffPreferences[day] || 0)}
                      onValueChange={(value) => {
                        setFormData((prev) => ({
                          ...prev,
                          daysOffPreferences: {
                            ...prev.daysOffPreferences,
                            [day]: Number(value),
                          },
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Priority">
                          {
                            formData.daysOffPreferences[day] === 1
                              ? "Low"
                              : formData.daysOffPreferences[day] === 2
                              ? "Med"
                              : formData.daysOffPreferences[day] === 3
                              ? "High"
                              : "" // If None (0), show empty text
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Priority Level</SelectLabel>
                          <SelectItem value="0">None</SelectItem>{" "}
                          {/* Selecting this makes the select appear empty */}
                          <SelectItem value="1">Low</SelectItem>
                          <SelectItem value="2">Medium</SelectItem>
                          <SelectItem value="3">High</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-px bg-gray-300 mx-6"></div>

          {/* Right Section - Preferred Shifts (3x7 Grid) */}
          {/* Preferred Shifts Section */}
          {/* Preferred Shifts Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Preferred Shifts</h3>
            <div className="grid grid-cols-8 gap-2 items-center">
              {/* Empty space for shift labels */}
              <div></div>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (shortDay) => (
                  <span
                    key={shortDay}
                    className="text-sm font-semibold text-center"
                  >
                    {shortDay}
                  </span>
                )
              )}

              {/* Shift Labels + Shift Select Inputs */}
              {["7 AM - 3 PM", "3 PM - 1 AM", "1 AM - 7 AM"].map(
                (shift, shiftIndex) => (
                  <React.Fragment key={shift}>
                    {/* Left-side shift label */}
                    <span className="text-sm font-medium">
                      {shift === "7 AM - 3 PM"
                        ? "Morning"
                        : shift === "3 PM - 1 AM"
                        ? "Afternoon"
                        : "Evening"}
                    </span>

                    {/* Shift Priority Selects */}
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day) => {
                      const dayShifts = formData.preferredShifts[day] || {
                        "7 AM - 3 PM": 0,
                        "3 PM - 1 AM": 0,
                        "1 AM - 7 AM": 0,
                      };

                      return (
                        <Select
                          key={`${day}-${shift}`}
                          value={String(
                            dayShifts[shift as keyof typeof dayShifts] || 0
                          )}
                          onValueChange={(value) => {
                            setFormData((prev) => ({
                              ...prev,
                              preferredShifts: {
                                ...prev.preferredShifts,
                                [day]: {
                                  ...prev.preferredShifts[day],
                                  [shift as keyof typeof dayShifts]:
                                    Number(value),
                                },
                              },
                            }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Preference Amount">
                              {
                                dayShifts[shift as keyof typeof dayShifts] === 1
                                  ? "Low"
                                  : dayShifts[
                                      shift as keyof typeof dayShifts
                                    ] === 2
                                  ? "Med"
                                  : dayShifts[
                                      shift as keyof typeof dayShifts
                                    ] === 3
                                  ? "High"
                                  : "" // Show empty if None (0)
                              }
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Preference Amount</SelectLabel>
                              <SelectItem value="0">None</SelectItem>{" "}
                              {/* Makes select appear empty */}
                              <SelectItem value="1">Low</SelectItem>
                              <SelectItem value="2">Medium</SelectItem>
                              <SelectItem value="3">High</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      );
                    })}
                  </React.Fragment>
                )
              )}
            </div>
          </div>
        </div>

        {/* Footer Buttons (Save & Cancel) */}
        <div className="flex flex-col gap-2 mt-6 items-center">
          <Button
            className="w-[20vw]"
            onClick={() => {
              onSave(formData);
              document.dispatchEvent(
                new KeyboardEvent("keydown", { key: "Escape" })
              ); // 🔥 Fully close the drawer
            }}
          >
            Submit
          </Button>

          <DrawerClose asChild>
            <Button variant="outline" className="w-[20vw]" onClick={onCancel}>
              Cancel
            </Button>
          </DrawerClose>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1000px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Staff Overview</h1>

        <div className="flex gap-4">
          {/* Seniority Filter */}
          <Select value={seniorityFilter} onValueChange={setSeniorityFilter}>
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Seniority">
                {seniorityFilter === "All" ? "Seniority" : seniorityFilter}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Junior">Junior</SelectItem>
              <SelectItem value="Senior">Senior</SelectItem>
            </SelectContent>
          </Select>

          {/* Shift Date Filter - Using Popover & Calendar */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-fit">
                {shiftFilter === "All"
                  ? "Shift Date"
                  : format(new Date(shiftFilter + "T00:00:00"), "EEE, MMM d")}
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

          {/* Day Off Filter */}
          <Select value={dayOffFilter} onValueChange={setDayOffFilter}>
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Preferred Day Off">
                {dayOffFilter === "All" ? "Preferred Day Off" : dayOffFilter}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Reset Button */}
          <Button
            variant="destructive"
            onClick={() => {
              setSeniorityFilter("All");
              setShiftFilter("All");
              setDayOffFilter("All");
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
              staffData.find((m) => m.id === member.id) || member;
            return updatedMember;
          })
          .filter((member) => {
            // ✅ Seniority Filter
            if (
              seniorityFilter !== "All" &&
              member.seniority !== seniorityFilter
            )
              return false;

            // ✅ Shift Filter
            if (
              shiftFilter &&
              shiftFilter !== "All" &&
              !Object.keys(member.schedule).includes(shiftFilter)
            )
              return false;

            // ✅ Preferred Days Off Filter - Ensures It Uses The Updated Data
            if (dayOffFilter !== "All") {
              const selectedDays = dayOffFilter.split(",");
              const hasMatchingPreference = selectedDays.some(
                (day) =>
                  member.daysOffPreferences?.[day] &&
                  member.daysOffPreferences[day] > 0 // ✅ Ensures updated data is used
              );
              if (!hasMatchingPreference) return false;
            }

            return true;
          })
          .map((member: StaffMember) => {
            const filteredDaysOff = Object.entries(
              member.daysOffPreferences ?? {}
            ).filter(([, priority]) => priority > 0);

            const filteredShifts = Object.entries(
              member.preferredShifts ?? {}
            ).filter(([, shifts]) =>
              Object.values(shifts).some((priority) => priority > 0)
            );

            return (
              <div
                key={member.id}
                className="p-6 border-2 rounded-lg shadow bg-white"
              >
                {/* Top Section - Profile and Edit Button */}
                <div className="flex justify-between items-start">
                  {/* Profile Picture & Info */}
                  <div className="flex items-center space-x-6">
                    <Avatar className="w-32 h-32">
                      <AvatarImage
                        src={`/headshots/${member.id}.jpeg`}
                        alt={member.name}
                      />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-4xl font-bold">{member.name}</h2>
                      <p className="text-gray-600 text-xl">
                        {member.seniority} Staff
                      </p>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <Drawer
                    onOpenChange={(open) =>
                      (document.body.style.overflow = open ? "hidden" : "")
                    }
                  >
                    <DrawerTrigger asChild>
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={() => setSelectedMember(member)}
                      >
                        Edit Staff Info
                      </button>
                    </DrawerTrigger>
                    <DrawerContent className="bg-white shadow-xl rounded-t-lg transition-transform duration-300">
                      <div className="mx-auto max-w-[70vw]">
                        <DrawerHeader>
                          <DrawerTitle>Edit Staff Member</DrawerTitle>
                          <DrawerDescription>
                            Modify staff details below.
                          </DrawerDescription>
                        </DrawerHeader>
                        {selectedMember && (
                          <EditStaffForm
                            member={selectedMember}
                            onSave={(updatedMember) =>
                              handleSaveChanges(updatedMember)
                            }
                            onCancel={() => setSelectedMember(null)}
                          />
                        )}
                      </div>
                    </DrawerContent>
                  </Drawer>
                </div>

                {/* Preferred Shifts & Preferred Days Off Section */}
                <div className="mt-6 flex justify-between">
                  {/* Preferred Shifts */}
                  {filteredShifts.length > 0 && (
                    <div className="w-full">
                      <h3 className="text-xl font-semibold mb-2">
                        Preferred Shifts
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Day</TableHead>
                            <TableHead className="text-center">
                              Morning
                            </TableHead>
                            <TableHead className="text-center">
                              Afternoon
                            </TableHead>
                            <TableHead className="text-center">
                              Evening
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                            "Sunday",
                          ]
                            .filter((day) => {
                              const shifts = member.preferredShifts[day] || {
                                "7 AM - 3 PM": 0,
                                "3 PM - 1 AM": 0,
                                "1 AM - 7 AM": 0,
                              };
                              return Object.values(shifts).some(
                                (priority) => priority > 0
                              );
                            })
                            .map((day) => {
                              const shifts = member.preferredShifts[day] || {
                                "7 AM - 3 PM": 0,
                                "3 PM - 1 AM": 0,
                                "1 AM - 7 AM": 0,
                              };
                              return (
                                <TableRow key={day}>
                                  <TableCell className="font-medium">
                                    {day}
                                  </TableCell>
                                  {[
                                    "7 AM - 3 PM",
                                    "3 PM - 1 AM",
                                    "1 AM - 7 AM",
                                  ].map((shift) => {
                                    const priority =
                                      shifts[shift as keyof typeof shifts] || 0;
                                    const label = getPriorityLabel(priority);
                                    return (
                                      <TableCell
                                        key={shift}
                                        className="text-center"
                                      >
                                        {label ? label : "-"}
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* Preferred Days Off - Aligned Next to Preferred Shifts */}
                  {filteredDaysOff.length > 0 && (
                    <div className="w-1/3 flex flex-col items-end">
                      <h3 className="text-xl font-semibold mb-2">
                        Preferred Days Off
                      </h3>
                      <div className="flex flex-col gap-2">
                        {filteredDaysOff.map(([day, priority]) => {
                          const label = getPriorityLabel(priority);
                          if (!label) return null; // Hide if 0
                          return (
                            <Tooltip key={day}>
                              <TooltipTrigger>
                                <span
                                  className={`px-2 py-1 rounded-md text-md font-medium ${
                                    priority === 3
                                      ? "bg-red-300 text-black" // High Priority
                                      : priority === 2
                                      ? "bg-yellow-200 text-black" // Medium Priority
                                      : priority === 1
                                      ? "bg-yellow-200 text-black" // Low Priority
                                      : "hidden" // Hide if priority is 0
                                  }`}
                                >
                                  {day}
                                  {/* Show only 'Mon', 'Tue', etc. */}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{label} Priority</p>
                              </TooltipContent>
                            </Tooltip>
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
                        const shift = member.schedule[formattedDate];

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

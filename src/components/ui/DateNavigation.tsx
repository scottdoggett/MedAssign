"use client";

import * as React from "react";
import { format, addDays } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateNavigationProps {
    date: Date;
    setDate: React.Dispatch<React.SetStateAction<Date>>;
}

export default function DateNavigation({ date, setDate }: DateNavigationProps) {
  const [view, setView] = React.useState("Week");

  return (
    <div className="flex items-center gap-2 p-2 bg-white rounded-md w-full max-w-2xl h-10">
      {/* Today Button */}
      <Button
        variant="secondary"
        className="px-4 py-1 text-sm"
        onClick={() => setDate(new Date())}
      >
        Today
      </Button>

      {/* Left Arrow */}
      <Button
        variant="outline"
        size="icon"
        className="p-1"
        onClick={() => setDate(addDays(date!, -7))}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Date Picker Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-fit justify-start text-left font-normal px-3 py-1 border rounded-md",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-gray-600" />
            {date ? (
              <span className="pr-1">
                {format(date, "dd")} - {format(addDays(date, 6), "dd MMM yyyy")}
              </span>
            ) : (
              <span className="pr-1">Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              if (
                !newDate ||
                format(newDate, "yyyy-MM-dd") === format(date!, "yyyy-MM-dd")
              ) {
                return; // Do nothing if same date is selected
              }
              setDate(newDate);
            }}
          />{" "}
        </PopoverContent>
      </Popover>

      {/* Right Arrow */}
      <Button
        variant="outline"
        size="icon"
        className="p-1"
        onClick={() => setDate(addDays(date!, 7))}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

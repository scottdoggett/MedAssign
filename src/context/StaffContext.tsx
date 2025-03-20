"use client";

import { createContext, useContext, useState, useEffect } from "react";

export interface StaffMember {
  ID: number;
  Name: string;
  Seniority: "junior" | "senior";
  Preferences: {
    preferred_shifts: { day: number; shift: string; weight: number }[];
    preferred_days_off: { day: number; weight: number }[];
  };
  schedule: Record<string, string>;
}

interface StaffContextType {
  staffData: StaffMember[];
  setStaffData: React.Dispatch<React.SetStateAction<StaffMember[]>>; // ✅ Expose setStaffData
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

export const StaffProvider = ({ children }: { children: React.ReactNode }) => {
  const [staffData, setStaffData] = useState<StaffMember[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [staffResponse, schedulesResponse] = await Promise.all([
          fetch("/api/getStaff"),
          fetch("/api/getSchedules"),
        ]);

        const staffJson = await staffResponse.json();
        const schedulesJson = await schedulesResponse.json();

        const mergedStaff = staffJson.staff.map((staff: StaffMember) => ({
          ...staff,
          schedule: schedulesJson[staff.ID] || {}, // ✅ Ensure empty schedule if missing
        }));

        setStaffData(mergedStaff);
      } catch (error) {
        console.error("Error loading staff and schedules:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <StaffContext.Provider value={{ staffData, setStaffData }}> {/* ✅ Provide setStaffData */}
      {children}
    </StaffContext.Provider>
  );
};

export const useStaff = () => {
  const context = useContext(StaffContext);
  if (!context) throw new Error("useStaff must be used within a StaffProvider");
  return context;
};

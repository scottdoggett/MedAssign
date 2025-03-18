"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { StaffMember } from "@/data/staffData"; 
import { staff as initialStaff } from "@/data/staffData"; 

// Define Context Type
interface StaffContextType {
  staffData: StaffMember[];
  setStaffData: (staff: StaffMember[]) => void;
  updateStaffMember: (updatedMember: StaffMember) => void;
}

// Create Context
const StaffContext = createContext<StaffContextType | undefined>(undefined);

export const StaffProvider = ({ children }: { children: React.ReactNode }) => {
  const [staffData, setStaffData] = useState<StaffMember[]>(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("staffData"); // ✅ Clear storage on load
      return initialStaff;
    }
    return initialStaff;
  });

  // ✅ Force reset on app start
  useEffect(() => {
    localStorage.removeItem("staffData"); // ✅ Ensures fresh state every time
    setStaffData(initialStaff);
  }, []);

  const updateStaffMember = (updatedMember: StaffMember) => {
    setStaffData((prevStaff) => {
      const newStaff = prevStaff.map((member) =>
        member.id === updatedMember.id ? updatedMember : member
      );
      localStorage.setItem("staffData", JSON.stringify(newStaff)); // ✅ Save updates
      return newStaff;
    });
  };

  return (
    <StaffContext.Provider value={{ staffData, setStaffData, updateStaffMember }}>
      {children}
    </StaffContext.Provider>
  );
};

// Custom Hook to Use Staff Context
export const useStaff = () => {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error("useStaff must be used within a StaffProvider");
  }
  return context;
};

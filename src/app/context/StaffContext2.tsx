import { createContext, useContext, useState, useEffect } from "react";

export interface StaffMember {
  ID: number;
  Name: string;
  Seniority: "junior" | "senior";
  Preferences: {
    preferred_shifts: { day: number; shift: string; weight: number }[];
    preferred_days_off: { day: number; weight: number }[];
  };
}

interface StaffContextType {
  staffData: StaffMember[];
  updateStaffMember: (updatedMember: StaffMember) => void;
  addStaffMember: (newMember: StaffMember) => void;
  deleteStaffMember: (id: number) => void;
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

export const StaffProvider = ({ children }: { children: React.ReactNode }) => {
  const [staffData, setStaffData] = useState<StaffMember[]>([]);

  useEffect(() => {
    fetch("/solver_data.json")
      .then((response) => response.json())
      .then((data) => setStaffData(data.staff)) // Load only the "staff" section
      .catch((error) => console.error("Error loading staff data:", error));
  }, []);

  const updateStaffMember = (updatedMember: StaffMember) => {
    const updatedStaff = staffData.map((staff) =>
      staff.ID === updatedMember.ID ? updatedMember : staff
    );
    setStaffData(updatedStaff);
    saveToFile(updatedStaff);
  };

  const addStaffMember = (newMember: StaffMember) => {
    const updatedStaff = [...staffData, newMember];
    setStaffData(updatedStaff);
    saveToFile(updatedStaff);
  };

  const deleteStaffMember = (id: number) => {
    const updatedStaff = staffData.filter((staff) => staff.ID !== id);
    setStaffData(updatedStaff);
    saveToFile(updatedStaff);
  };

  const saveToFile = async (updatedStaff: StaffMember[]) => {
    try {
      await fetch("/api/updateStaff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStaff),
      });
    } catch (error) {
      console.error("Error saving staff data:", error);
    }
  };

  return (
    <StaffContext.Provider value={{ staffData, updateStaffMember, addStaffMember, deleteStaffMember }}>
      {children}
    </StaffContext.Provider>
  );
};

export const useStaff = () => {
  const context = useContext(StaffContext);
  if (!context) throw new Error("useStaff must be used within a StaffProvider");
  return context;
};

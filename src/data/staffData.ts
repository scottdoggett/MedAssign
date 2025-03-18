// Define the TypeScript interface for staff members
export interface StaffMember {
  id: number;
  name: string;
  seniority: "Junior" | "Senior";
  preferredShifts: Record<
    string,
    {
      "7 AM - 3 PM": number;
      "3 PM - 1 AM": number;
      "1 AM - 7 AM": number;
    }
  >;
  daysOffPreferences: Record<string, number>;
  schedule: Record<string, string>; // Stores the actual schedule (Date → Shift)
}

// Global array of staff members
export const staff: StaffMember[] = [
  {
    id: 1,
    name: "Adrian Goia",
    seniority: "Senior",
    preferredShifts: {
      Monday: { "7 AM - 3 PM": 3, "3 PM - 1 AM": 0, "1 AM - 7 AM": 0 },
      Tuesday: { "7 AM - 3 PM": 0, "3 PM - 1 AM": 2, "1 AM - 7 AM": 0 },
      Thursday: { "7 AM - 3 PM": 0, "3 PM - 1 AM": 3, "1 AM - 7 AM": 0 },
      Saturday: { "7 AM - 3 PM": 0, "3 PM - 1 AM": 3, "1 AM - 7 AM": 0 },
    },
    daysOffPreferences: {
      Wednesday: 3,
      Saturday: 2,
    },
    schedule: {
      "2025-03-11": "7 AM - 3 PM",
      "2025-03-12": "1 AM - 7 AM",
      "2025-03-14": "1 AM - 7 AM",
      "2025-03-16": "7 AM - 3 PM",
      "2025-03-18": "3 PM - 1 AM",
      "2025-03-20": "1 AM - 7 AM",
      "2025-03-22": "7 AM - 3 PM",
      "2025-03-23": "1 AM - 7 AM",
      "2025-03-25": "1 AM - 7 AM",

    },
  },
  {
    id: 2,
    name: "Jennifer Muller",
    seniority: "Junior",
    preferredShifts: {
      Monday: { "7 AM - 3 PM": 0, "3 PM - 1 AM": 3, "1 AM - 7 AM": 0 },
      Tuesday: { "7 AM - 3 PM": 3, "3 PM - 1 AM": 0, "1 AM - 7 AM": 0 },
      Wednesday: { "7 AM - 3 PM": 0, "3 PM - 1 AM": 1, "1 AM - 7 AM": 0 },
      Friday: { "7 AM - 3 PM": 2, "3 PM - 1 AM": 0, "1 AM - 7 AM": 0 },
    },
    daysOffPreferences: {
      Tuesday: 3,
      Thursday: 1,
      Friday: 1,
    },
    schedule: {
      "2025-03-10": "3 PM - 1 AM",
      "2025-03-11": "1 AM - 7 AM",
      "2025-03-13": "7 AM - 3 PM",
      "2025-03-15": "3 PM - 1 AM",
      "2025-03-17": "1 AM - 7 AM",
      "2025-03-19": "7 AM - 3 PM",
      "2025-03-21": "3 PM - 1 AM",
      "2025-03-23": "1 AM - 7 AM",
      "2025-03-24": "7 AM - 3 PM",
      "2025-03-26": "3 PM - 1 AM",
    },
  },
  {
    id: 3,
    name: "Rachel Lorence",
    seniority: "Senior",
    preferredShifts: {
      Monday: { "7 AM - 3 PM": 1, "3 PM - 1 AM": 0, "1 AM - 7 AM": 0 },
      Wednesday: { "7 AM - 3 PM": 3, "3 PM - 1 AM": 2, "1 AM - 7 AM": 0 },
    },
    daysOffPreferences: {
      Thursday: 2,
      Saturday: 2,
    },
    schedule: {
      "2025-03-10": "1 AM - 7 AM",
      "2025-03-12": "7 AM - 3 PM",
      "2025-03-14": "3 PM - 1 AM",
      "2025-03-16": "1 AM - 7 AM",
      "2025-03-18": "7 AM - 3 PM",
      "2025-03-20": "3 PM - 1 AM",
      "2025-03-22": "1 AM - 7 AM",
      "2025-03-24": "7 AM - 3 PM",
      "2025-03-25": "3 PM - 1 AM",
    },
  },
  {
    id: 4,
    name: "Dwayne Stevens",
    seniority: "Junior",
    preferredShifts: {
      Monday: { "7 AM - 3 PM": 0, "3 PM - 1 AM": 2, "1 AM - 7 AM": 0 },
      Tuesday: { "7 AM - 3 PM": 2, "3 PM - 1 AM": 0, "1 AM - 7 AM": 3 },
      Thursday: { "7 AM - 3 PM": 3, "3 PM - 1 AM": 0, "1 AM - 7 AM": 0 },
    },
    daysOffPreferences: {
      Wednesday: 3,
      Sunday: 2,
    },
    schedule: {
      "2025-03-10": "7 AM - 3 PM",
      "2025-03-11": "3 PM - 1 AM",
      "2025-03-13": "1 AM - 7 AM",
      "2025-03-15": "7 AM - 3 PM",
      "2025-03-16": "7 AM - 3 PM",
      "2025-03-17": "3 PM - 1 AM",
      "2025-03-19": "1 AM - 7 AM",
      "2025-03-21": "7 AM - 3 PM",
      "2025-03-23": "3 PM - 1 AM",
      "2025-03-25": "7 AM - 3 PM",
      "2025-03-26": "3 PM - 1 AM",
    },
  },
  {
    id: 5,
    name: "Mark Stewart",
    seniority: "Junior",
    preferredShifts: {
      Monday: { "7 AM - 3 PM": 3, "3 PM - 1 AM": 0, "1 AM - 7 AM": 0 },
      Wednesday: { "7 AM - 3 PM": 0, "3 PM - 1 AM": 3, "1 AM - 7 AM": 2 },
      Thursday: { "7 AM - 3 PM": 1, "3 PM - 1 AM": 0, "1 AM - 7 AM": 0 },
    },
    daysOffPreferences: {
      Tuesday: 3,
      Sunday: 1,
    },
    schedule: {
      "2025-03-10": "1 AM - 7 AM",
      "2025-03-12": "7 AM - 3 PM",
      "2025-03-13": "3 PM - 1 AM",
      "2025-03-15": "1 AM - 7 AM",
      "2025-03-17": "7 AM - 3 PM",
      "2025-03-19": "3 PM - 1 AM",
      "2025-03-21": "1 AM - 7 AM",
      "2025-03-23": "7 AM - 3 PM",
      "2025-03-26": "1 AM - 7 AM",
    },
  },
  {
    id: 6,
    name: "Carmen Rodriguez",
    seniority: "Senior",
    preferredShifts: {
      Monday: { "7 AM - 3 PM": 0, "3 PM - 1 AM": 3, "1 AM - 7 AM": 0 },
      Wednesday: { "7 AM - 3 PM": 0, "3 PM - 1 AM": 2, "1 AM - 7 AM": 0 },
      Friday: { "7 AM - 3 PM": 1, "3 PM - 1 AM": 0, "1 AM - 7 AM": 0 },
    },
    daysOffPreferences: {
      Tuesday: 3,
      Sunday: 1,
    },
    schedule: {
      "2025-03-10": "1 AM - 7 AM",
      "2025-03-12": "3 PM - 1 AM",
      "2025-03-14": "7 AM - 3 PM",
      "2025-03-16": "3 PM - 1 AM",
      "2025-03-18": "1 AM - 7 AM",
      "2025-03-20": "7 AM - 3 PM",
      "2025-03-22": "3 PM - 1 AM",
      "2025-03-24": "7 AM - 3 PM",
    },
  },
  {
    id: 7,
    name: "Sharon Neville",
    seniority: "Senior",
    preferredShifts: {
      Monday: { "7 AM - 3 PM": 0, "3 PM - 1 AM": 2, "1 AM - 7 AM": 0 },
      Tuesday: { "7 AM - 3 PM": 2, "3 PM - 1 AM": 0, "1 AM - 7 AM": 4 },
      Thursday: { "7 AM - 3 PM": 3, "3 PM - 1 AM": 0, "1 AM - 7 AM": 2 },
    },
    daysOffPreferences: {
      Wednesday: 1,
      Sunday: 3,
    },
    schedule: {
      "2025-03-10": "7 AM - 3 PM",
      "2025-03-11": "3 PM - 1 AM",
      "2025-03-13": "3 PM - 1 AM",
      "2025-03-15": "7 AM - 3 PM",
      "2025-03-17": "1 AM - 7 AM",
      "2025-03-19": "7 AM - 3 PM",
      "2025-03-22": "3 PM - 1 AM",
      "2025-03-24": "7 AM - 3 PM",
      "2025-03-25": "1 AM - 7 AM",
    },
  },
  {
    id: 8,
    name: "David Young",
    seniority: "Junior",
    preferredShifts: {
      Monday: { "7 AM - 3 PM": 0, "3 PM - 1 AM": 0, "1 AM - 7 AM": 3 },
      Wednesday: { "7 AM - 3 PM": 0, "3 PM - 1 AM": 3, "1 AM - 7 AM": 2 },
      Thursday: { "7 AM - 3 PM": 3, "3 PM - 1 AM": 0, "1 AM - 7 AM": 0 },
    },
    daysOffPreferences: {
      Tuesday: 3,
      Saturday: 2,
    },
    schedule: {
      "2025-03-10": "1 AM - 7 AM",
      "2025-03-12": "7 AM - 3 PM",
      "2025-03-13": "3 PM - 1 AM",
      "2025-03-15": "1 AM - 7 AM",
      "2025-03-17": "7 AM - 3 PM",
      "2025-03-19": "3 PM - 1 AM",
      "2025-03-21": "1 AM - 7 AM",
      "2025-03-24": "3 PM - 1 AM",
      "2025-03-26": "7 AM - 3 PM",
    },
  },
  {
    id: 9,
    name: "Emily Carter",
    seniority: "Senior",
    preferredShifts: {
      Tuesday: { "7 AM - 3 PM": 1, "3 PM - 1 AM": 0, "1 AM - 7 AM": 3 },
      Wednesday: { "7 AM - 3 PM": 3, "3 PM - 1 AM": 0, "1 AM - 7 AM": 2 },
      Thursday: { "7 AM - 3 PM": 1, "3 PM - 1 AM": 0, "1 AM - 7 AM": 0 },
    },
    daysOffPreferences: {
      Monday: 3,
      Sunday: 2,
    },
    schedule: {
      "2025-03-10": "7 AM - 3 PM",
      "2025-03-11": "3 PM - 1 AM",
      "2025-03-14": "3 PM - 1 AM",
      "2025-03-15": "7 AM - 3 PM",
      "2025-03-17": "1 AM - 7 AM",
      "2025-03-19": "7 AM - 3 PM",
      "2025-03-22": "3 PM - 1 AM",
      "2025-03-24": "7 AM - 3 PM",
    },
  },
];
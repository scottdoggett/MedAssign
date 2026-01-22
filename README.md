# MedAssign

A staff scheduling platform for medical professionals that optimizes shift assignments based on staff preferences and operational requirements.

## Overview

MedAssign is a Next.js web application that enables healthcare facilities to manage staff schedules efficiently. The application allows staff members to input their shift preferences and days off with priority weighting, then generates optimized schedules using advanced algorithms powered by Google OR-Tools and Tabu Search.

## Features

### Staff Management
- **Staff Profiles**: Manage staff members with customizable profiles including name, seniority level, and avatar images
- **Avatar Upload**: Upload and manage custom profile pictures for each staff member
- **Seniority Levels**: Categorize staff as junior or senior to influence scheduling decisions

### Preference Management
- **Shift Preferences**: Staff can specify preferred shifts (7 AM - 3 PM, 3 PM - 1 AM, 1 AM - 7 AM)
- **Priority Weighting**: Assign weights to preferences (Low, Medium, High) to indicate importance
- **Days Off Requests**: Request specific days off with priority levels
- **Real-time Updates**: All preference changes are saved automatically and persist across sessions

### Schedule Generation
- **AI-Powered Optimization**: Uses Google OR-Tools with Tabu Search algorithm to generate optimal schedules
- **Constraint Satisfaction**: Balances staff preferences with operational requirements
- **Python Integration**: Leverages Python solver for complex scheduling calculations
- **Visual Schedule Grid**: View generated schedules in an intuitive calendar-style grid

### Schedule Visualization
- **Interactive Calendar**: Navigate through dates to view scheduled shifts
- **Filtering Options**: Filter schedules by seniority level and shift type
- **Export Functionality**: Save schedules as PNG images for sharing and printing
- **Responsive Design**: Optimized for desktop and mobile viewing

## Tech Stack

### Frontend
- **Framework**: Next.js 15.2.1 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4.0.12
- **Component Library**: Radix UI (shadcn/ui components)
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Type Safety**: TypeScript 5

### Backend
- **API Routes**: Next.js API routes
- **File Storage**: JSON-based data persistence
- **Image Processing**: Formidable for file uploads
- **Schedule Export**: dom-to-image-more for PNG generation

### Scheduling Algorithm
- **Language**: Python 3
- **Solver**: Google OR-Tools
- **Algorithm**: Tabu Search optimization
- **Integration**: Node.js child_process for Python execution

## Getting Started

### Prerequisites

- Node.js 20 or higher
- Python 3.x with pip
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd my-project
```

2. Install Node.js dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Install Python dependencies
```bash
pip install -r requirements.txt
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                  # Next.js app router pages
│   ├── home/            # Landing page with FAQ
│   ├── schedule/        # Schedule generation and viewing
│   └── staff/           # Staff management interface
├── components/
│   └── ui/              # Reusable UI components (shadcn/ui)
├── context/
│   └── StaffContext.tsx # Global state management for staff data
├── pages/api/           # API endpoints
│   ├── generateSchedule.ts  # Trigger schedule generation
│   ├── getStaff.ts         # Fetch staff data
│   ├── getSchedules.ts     # Fetch schedules
│   ├── updateStaff.ts      # Update staff information
│   └── uploadAvatar.ts     # Handle avatar uploads
├── data/                # JSON data storage
│   ├── staff.json      # Staff profiles and preferences
│   ├── schedules.json  # Generated schedules
│   └── properStaff.json # Temporary file for Python processing
└── solver/              # Python scheduling algorithm
    └── main.py         # OR-Tools Tabu Search implementation
```

## API Endpoints

### `POST /api/generateSchedule`
Triggers the Python solver to generate an optimized schedule based on current staff preferences.

**Response**: `{ message: string, output: string }`

### `GET /api/getStaff`
Retrieves all staff members with their preferences and schedules.

**Response**: `{ staff: StaffMember[] }`

### `GET /api/getSchedules`
Retrieves all generated schedules indexed by staff ID.

**Response**: `{ [staffId: number]: { [date: string]: string } }`

### `POST /api/updateStaff`
Updates staff information in the database.

**Body**: `StaffMember[]`

**Response**: `{ message: string }`

### `POST /api/uploadAvatar`
Uploads a profile picture for a staff member.

**Body**: `FormData` with `image` file and `memberID`

**Response**: `{ message: string, filePath: string }`

## Key Components

### StaffContext
Global state management using React Context API to share staff data across the application.

### EditableAvatar
Component for uploading and displaying staff profile pictures with automatic caching.

### DateNavigation
Calendar-based navigation component for browsing schedules across different dates.

## Data Format

### StaffMember
```typescript
interface StaffMember {
  ID: number;
  Name: string;
  SeniorityLevel: number;
  Preferences: {
    preferred_shifts: Array<{ day: number; shift: string; weight: number }>;
    preferred_days_off: Array<{ day: number; weight: number }>;
  };
  schedule?: { [date: string]: string };
}
```

## Known Limitations

- Manual schedule editing is not currently available (feature in development)
- Schedules are stored in JSON files (no database integration yet)
- Single-user mode (no authentication or multi-tenancy)
- Schedule export limited to PNG format

## Future Enhancements

- Comprehensive schedule customization and manual editing
- Multiple export formats (PDF, Excel, CSV)
- User authentication and role-based access control
- Audit trail for schedule changes
- Bulk staff import functionality
- Database integration for scalability

## Contributing

This is a capstone project for Queen's University. For questions or contributions, please contact the development team.

## License

Private - Queen's University Capstone Project

## Acknowledgments

- Built with Next.js and React
- UI components from shadcn/ui
- Scheduling powered by Google OR-Tools
- Icons by Lucide

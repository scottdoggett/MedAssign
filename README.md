# MedAssign
**Queen's University Capstone Project - Built by a team of 4**

A staff scheduling optimization system using constraint programming (OR-Tools CP-SAT) and Tabu Search metaheuristics. The backend implements hard constraints (minimum coverage, max shifts) and soft constraints (staff preferences, seniority), optimizing schedules to maximize employee satisfaction while meeting operational requirements. Features a simple Next.js frontend interface for data input and schedule visualization.

## Features

- **Staff Profile Management**: Add and manage staff members with seniority levels and custom avatars
- **Preference Input**: Staff can specify shift preferences and days off with priority weighting (Low, Medium, High)
- **Constraint-Based Optimization**: Backend solver enforces hard constraints (minimum coverage, max shifts) and optimizes soft constraints (preferences, seniority)
- **Schedule Generation**: Python-based OR-Tools CP-SAT solver with Tabu Search optimization
- **Schedule Visualization**: Interactive calendar view with filtering by seniority and shift type
- **Export Schedules**: Download schedules as PNG images

## Tech Stack

**Frontend:**
- Next.js 15.2.1 (React 19)
- TypeScript 5
- Tailwind CSS 4.0.12
- Radix UI (shadcn/ui components)

**Backend:**
- Next.js API routes
- Python 3 with Google OR-Tools
- Tabu Search optimization algorithm
- JSON-based data persistence

## Getting Started

### Prerequisites

- Node.js 20 or higher
- Python 3.x with pip

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd my-project
```

2. Install Node.js dependencies
```bash
npm install
```

3. Install Python dependencies
```bash
pip install -r requirements.txt
```

### Running the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

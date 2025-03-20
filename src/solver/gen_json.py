import json
import random

def generate_json(total_staff, num_days, shifts=["M", "A", "N"], output_file="generated_schedule.json"):
    """
    Generates a JSON schedule with the specified number of staff, days, and shifts.

    Each staff member will request exactly 2 preferred shifts and exactly 2 preferred days off,
    with no duplicate days in each category and no overlap between days off and preferred shifts.

    Parameters:
        total_staff (int): Number of staff members.
        num_days (int): Number of days to generate the schedule for.
        shifts (list): List of shift types.
        output_file (str): Output file name.
    """
    # Define base parameters
    schedule_data = {
        "parameters": {
            "Total Staff": total_staff,
            "shifts": shifts,
            "days": list(range(1, num_days + 1))
        },
        "staff": [],
        "objective weights": {
            "obj_fairness": 1,
            "obj_shift_preferences": 1,
            "obj_dayOff_preferences": 1,
            "obj_weekend_balance": 1,
            "obj_consecutive_workday": 1
        },
        "Rst": 3,
        "Mi": 6,
        "Li": 3,
        "B": [0, 0, 0, 0, 10, 50, 100, 1000000] + [1000000] * (num_days - 7),
        "lambda": 0.5
    }

    num_senior = max(1, total_staff // 4)  # Ensure at least 1 senior, ~25% of total staff are senior
    senior_ids = set(random.sample(range(total_staff), num_senior))  # Randomly select which staff are senior

    # Generate random staff
    for i in range(1, total_staff + 1):
        seniority = "senior" if i in senior_ids else "junior"
        
        # Build exactly 2 preferred shifts (ensuring unique days)
        num_pref_shifts = 2
        pref_shifts = {}
        while len(pref_shifts) < num_pref_shifts:
            day = random.randint(1, num_days)
            if day not in pref_shifts:
                pref_shifts[day] = {
                    "day": day,
                    "shift": random.choice(shifts),
                    "weight": random.randint(1, 50)
                }
        
        # Build exactly 2 preferred days off (ensuring unique days and no overlap with preferred shifts)
        num_pref_days_off = 2
        pref_days_off = {}
        while len(pref_days_off) < num_pref_days_off:
            day = random.randint(1, num_days)
            if day not in pref_days_off and day not in pref_shifts:
                pref_days_off[day] = {
                    "day": day,
                    "weight": random.randint(1, 50)
                }
        
        staff_member = {
            "ID": i,
            "Name": f"Staff {i}",
            "Seniority": seniority,
            "Preferences": {
                "preferred_shifts": list(pref_shifts.values()),
                "preferred_days_off": list(pref_days_off.values())
            }
        }

        schedule_data["staff"].append(staff_member)

    # Save to a JSON file
    with open(output_file, "w") as f:
        json.dump(schedule_data, f, indent=3, separators=(',', ': '))

    print(f"Successfully generated schedule for {total_staff} staff over {num_days} days and saved to '{output_file}'")

# Run script
if __name__ == "__main__":
    for week in [1, 2, 3, 4]:
        for total_staff in [16, 20, 50, 100]:
            num_days = week * 7
            generate_json(total_staff, num_days, output_file=f"{week}Week_{total_staff}StaffMixed.json")

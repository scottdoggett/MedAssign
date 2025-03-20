
def format_schedule(schedule, total_staff, arr_days, seniority_dict):
    # Format the Header using padding 
    header = "Staff ID".ljust(15)

    # Add the days to the header
    for t in arr_days:
        header += f"Day {t}".ljust(12)
        
    print(header)
    print("-" * len(header))
    
    # Print schedule row for each staff
    for i in range(total_staff):
        staff_id = i + 1
        # Retrieve the seniority for the current staff member
        seniority = seniority_dict.get(staff_id, "N/A")
        # Include both the staff ID and their seniority
        row = f"{staff_id}: {seniority}".ljust(15)
        for t in arr_days:
            # If no shift is assigned, display "-"
            if schedule[i][t] is None:
                shifts = ["-"]
            else:
                shifts = schedule[i][t] 
            # Join multiple shifts with a comma
            row += f"{','.join(shifts):<12}"
        print(row)

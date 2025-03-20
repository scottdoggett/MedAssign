def count_preferences_satisfied(initial_schedule, staff_preferences):
    satisfied_shift_preferences = 0
    total_shift_preferences = 0
    satisfied_dayOff_preferences = 0
    total_dayOff_preferences = 0
    
    print()
    for staff_id, preferences in staff_preferences.items():
        for preferred_shift in preferences.get("preferred_shifts", []):
            total_shift_preferences += 1
            day = preferred_shift["day"]
            shift = preferred_shift["shift"]
            # print(f"\nStaff {staff_id} Preferred Shift: {shift} || Scheduled Shift: {initial_schedule[staff_id - 1][day]}")
                
            if initial_schedule[staff_id - 1].get(day) is not None and shift in initial_schedule[staff_id - 1].get(day):
                satisfied_shift_preferences += 1
            
        for preferred_dayOff in preferences.get("preferred_days_off", []):
            total_dayOff_preferences += 1
            day = preferred_dayOff["day"]
            if initial_schedule[staff_id - 1][day] is None:
                satisfied_dayOff_preferences += 1
    
    return satisfied_shift_preferences, total_shift_preferences, satisfied_dayOff_preferences, total_dayOff_preferences

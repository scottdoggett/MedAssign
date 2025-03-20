from ortools.sat.python import cp_model

def add_hard_constraints(model, xist, total_staff, shift_types, arr_days, seniority_dict, Rst, Mi, Li):

    ####################### Hard Constraint 1: Shift Coverage ########################
    # Requirement: Every shift s on day t must be covered by at least R_{s,t} staff members.
    
    print("\nHard Constraint 1: Shift Coverage Constraint")
    # For every shift s
    for s in range(len(shift_types)):
        # For every day t
        for t in arr_days:
            # Create list of all staff who could work this shift on this day
            staff_working_this_shift = []
            
            for i in range(total_staff):
                # Add the decision variable x[i][s][t] to our list
                staff_working_this_shift.append(xist[(i, s, t)])

            
            # Now add the constraint: The sum of all x[i][s][t] (staff assigned) must be >= Rst
            model.Add(sum(staff_working_this_shift) >= Rst)
    
    print("Hard Constraint 1: Shift Coverage Added\n")

    # ############################## END OF CONSTRAINT 1  ##############################


    ##################### Hard Constraint 2 & 3: Wordload Maximum #####################
    # Requirement:  Each staff member i must work at least Li shifts per week w.
    #               Each staff member i can work at most Mi shifts per week w.

    print("\nHard Constraint 2 and 3: Workload Maximum and Minimum Constraints")

    # Find how many weeks have been requested for schedule generation
    # Break arr_days into consecutive 7-day chunks
    max_day = max(arr_days)  # e.g. if arr_days = [1..14], max_day = 14
    num_weeks = (max_day - 1) // 7 + 1  # day 1..7 are a part week 0, day 8..14 are a part week 1, etc.

    # For each week index gather all the days in that week
    for w in range(num_weeks):

        # Array that holds all the days in each week (organized by row)
        days_in_week = []
        for d in arr_days:
            if (d - 1) // 7 == w:
                days_in_week.append(d)

        # Ex output: 
        # Week 0: [1, 2, 3, 4, 5, 6, 7]
        # Week 1: [8, 9, 10, 11, 12, 13, 14]
        # Week 2: [15, 16, 17, 18, 19, 20, 21]
        # Week 3: [22, 23, 24, 25, 26, 27, 28]
        

        # Count how many shifts each staff member works in that week
        for i in range(total_staff):
            shifts_in_week = []
            for day in days_in_week:
                for s in range(len(shift_types)):
                    shifts_in_week.append(xist[(i, s, day)])

            # Add the constraints to the model: staff i works at least Li shifts and at most Mi shifts per week
            model.Add(sum(shifts_in_week) >= Li)
            model.Add(sum(shifts_in_week) <= Mi)

    print("Hard Constraint 2 and 3: Workload Maximum and Minimum Constraints Added\n")

    ########################### END OF CONSTRAINT 2 & 3 ############################


    ################ Hard Constraint 4: Rest and shift transisitons #################
    # Requirment 4.1: binary variable 1 if employee i is assigned to shift s on day t, 0 otherwise
    # Requirment 4.2: if employee works a night shift on day t, they cannot work morning on day t+1

    print("\nHard Constraint 4.1: No More Than One Shift Per Day Constraint")

    for i in range(total_staff): # Loop through each staff memeber
        for t in arr_days: # Loop through each day within the scheduling period 

            model.Add(sum(xist[(i, s, t)] for s in range(len(shift_types))) <=1 )
            # - xist[(i, s, t)] is a binary decision variable (1 if employee 'i' is assigned shift 's' on day 't', 0 otherwise)
            # - sum up all shifts employee i is assigned to on day t
            # - if an employee is assigned multiple shifts in a single day, the sum would exceed 1
            # - '<= 1' ensures employee cannot work more than one shift in a day

    print("Hard Constraint 4.1: No More Than One Shift Per Day Constraint Added\n")
    print("\nHard Constraint 4.2: No Night-to-Morning Turnarounds Constraint")
    night_index = shift_types.index("N") # Get index of night shift in shift_types defined as "N"
    morning_index = shift_types.index("M") # Get index of morning shift in shift_types defined as "M"

    for i in range(total_staff): # Loop through all staff members
        for t in range(len(arr_days) - 1): # Loop through all days except last one because theres no t+1

            # Add constraint: If an employee works a night shift on day 't', they cannot work a monring shift on day t+1
            model.Add(xist[(i, night_index, arr_days[t])] + xist[(i, morning_index, arr_days[t+1])] <=1 )

            # - xist[(i, night_index, arr_days[t])] is 1 if employee 'i' works a night shift on day 't', 0 otherwise
            # - xist[(i, morning_index, arr_days[t+1])] is 1 if employee 'i' works a morning shift on day t+1, 0 otherwise
            # - The sum of above must be '<=1' which means:
            #   - If employee works night shift 'N' on day 't', then morning shift 'M' on 't+1' must be 0 
            #   - If employee works morning shift 'M' on day 't+1', then night shift 'N' on 't' must be 0
    
    print("Hard Constraint 4.2: No Night-to-Morning Turnarounds Added\n")

    ############################ END OF CONSTRAINT 4.1, 4.2 #########################


    ##################### Hard Constraint 5: Minimum Staff Ratio #####################
    # Requirment: For every three junior staff working a shift, there must be at least one senior
    # get(i+1) = extracting the seniority column from seniority_d

    print("\nHard Constraint 5: Minimum Staff Ratio (Junior to Senior) Constraint")

    # Identify senior and junior employee based on the seniority dictionary
    seniors = [i for i in range(total_staff) if seniority_dict.get(i + 1) == "senior"]
    juniors = [i for i in range(total_staff) if seniority_dict.get(i + 1) == "junior"]

    # Range of total_staff starts at 0, but seniority_dict starts from 1 so i+1 to adjust


    for s in range(len(shift_types)): # Loop through all shift types , morn, aft, night
        for t in arr_days: # loop through all days in schedule
            junior_count = sum(xist[(i, s, t)] for i in juniors)  # Count juniors in shift on day t
            senior_count = sum(xist[(i, s, t)] for i in seniors)  # Count seniors in shift on day t

            model.Add(3 * senior_count >= junior_count) # Ensure 1 senior for every 3 juniors working this shift 

            # - junior_count is total num of juniors assigned to shift 's' on day 't'
            # - senior_count is total num of seniors assigned to shift 's' on day 't'
            # - if 3 junior are working, at least 1 senior must also be working on that day
            # - if 6 junior are working, at least 2 seniors must also be working on that day

    print("Hard Constraint 5: Minimum Staff Ratio (Junior to Senior) Constraint Added\n")
    ############################## END OF CONSTRAINT 5 ##############################

                        
    ####################### Hard Constraint 6: Fatigue Constraint #######################
                
    print("\nHard Constraint 6: Fatigue Constraint (Night Shifts) Constraint")

    for i in range(total_staff):
        for d_idx in range(len(arr_days) - 3):
            # The bool consecutive nights represents 
            consecutive_nights = model.NewBoolVar(f"consecutive_nights_{i}_{d_idx}")

            # Enforce: consecutive_nights = 1 if x_{i,N,d_idx} + x_{i,N,d_idx+1} == 2
            model.Add(
                xist[(i, night_index, arr_days[d_idx])] +
                xist[(i, night_index, arr_days[d_idx + 1])] == 2
            ).OnlyEnforceIf(consecutive_nights)

            # Otherwise, if it's < 2, consecutive_nights = 0
            model.Add(
                xist[(i, night_index, arr_days[d_idx])] +
                xist[(i, night_index, arr_days[d_idx + 1])] < 2
            ).OnlyEnforceIf(consecutive_nights.Not())

            # If two consecutive nights => day d_idx+2 and d_idx+3 must be off (no shifts).
            day_plus_2 = arr_days[d_idx + 2]
            day_plus_3 = arr_days[d_idx + 3]


            ##### Logic to prohibit working the next two days after working two consecutive night shifts ####

            # Array to hold all the possible shifts that come the day after two consecutive working days
            shifts_on_day_plus_2 = []

            # Loop through each shift type
            for s in range(len(shift_types)):
                # Add the assignment decision variable for staff i on shift s on day day_plus_2
                shifts_on_day_plus_2.append(xist[(i, s, day_plus_2)])

            # If consecutive_nights is true, staff i cannot work on day_plus_2
            model.Add(sum(shifts_on_day_plus_2) == 0).OnlyEnforceIf(consecutive_nights)


            # Array to hold all the possible shifts that come the second day after two consecutive working days
            shifts_on_day_plus_3 = []

            # Loop through each shift type again (day_plus_3)
            for s in range(len(shift_types)):
                # Add the assignment decision variable for staff i on shift s on day day_plus_3
                shifts_on_day_plus_3.append(xist[(i, s, day_plus_3)])

            # If consecutive_nights is true, staff i cannot work on day_plus_3
            model.Add(sum(shifts_on_day_plus_3) == 0).OnlyEnforceIf(consecutive_nights)

    print("Hard Constraint 6: Fatigue Constraint (Night Shifts) Constraint Added\n")

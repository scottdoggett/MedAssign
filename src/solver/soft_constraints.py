from ortools.sat.python import cp_model

def add_shift_preferences_penalties(model, xist, staff_preferences, seniority_dict, lambda1, objective_weight, shift_types):
    penalties = []

    for staff_id, preferences in staff_preferences.items():
        staff_index = staff_id - 1
        seniority = 1 if seniority_dict[staff_id] == "senior" else 0

        for pref in preferences.get('preferred_shifts', []):
            day = pref['day']
            shift_label = pref['shift']
            pist = pref['weight']

            shift_index = shift_types.index(shift_label)
            assigned_var = xist[(staff_index, shift_index, day)]

            penalty_var = model.NewBoolVar(f"shift_pref_penalty_{staff_index}_{day}_{shift_label}")
            model.Add(assigned_var == 0).OnlyEnforceIf(penalty_var)
            model.Add(assigned_var == 1).OnlyEnforceIf(penalty_var.Not())

            penalty_value = (1 + lambda1 * seniority) * pist * penalty_var
            penalties.append(objective_weight * penalty_value)

    return penalties

def add_dayoff_preferences_penalties(model, xist, staff_preferences, seniority_dict, lambda1, objective_weight, shift_types):
    penalties = []

    for staff_id, preferences in staff_preferences.items():
        staff_index = staff_id - 1
        seniority = 1 if seniority_dict[staff_id] == "senior" else 0

        for pref in preferences.get('preferred_days_off', []):
            day = pref['day']
            qist = pref['weight']

            working_vars = [xist[(staff_index, s_index, day)] for s_index in range(len(shift_types))]

            is_working = model.NewBoolVar(f"working_on_dayoff_{staff_index}_{day}")
            model.Add(sum(working_vars) > 0).OnlyEnforceIf(is_working)
            model.Add(sum(working_vars) == 0).OnlyEnforceIf(is_working.Not())

            penalty_value = (1 + lambda1 * seniority) * qist * is_working
            penalties.append(objective_weight * penalty_value)

    return penalties

def add_weekend_balance_penalties(model, xist, arr_days, shift_types, objective_weight):
    penalties = []
    total_staff = len(set([i for (i, s, t) in xist.keys()]))

    weekend_days = [t for t in arr_days if (t % 7 == 6) or (t % 7 == 0)]
    total_weekend_shifts = []
    staff_weekend_shifts = {}

    for staff_index in range(total_staff):
        shifts_assigned = []
        for day in weekend_days:
            working_vars = [xist[(staff_index, s_index, day)] for s_index in range(len(shift_types))]
            staff_day_work = model.NewIntVar(0, 1, f"staff_{staff_index}_weekend_day_{day}")
            model.AddMaxEquality(staff_day_work, working_vars)
            shifts_assigned.append(staff_day_work)
            total_weekend_shifts.append(staff_day_work)

        staff_weekend_shifts[staff_index] = model.NewIntVar(0, len(weekend_days), f"staff_{staff_index}_total_weekend_shifts")
        model.Add(staff_weekend_shifts[staff_index] == sum(shifts_assigned))

    avg_total_weekend_shifts = model.NewIntVar(0, len(weekend_days) * total_staff, "avg_total_weekend_shifts")

    # Use "AddDivisionEquality since we can't do // in OR Tools"
    model.AddDivisionEquality(avg_total_weekend_shifts, sum(total_weekend_shifts), total_staff)

    for staff_index in range(total_staff):
        diff = model.NewIntVar(-len(weekend_days), len(weekend_days), f"weekend_diff_{staff_index}")
        model.Add(diff == staff_weekend_shifts[staff_index] - avg_total_weekend_shifts)

        square_diff = model.NewIntVar(0, len(weekend_days)**2, f"weekend_square_diff_{staff_index}")
        model.AddMultiplicationEquality(square_diff, [diff, diff])
        penalties.append(objective_weight * square_diff)

    return penalties

def add_fair_shift_distribution_penalties(model, xist, arr_days, shift_types, objective_weight):
    penalties = []
    total_staff = len(set([i for (i, s, t) in xist.keys()]))

    staff_shift_totals = {}
    all_shifts = []

    for staff_index in range(total_staff):
        shifts_assigned = []
        for day in arr_days:
            working_vars = [xist[(staff_index, s_index, day)] for s_index in range(len(shift_types))]
            staff_day_work = model.NewIntVar(0, 1, f"staff_{staff_index}_day_{day}")
            model.AddMaxEquality(staff_day_work, working_vars)
            shifts_assigned.append(staff_day_work)
            all_shifts.append(staff_day_work)

        staff_shift_totals[staff_index] = model.NewIntVar(0, len(arr_days), f"staff_{staff_index}_total_shifts")
        model.Add(staff_shift_totals[staff_index] == sum(shifts_assigned))

    avg_shifts = model.NewIntVar(0, len(arr_days), "avg_shifts")
    model.AddDivisionEquality(avg_shifts, sum(all_shifts), total_staff)

    for staff_index in range(total_staff):
        diff = model.NewIntVar(-len(arr_days), len(arr_days), f"shift_diff_{staff_index}")
        model.Add(diff == staff_shift_totals[staff_index] - avg_shifts)

        square_diff = model.NewIntVar(0, len(arr_days)**2, f"shift_square_diff_{staff_index}")
        model.AddMultiplicationEquality(square_diff, [diff, diff])
        penalties.append(objective_weight * square_diff)

    return penalties

def add_consecutive_workday_penalties(model, xist, arr_days, shift_types, arr_B, objective_weight):
    penalties = []
    total_staff = len(set([i for (i, s, t) in xist.keys()]))

    for staff_index in range(total_staff):
        consecutive_counter = 0
        for day in arr_days:
            working_vars = [xist[(staff_index, s_index, day)] for s_index in range(len(shift_types))]

            is_working = model.NewBoolVar(f"is_working_{staff_index}_{day}")
            model.Add(sum(working_vars) > 0).OnlyEnforceIf(is_working)
            model.Add(sum(working_vars) == 0).OnlyEnforceIf(is_working.Not())

            # In CP-SAT, modeling a consecutive counter is tricky. Simplified approach here for illustrative purposes.
            # Real implementation may use automaton constraints for complex consecutive patterns.
            penalties.append(objective_weight * arr_B[0] * is_working)

    return penalties

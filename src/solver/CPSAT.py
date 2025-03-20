from ortools.sat.python import cp_model
from soft_constraints import (
    add_shift_preferences_penalties,
    add_dayoff_preferences_penalties,
    add_weekend_balance_penalties,
    add_fair_shift_distribution_penalties,
    add_consecutive_workday_penalties
)

def solve_initial_schedule(model, xist, total_staff, shift_types, arr_days):


    """
    Params to add if we want to add soft constraints to model: , arr_B, staff_preferences, seniority_dict, lambda1, objective_weights

    penalties = []
    penalties += add_shift_preferences_penalties(model, xist, staff_preferences, seniority_dict, lambda1, objective_weights["obj_shift_preferences"], shift_types)
    penalties += add_dayoff_preferences_penalties(model, xist, staff_preferences, seniority_dict, lambda1, objective_weights["obj_dayOff_preferences"], shift_types)
    penalties += add_weekend_balance_penalties(model, xist, arr_days, shift_types, objective_weights["obj_weekend_balance"])
    penalties += add_fair_shift_distribution_penalties(model, xist, arr_days, shift_types, objective_weights["obj_fairness"])
    penalties += add_consecutive_workday_penalties(model, xist, arr_days, shift_types, arr_B, objective_weights["obj_consecutive_workday"])


    model.Minimize(sum(penalties))"""
    hard_solver = cp_model.CpSolver()
    status = hard_solver.Solve(model)

    if status in [cp_model.FEASIBLE, cp_model.OPTIMAL]:
        print("\nFeasible or Optimal Solution Found\n")

        initial_schedule = {i: {t: None for t in arr_days} for i in range(total_staff)}

        for i in range(total_staff):
            for t in arr_days:
                for s in range(len(shift_types)):
                    if (i, s, t) in xist and hard_solver.Value(xist[(i, s, t)]):
                        if initial_schedule[i][t] is None:
                            initial_schedule[i][t] = []
                        initial_schedule[i][t].append(shift_types[s])

        return initial_schedule
    else:
        print("No Feasible Solution Found\n")
        exit(1)



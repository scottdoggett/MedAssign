from calc_happiness_score import count_preferences_satisfied
from calculateSoftConstraints import calculateSoftConstraints

def print_final_schedule_summary(final_schedule, staff_list, staff_preferences, objective_weights,
                                 arr_days, shift_types, seniority_dict, arr_B, lambda1):
    """
    Prints detailed evaluation metrics for the final schedule.

    Args:
        final_schedule (dict): The final schedule dictionary.
        staff_list (list): List of staff members.
        staff_preferences (dict): Staff preferences.
        objective_weights (dict): Objective weights dictionary.
        arr_days (list): List of days.
        shift_types (list): List of shift types.
        seniority_dict (dict): Staff seniority dictionary.
        arr_B (list): Consecutive workday penalty array.
        lambda1 (float): Seniority penalty factor.
    """

    print("\n========== FINAL SCHEDULE SUMMARY ==========\n")

    # Create an instance of the soft constraints calculator
    soft_constraint_calculator = calculateSoftConstraints(
        staff_list=list(staff_preferences.keys()),
        arr_days=arr_days,
        shift_types=shift_types,
        seniority_dict=seniority_dict,
        arr_B=arr_B,
        lambda1=lambda1,
        staff_preferences=staff_preferences,
        objective_weights=objective_weights
    )

    # Calculate and print the objective function score (the lower, the better in your current setup)
    total_objective_score = soft_constraint_calculator.objectiveFunction(final_schedule)
    print(f"Total Objective Function Score: {total_objective_score:.2f}")

    # Optional: Print individual penalties (by calling each penalty function separately)
    fairness_penalty = soft_constraint_calculator.fair_shift_distribution(final_schedule)
    shift_preference_penalty = soft_constraint_calculator.shift_preferences(final_schedule)
    day_off_penalty = soft_constraint_calculator.dayOff_preferences(final_schedule)
    weekend_balance_penalty = soft_constraint_calculator.weekend_balance(final_schedule)
    consecutive_workday_penalty = soft_constraint_calculator.consecutive_workday(final_schedule)

    print(f"Fairness Penalty: {fairness_penalty:.2f}")
    print(f"Shift Preferences Penalty: {shift_preference_penalty:.2f}")
    print(f"Day-Off Preferences Penalty: {day_off_penalty:.2f}")
    print(f"Weekend Balance Penalty: {weekend_balance_penalty:.2f}")
    print(f"Consecutive Workday Penalty: {consecutive_workday_penalty:.2f}\n")

    # Count and print preference satisfaction rates
    satisfied_shifts, total_shifts, satisfied_days_off, total_days_off = count_preferences_satisfied(final_schedule, staff_preferences)

    shift_pref_percent = (satisfied_shifts / total_shifts) * 100 if total_shifts > 0 else 0
    dayoff_pref_percent = (satisfied_days_off / total_days_off) * 100 if total_days_off > 0 else 0

    print(f"Staff Preference Satisfaction:")
    print(f"   - Shift Preferences: {satisfied_shifts}/{total_shifts} ({shift_pref_percent:.2f}%)")
    print(f"   - Day-Off Preferences: {satisfied_days_off}/{total_days_off} ({dayoff_pref_percent:.2f}%)")

    print("\n============================================\n")

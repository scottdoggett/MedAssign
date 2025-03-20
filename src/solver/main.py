import argparse
from input_handler import load_schedule
from CPSAT import  solve_initial_schedule 
from binary_decision_variable import binary_decision_variable_x
from hard_constraints import add_hard_constraints
from scheduleFormat import format_schedule
from TabuSearch import TabuSearch
from calculateSoftConstraints import calculateSoftConstraints
from ortools.sat.python import cp_model
from calc_happiness_score import count_preferences_satisfied
from final_schedule_summary import print_final_schedule_summary
import json
from datetime import datetime, timedelta

def main():
    cmd_parser = argparse.ArgumentParser(description="Parsing the json file")
    cmd_parser.add_argument("file", help="json file name")
    args = cmd_parser.parse_args()
    schedule_data_dict = load_schedule(args.file)
    schedule_data_dict.display()

    model = cp_model.CpModel()

    # Parse out dicts in json file
    total_staff = schedule_data_dict.parameters.get("Total Staff")
    shift_types = schedule_data_dict.parameters.get("shifts", [])
    arr_days = schedule_data_dict.parameters.get("days", [])
    # Mapping of each staff to their seniority and preferences for easy look-up
    seniority_dict = {staff.ID: staff.Seniority for staff in schedule_data_dict.staff}
    staff_preferences = {staff.ID: staff.Preferences for staff in schedule_data_dict.staff}
    # Get objective weights
    objective_weights = schedule_data_dict.objective_weights
    # Check the format of the parameters
    # print(f"[DEBUG] The objective weights structure is:\n {objective_weights.keys()}")

    # print(f"\nExtracted Schedule Parameters:")
    # print(f"   - Total Staff: {total_staff}")
    # print(f"   - Shift Types: {shift_types}")
    # print(f"   - Total Days: {len(arr_days)}")
    # print(f"        - Days: {arr_days}")

    # print(f"\nSeniority Breakdown:")
    for i in range(total_staff):
        staff_id = i + 1
        # print(f"   - Staff Member ({staff_id}): {seniority_dict.get(staff_id)}")

    Rst = schedule_data_dict.Rst
    Mi = schedule_data_dict.Mi
    Li = schedule_data_dict.Li
    arr_B = schedule_data_dict.B
    lambda1 = schedule_data_dict.lambda1

    # print(f"\nConstraint Parameters:")
    # print(f"   - Rst: {Rst}")
    # print(f"   - Mi: {Mi}")
    # print(f"   - Li: {Li}")
    # print(f"   - B: {arr_B}")
    # print(f"   - Lambda: {lambda1}")

    xist = binary_decision_variable_x(model, total_staff, shift_types, arr_days)

    add_hard_constraints(model, xist, total_staff, shift_types, arr_days, seniority_dict, Rst, Mi, Li)

    initial_schedule = solve_initial_schedule(model, xist, total_staff, shift_types, arr_days)

    # Old version where soft constraints are given to OR tools 
    # initial_schedule = solve_initial_schedule(model, xist, total_staff, shift_types, arr_days, arr_B, staff_preferences, seniority_dict, lambda1, objective_weights)

    format_schedule(initial_schedule, total_staff, arr_days, seniority_dict)
    
    # objective_weights = schedule_data_dict.obj_weights
    # print(f"\nObjective Weights:")
    # for soft, weight in objective_weights.items():
    #     print(f"    - {soft}: {weight}")


    # Create the evaluator (calculateSoftConstraints instance)
    objective_function_instance = calculateSoftConstraints(
        staff_list=schedule_data_dict.staff,
        staff_preferences=staff_preferences,
        seniority_dict=seniority_dict,
        arr_days=arr_days,
        shift_types=shift_types,
        arr_B=arr_B,
        lambda1=lambda1,
        objective_weights=objective_weights
    )
    
    # Create the TabuSearch instance with additional hard constraint parameters
    tabu_search_instance = TabuSearch(
        initial_schedule=initial_schedule,
        objective_function=objective_function_instance,
        shift_types=shift_types,
        arr_days=arr_days,
        total_staff=total_staff,
        seniority_dict=seniority_dict,
        Rst=Rst,
        Li=Li,
        Mi=Mi,
        max_iter=101,
        max_size=10,
        num_neighbour_schedule=10
    )
    
    optimized_schedule = tabu_search_instance.search()
    new_penalty = objective_function_instance.objectiveFunction(optimized_schedule)
    # print(f"\nNew Schedule Penalty after Tabu Search: {new_penalty}")
    
    # print("\nOptimized Schedule:")
    format_schedule(optimized_schedule, total_staff, arr_days, seniority_dict)

    satisfied_shift_preferences, total_shift_preferences, satisfied_dayOff_preferences, total_dayOff_preferences = count_preferences_satisfied(initial_schedule, staff_preferences)

    # print(f"\nStaff Preference Satisfaction:")
    # print(f"   - Shift Preferences: {satisfied_shift_preferences}/{total_shift_preferences}")
    # print(f"   - Day-Off Preferences: {satisfied_dayOff_preferences}/{total_dayOff_preferences}")


    print_final_schedule_summary(
    final_schedule=optimized_schedule,
    staff_list=total_staff,
    staff_preferences=staff_preferences,
    objective_weights=objective_weights,
    arr_days=arr_days,
    shift_types=shift_types,
    seniority_dict=seniority_dict,
    arr_B=arr_B,
    lambda1=lambda1
)
        
    # Define today's date
    today = datetime.today()

    # Mapping of shifts to time ranges
    shift_time_mapping = {
        "M": "7 AM - 3 PM",
        "A": "3 PM - 1 AM",
        "N": "1 AM - 7 AM"
    }

    # Initialize an empty dictionary for the schedule
    schedule_json = {}

    # Iterate over the optimized schedule and format it properly
    for staff_id, shifts in optimized_schedule.items():
        staff_schedule = {}

        for day_index, shift_list in shifts.items():
            if shift_list:  # Ensure there's a shift assigned
                shift_name = shift_list[0]  # Extract the shift (assuming only one shift per day)
                if shift_name in shift_time_mapping:
                    # Calculate the actual date
                    shift_date = today + timedelta(days=day_index - 1)  # Convert index to real date
                    formatted_date = shift_date.strftime("%Y-%m-%d")

                    # Save mapped shift time
                    staff_schedule[formatted_date] = shift_time_mapping[shift_name]

        # Only add staff schedules if they have shifts assigned
        if staff_schedule:
            schedule_json[str(staff_id + 1)] = staff_schedule  # Convert staff ID to 1-based index

    # Save schedule to a JSON file
    output_path = "src/data/schedules.json"

    with open(output_path, "w") as json_file:
        json.dump(schedule_json, json_file, indent=4)

    print(f"✅ Schedule successfully saved to {output_path}")






if __name__ == "__main__":
    main()
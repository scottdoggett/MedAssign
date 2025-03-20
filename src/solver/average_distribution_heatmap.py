import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import json
from input_handler import load_schedule
from CPSAT import solve_initial_schedule
from binary_decision_variable import binary_decision_variable_x
from hard_constraints import add_hard_constraints
from TabuSearch import TabuSearch
from calculateSoftConstraints import calculateSoftConstraints
from ortools.sat.python import cp_model

# Load the JSON file
JSON_FILE = "2Week_20StaffMixed.json"
schedule_data_dict = load_schedule(JSON_FILE)

# Extract parameters
total_staff = schedule_data_dict.parameters.get("Total Staff")
shift_types = schedule_data_dict.parameters.get("shifts", [])
arr_days = schedule_data_dict.parameters.get("days", [])
seniority_dict = {staff.ID: staff.Seniority for staff in schedule_data_dict.staff}

Rst = schedule_data_dict.Rst
Mi = schedule_data_dict.Mi
Li = schedule_data_dict.Li
arr_B = schedule_data_dict.B
lambda1 = schedule_data_dict.lambda1
objective_weights = schedule_data_dict.objective_weights

# Create constraint model
model = cp_model.CpModel()
xist = binary_decision_variable_x(model, total_staff, shift_types, arr_days)

# Apply hard constraints
add_hard_constraints(model, xist, total_staff, shift_types, arr_days, seniority_dict, Rst, Mi, Li)

# Function to extract shift **counts** (ignoring shift type) into a matrix
def extract_shift_count_matrix(schedule, total_staff, arr_days):
    matrix = np.zeros((total_staff, len(arr_days)))  # Initialize with zeros
    for i in range(total_staff):
        for day_idx, day in enumerate(arr_days):
            assigned_shifts = schedule.get(i, {}).get(day, [])  # Get shifts assigned
            matrix[i, day_idx] = len(assigned_shifts) if assigned_shifts else 0  # Count of shifts worked
    return matrix

# Function to generate 10 independent schedules and average them
def generate_averaged_workload_heatmap():
    average_matrix = np.zeros((total_staff, len(arr_days)))

    for iteration in range(10):
        print(f"Generating Schedule {iteration + 1}")

        # Generate a fresh initial schedule each time
        initial_schedule = solve_initial_schedule(model, xist, total_staff, shift_types, arr_days)

        # Create a new Tabu Search instance for each iteration
        tabu_search_instance = TabuSearch(
            initial_schedule=initial_schedule,  # Fresh start each time
            objective_function=calculateSoftConstraints(
                staff_list=schedule_data_dict.staff,
                staff_preferences={staff.ID: staff.Preferences for staff in schedule_data_dict.staff},
                seniority_dict=seniority_dict,
                arr_days=arr_days,
                shift_types=shift_types,
                arr_B=arr_B,
                lambda1=lambda1,
                objective_weights=objective_weights
            ),
            shift_types=shift_types,
            arr_days=arr_days,
            total_staff=total_staff,
            seniority_dict=seniority_dict,
            Rst=Rst,
            Li=Li,
            Mi=Mi,
            max_iter=100,
            max_size=10,
            num_neighbour_schedule=10
        )

        # Run Tabu Search to generate a schedule
        optimized_schedule = tabu_search_instance.search()
        shift_matrix = extract_shift_count_matrix(optimized_schedule, total_staff, arr_days)
        average_matrix += shift_matrix  # Accumulate shift distributions

    # Compute the average over 10 independent schedules
    average_matrix /= 10

    # Plot the heatmap
    plt.figure(figsize=(12, 6))
    sns.heatmap(average_matrix, cmap="coolwarm", annot=True, fmt=".2f", linewidths=0.5)

    # Labels
    plt.xlabel("Days")
    plt.ylabel("Staff ID")
    plt.title(f"Averaged Shift Workload Heatmap Across 10 Independent Schedules for {JSON_FILE}")
    plt.show()

# Run the function
if __name__ == "__main__":
    generate_averaged_workload_heatmap()

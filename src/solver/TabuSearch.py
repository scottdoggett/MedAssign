import copy
from TabuList import TabuList
from Neighbourhood import create_Neighbourhood
from scheduleFormat import format_schedule

class TabuSearch:
    def __init__(self, initial_schedule, objective_function, shift_types, arr_days, total_staff, seniority_dict, Rst, Li, Mi, max_iter, max_size, num_neighbour_schedule):
        # print("[DEBUG] Initializing TabuSearch")
        self.current_schedule = copy.deepcopy(initial_schedule)
        self.best_schedule = copy.deepcopy(initial_schedule)
        self.objective_function = objective_function
        self.shift_types = shift_types
        self.arr_days = arr_days
        self.total_staff = total_staff
        self.seniority_dict = seniority_dict
        self.Rst = Rst
        self.Li = Li
        self.Mi = Mi
        self.max_iter = max_iter
        self.max_size = max_size
        self.num_neighbour_schedule = num_neighbour_schedule
        self.tabu_list = TabuList(max_size)
        # print(f"[DEBUG] Total Staff: {self.total_staff}, Days: {self.arr_days}, Shift Types: {self.shift_types}")
        # print(f"[DEBUG] Rst: {self.Rst}, Li: {self.Li}, Mi: {self.Mi}, Max Iter: {self.max_iter}, Tabu List Size: {self.max_size}")
    
    def search(self):
        # print("[DEBUG] Starting Tabu Search")
        best_objective_function = self.objective_function.objectiveFunction(self.current_schedule)
        # print(f"[DEBUG] Initial best objective function: {best_objective_function}")
        arr_best_objective_function = [best_objective_function]
        for iter in range(self.max_iter):
            # print(f"[DEBUG] Iteration {iter} start.")
            neighbours = create_Neighbourhood(self.current_schedule, self.shift_types, self.num_neighbour_schedule)
            # print(f"[DEBUG] Generated {len(neighbours)} neighbours.")
            best_candidate = None
            best_candidate_objective_function = float('inf')
            for neighbour, move in neighbours:
                # print(f"[DEBUG] Considering neighbour with move: {move}")
                if self.tabu_list.checkMove(move):
                    # print(f"[DEBUG] Move {move} is in tabu list. Skipping.")
                    continue
                
                if not self.checkFeasibility(neighbour):
                    # print(f"[DEBUG] Neighbour with move {move} failed feasibility check. Skipping.")
                    continue
                
                candidate_objective_function = self.objective_function.objectiveFunction(neighbour)
                # print(f"[DEBUG] Candidate objective function for move {move}: {candidate_objective_function}")
                if candidate_objective_function < best_candidate_objective_function:
                    best_candidate = (neighbour, move)
                    best_candidate_objective_function = candidate_objective_function
                    # print(f"[DEBUG] New best candidate found with objective function: {best_candidate_objective_function}")
                
            if best_candidate is None:
                # print("[DEBUG] No valid candidate found in this iteration. Breaking out.")
                break

            best_candidate_schedule = best_candidate[0]
            best_candidate_move = best_candidate[1]
            self.current_schedule = best_candidate_schedule
            self.tabu_list.move(best_candidate_move)
            print("\n-------------------------------------------------------------------------------------")
            print("\n                                    Iteration %d                                     \n" % iter)
            print("-------------------------------------------------------------------------------------")
            # format_schedule(best_candidate_schedule, self.total_staff, self.arr_days, self.seniority_dict)
            print(f"\nCurrent Best Objective function: {best_objective_function}")
            print(f"Best Candidate Objective function: {best_candidate_objective_function}")
            print("-------------------------------------------------------------------------------------")
            if best_candidate_objective_function < best_objective_function:
                best_objective_function = best_candidate_objective_function
                self.best_schedule = copy.deepcopy(self.current_schedule)
                # print(f"[DEBUG] New best objective function found: {best_objective_function}")
            arr_best_objective_function.append(best_objective_function)
        
        # print("[DEBUG] Tabu Search completed. Plotting objective function progression.")
        return self.best_schedule
    
    def checkFeasibility(self, schedule):
        """
        Check that the candidate schedule satisfies all hard constraints.
        Assumes schedule is a dict: { staff_index: { day: [shift] or None } }.
        """
        # --- Constraint 1: Shift Coverage ---
        for s_idx, shift in enumerate(self.shift_types):
            for day in self.arr_days:
                count = 0
                for i in range(self.total_staff):
                    assignment = schedule[i].get(day, None)
                    if assignment is not None and shift in assignment:
                        count += 1
                if count < self.Rst:
                    # print(f"[DEBUG] Feasibility failed: Shift coverage constraint not met for shift {shift} on day {day}. Count: {count}, Required: {self.Rst}")
                    return False

        # --- Constraint 2 & 3: Workload per Week ---
        max_day = max(self.arr_days)
        num_weeks = (max_day - 1) // 7 + 1
        for w in range(num_weeks):
            days_in_week = [d for d in self.arr_days if (d - 1) // 7 == w]
            for i in range(self.total_staff):
                shifts_in_week = 0
                for day in days_in_week:
                    if schedule[i].get(day, None) is not None:
                        shifts_in_week += 1
                if shifts_in_week < self.Li or shifts_in_week > self.Mi:
                    # print(f"[DEBUG] Feasibility failed: Workload per week constraint not met for staff {i} in week {w}. Shifts: {shifts_in_week}, Required between: {self.Li} and {self.Mi}")
                    return False

        # --- Constraint 4.1: At Most One Shift Per Day ---
        for i in range(self.total_staff):
            for day in self.arr_days:
                assignment = schedule[i].get(day, None)
                if assignment is not None and len(assignment) > 1:
                    # print(f"[DEBUG] Feasibility failed: More than one shift assigned to staff {i} on day {day}. Assignment: {assignment}")
                    return False

        # --- Constraint 4.2: No Night-to-Morning Turnaround ---
        sorted_days = sorted(self.arr_days)
        for i in range(self.total_staff):
            for idx in range(len(sorted_days) - 1):
                day = sorted_days[idx]
                next_day = sorted_days[idx + 1]
                assignment = schedule[i].get(day, None)
                next_assignment = schedule[i].get(next_day, None)
                if assignment is not None and "N" in assignment:
                    if next_assignment is not None and "M" in next_assignment:
                        # print(f"[DEBUG] Feasibility failed: Night-to-morning turnaround for staff {i} from day {day} to {next_day}. Assignments: {assignment}, {next_assignment}")
                        return False

        # --- Constraint 5: Minimum Staff Ratio ---
        for _, shift in enumerate(self.shift_types):
            for day in self.arr_days:
                junior_count = 0
                senior_count = 0
                for i in range(self.total_staff):
                    assignment = schedule[i].get(day, None)
                    if assignment is not None and shift in assignment:
                        if self.seniority_dict.get(i + 1, "").lower() == "senior":
                            senior_count += 1
                        elif self.seniority_dict.get(i + 1, "").lower() == "junior":
                            junior_count += 1
                if 3 * senior_count < junior_count:
                    # print(f"[DEBUG] Feasibility failed: Minimum staff ratio constraint not met for shift {shift} on day {day}. Senior count: {senior_count}, Junior count: {junior_count}")
                    return False

        # --- Constraint 6: Fatigue Constraint ---
        for i in range(self.total_staff):
            for idx in range(len(sorted_days) - 3):
                d1 = sorted_days[idx]
                d2 = sorted_days[idx + 1]
                d3 = sorted_days[idx + 2]
                d4 = sorted_days[idx + 3]
                assign1 = schedule[i].get(d1, None)
                assign2 = schedule[i].get(d2, None)
                if (assign1 is not None and "N" in assign1) and (assign2 is not None and "N" in assign2):
                    assign3 = schedule[i].get(d3, None)
                    assign4 = schedule[i].get(d4, None)
                    if (assign3 is not None and len(assign3) > 0) or (assign4 is not None and len(assign4) > 0):
                        # print(f"[DEBUG] Feasibility failed: Fatigue constraint for staff {i} starting at day {d1}. Assignments: {assign1}, {assign2}, {assign3}, {assign4}")
                        return False

        # print("[DEBUG] Schedule passed feasibility check.")
        return True
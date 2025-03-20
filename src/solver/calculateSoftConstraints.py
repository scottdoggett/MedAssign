class calculateSoftConstraints:
    def __init__(self, staff_list, arr_days, shift_types, seniority_dict, arr_B, lambda1, staff_preferences, objective_weights):
        # print("[DEBUG] Initializing calculateSoftConstraints")
        self.staff_list = staff_list
        self.total_staff = len(staff_list)
        self.arry_days = arr_days
        self.shift_types = shift_types
        self.seniority_dict = seniority_dict
        self.arr_B = arr_B
        self.lambda1 = lambda1
        self.staff_preferences = staff_preferences  # assume keys are 1-indexed
        self.objective_weights = objective_weights
        # print(f"[DEBUG] Total staff: {self.total_staff}, Days: {self.arry_days}, Shift Types: {self.shift_types}")
        # print(f"[DEBUG] Objective Weights: {self.objective_weights}")

    def objectiveFunction(self, schedule):
        # print("[DEBUG] Calculating objective function...")
        objective_function = 0
        
        if "obj_fairness" in self.objective_weights:
            fairness_penalty = self.fair_shift_distribution(schedule)
            objective_function += self.objective_weights["obj_fairness"] * fairness_penalty
            # print(f"\nFairness Penalty: {fairness_penalty}")
            # print(f"Objective Function After Fairness Penalty: {objective_function}")

        if "obj_shift_preferences" in self.objective_weights:
            shift_preference_penalty = self.shift_preferences(schedule)
            objective_function += self.objective_weights["obj_shift_preferences"] * shift_preference_penalty
            print(f"\nShift Preference Penalty: {shift_preference_penalty}")
            print(f"Objective Function After Shift Preference Penalty: {objective_function}")

        if "obj_dayOff_preferences" in self.objective_weights:
            dayOff_preferences_penalty = self.dayOff_preferences(schedule)
            objective_function += self.objective_weights["obj_dayOff_preferences"] * dayOff_preferences_penalty
            # print(f"\nDay Off Preferences Penalty: {dayOff_preferences_penalty}")            
            # print(f"Objective Function After Day Off Preferences Penalty: {objective_function}")
       
        if "obj_weekend_balance" in self.objective_weights:
            weekend_balance_penalty = self.weekend_balance(schedule)
            objective_function += self.objective_weights["obj_weekend_balance"] * weekend_balance_penalty
            # print(f"\nWeekend Balance Penalty: {weekend_balance_penalty}")            
            # print(f"Objective Function After Weekend Balance Penalty: {objective_function}")
        
        if "obj_consecutive_workday" in self.objective_weights:
            consecutive_workday_penalty = self.consecutive_workday(schedule)
            objective_function += self.objective_weights["obj_consecutive_workday"] * consecutive_workday_penalty
            # print(f"\nConsecutive Workday Penalty: {consecutive_workday_penalty}")            
            # print(f"\nObjective Function After Consecutive Workday Penalty: {objective_function}")

        # print(f"[DEBUG] Final Objective Function: {objective_function}")
        return objective_function

    def fair_shift_distribution(self, schedule):
        # print("[DEBUG] Evaluating fair shift distribution...")
        Xi = []
        for i in range(self.total_staff):
            assigned_shifts_i = 0
            for t in self.arry_days:
                if schedule[i][t] is not None:
                    assigned_shifts_i += 1
            Xi.append(assigned_shifts_i)
            # print(f"[DEBUG] Staff {i}: Assigned Shifts = {assigned_shifts_i}")

        total_shifts = sum(Xi)
        avgX = total_shifts / self.total_staff
        # print(f"[DEBUG] Total shifts: {total_shifts}, Average shifts per staff: {avgX}")

        fairness_penalty = 0
        for i in range(self.total_staff):
            diff_Xi_avgX = Xi[i] - avgX
            fairness_penalty += diff_Xi_avgX * diff_Xi_avgX
            # print(f"[DEBUG] Staff {i}: Diff = {diff_Xi_avgX}, Running Fairness Penalty = {fairness_penalty}")
        
        return fairness_penalty

    def shift_preferences(self, schedule):
        # print("[DEBUG] Evaluating shift preferences...")
        shift_preference_penalty = 0

        # Note: We assume staff_preferences keys are 1-indexed, so subtract 1 when accessing schedule.
        for i, preferences in self.staff_preferences.items():
            index = i - 1
            seniority = 1 if self.seniority_dict[i] == "senior" else 0
            # print(f"[DEBUG] Staff {i} (Seniority: {seniority}) Preferences: {preferences}")
            for preferred_shift in preferences.get("preferred_shifts", []):
                t = preferred_shift["day"]
                s = preferred_shift["shift"]
                pist = preferred_shift["weight"]
                assigned_shift = schedule[index].get(t, None)
                # print(f"[DEBUG] Staff {i} - Preferred shift on day {t}, shift: {s}, weight: {pist}, Assigned shift: {assigned_shift}")
                
                if assigned_shift is None or s not in assigned_shift:
                    penalty = (1 + self.lambda1 * seniority) * pist
                    shift_preference_penalty += penalty
                    # print(f"[DEBUG] Staff {i}: Shift preference unmet. Adding penalty: {penalty}")

        # print(f"[DEBUG] Total shift preference penalty: {shift_preference_penalty}")
        return shift_preference_penalty
    
    def dayOff_preferences(self, schedule):
        # print("[DEBUG] Evaluating day off preferences...")
        dayOff_preferences = 0

        # Again, convert staff key to 0-indexed
        for i, preferences in self.staff_preferences.items():
            index = i - 1
            seniority = 1 if self.seniority_dict[i] == "senior" else 0
            # print(f"[DEBUG] Staff {i} (Seniority: {seniority}) Day Off Preferences: {preferences}")
            for preferred_dayOff in preferences.get("preferred_days_off", []):
                t = preferred_dayOff["day"]
                qist = preferred_dayOff["weight"]
                assigned_shift = schedule[index].get(t, None)
                # print(f"[DEBUG] Staff {i} - Preferred day off: {t}, weight: {qist}, Assigned shift: {assigned_shift}")
                
                if assigned_shift is not None and len(assigned_shift) > 0:
                    penalty = (1 + self.lambda1 * seniority) * qist
                    dayOff_preferences += penalty
                    # print(f"[DEBUG] Staff {i}: Day off preference unmet. Adding penalty: {penalty}")

        # print(f"[DEBUG] Total day off preference penalty: {dayOff_preferences}")
        return dayOff_preferences
    
    def weekend_balance(self, schedule):
        # print("[DEBUG] Evaluating weekend balance...")
        W = []
        for t in self.arry_days:
            if (t % 7 == 6) or (t % 7 == 0):
                W.append(t)
        # print(f"[DEBUG] Weekend days: {W}")
        
        WXi = []
        for i in range(self.total_staff):
            assigned_shifts_i = 0
            for t in W:
                if schedule[i][t] is not None:
                    assigned_shifts_i += 1
            WXi.append(assigned_shifts_i)
            # print(f"[DEBUG] Staff {i}: Weekend assigned shifts = {assigned_shifts_i}")

        total_weekend_shifts = sum(WXi)
        avgWX = total_weekend_shifts / self.total_staff
        # print(f"[DEBUG] Total weekend shifts: {total_weekend_shifts}, Average weekend shifts per staff: {avgWX}")

        weekend_balance_penalty = 0
        for i in range(self.total_staff):
            diff_WXi_avgWX = WXi[i] - avgWX
            weekend_balance_penalty += diff_WXi_avgWX * diff_WXi_avgWX
            # print(f"[DEBUG] Staff {i}: Weekend diff = {diff_WXi_avgWX}, Running weekend balance penalty = {weekend_balance_penalty}")
        
        return weekend_balance_penalty

    def consecutive_workday(self, schedule):
        print("[DEBUG] Evaluating consecutive workday penalty...")
        consecutive_workday_penalty = 0
        for i in range(self.total_staff):
            Cit = 0
            for t in self.arry_days:
                if schedule[i][t] is not None:
                    Cit += 1
                else:
                    Cit = 0
                # Clamp Cit to the highest valid index of arr_B
                idx = min(Cit, len(self.arr_B) - 1)
                consecutive_workday_penalty += self.arr_B[idx]
                # print(f"[DEBUG] Staff {i}, Day {t}: Cit = {Cit}, arr_B[{idx}] = {self.arr_B[idx]}, Running consecutive penalty = {consecutive_workday_penalty}")
        return consecutive_workday_penalty

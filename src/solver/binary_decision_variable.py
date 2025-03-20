# Create x i,s,t which is a boolean decision variable that is 1 if staff i is working shift s on day t 
def binary_decision_variable_x(model, total_staff, shift_types, arr_days):
    xist = {}
    for i in range(total_staff):
        for s_idx in range(len(shift_types)): # Converting shift types from string to integer
            for t in arr_days:
                # Create a binary variable (1 if working, 0 if not)
                xist[(i, s_idx, t)] = model.NewBoolVar(f'x{i}{s_idx}{t}')
    return xist





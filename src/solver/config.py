###############
# GLOBAL DEFAULTS (These values will be overridden by the JSON configuration)
###############

# Number of employees available for scheduling.
num_employees = 5

# Number of days to cover in the schedule.
num_days = 7

# Number of shifts per day.
num_shifts = 4

# Dictionary mapping each shift index to its name.
shift_names = {0: "morning", 1: "afternoon", 2: "night", 3: "on_call"}

# List of employees designated as seniors.
seniors = [0, 1]

# List of employees designated as juniors (derived as those not in seniors).
juniors = []
for e in range(num_employees):
    if e not in seniors:
        juniors.append(e)

# Maximum number of shifts each employee can work (as a dictionary keyed by employee).
max_shifts = {}
for e in range(num_employees):
    max_shifts[e] = 5

# Dictionary to store required staff per shift per day (populated from the configuration).
required_staff = {}

# Preferences dictionary where keys are (employee, shift, day) and values are penalty weights
preferences = {}

# Weights for different soft constraints in the penalty function.
alpha_fairness = 1.0
alpha_preference = 1.0
alpha_transition = 1.0
alpha_weekend = 1.0
alpha_overtime = 1.0

# Large constant penalty used for hard constraint violations.
HARD_VIOLATION_PENALTY = 10000

# List of days (indices) considered as weekend days.
weekend_days = [5, 6]
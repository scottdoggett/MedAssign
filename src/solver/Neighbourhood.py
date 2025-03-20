import copy
import random

# def create_Neighbourhood(curr_schedule, shift_types, num_neighbour_schedule):
#     neighbours = []

#     for _ in range(num_neighbour_schedule):
#         neighbour_schedule = copy.deepcopy(curr_schedule)

#         # Choose a random staff member and day from the current schedules neighbours
#         staff_member = random.choice(list(neighbour_schedule.keys()))
#         day = random.choice(list(neighbour_schedule[staff_member].keys()))

#         # Get the current assignment of that random staff member on the random day
#         old_assignment = neighbour_schedule[staff_member].get(day, None)

#         # Get a random shift M A N in shift type
#         new_shift = random.choice(shift_types)

#         if old_assignment is not None and new_shift in old_assignment:
#             # If this shift is assigned skip it
#             continue

#         # update the neighbours schedule by assigning this new shift
#         neighbour_schedule[staff_member][day] = [new_shift]

#         # Create a new move for this
#         move = (staff_member, day, old_assignment, new_shift)
#         neighbours.append((neighbour_schedule, move))
    
#     return neighbours



def create_Neighbourhood(curr_schedule, shift_types, num_neighbour_schedule):
    neighbours = []

    for _ in range(num_neighbour_schedule):
        neighbour_schedule = copy.deepcopy(curr_schedule)

        # Randomly pick to do a simple shift change or a swap
        if random.random() < 0.5:
            # Single staff member shift change (your current logic)
            staff_member = random.choice(list(neighbour_schedule.keys()))
            day = random.choice(list(neighbour_schedule[staff_member].keys()))
            new_shift = random.choice(shift_types)

            old_assignment = neighbour_schedule[staff_member].get(day, None)
            if old_assignment is not None and new_shift in old_assignment:
                continue

            neighbour_schedule[staff_member][day] = [new_shift]
            move = ("assign", staff_member, day, old_assignment, new_shift)

        else:
            # Swap between two staff members on the same day
            staff_a, staff_b = random.sample(list(neighbour_schedule.keys()), 2)
            day = random.choice(list(neighbour_schedule[staff_a].keys()))

            temp = neighbour_schedule[staff_a][day]
            neighbour_schedule[staff_a][day] = neighbour_schedule[staff_b][day]
            neighbour_schedule[staff_b][day] = temp

            move = ("swap", staff_a, staff_b, day)

        neighbours.append((neighbour_schedule, move))

    return neighbours



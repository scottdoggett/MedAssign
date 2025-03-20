import json

class StaffMember:
    def __init__(self, ID, Name, Seniority, Preferences):
        self.ID = ID
        self.Name = Name
        self.Seniority = Seniority
        self.Preferences = Preferences
    
    def __repr__(self):
        return f"StaffMember(ID={self.ID}, Name={self.Name}, Seniority{self.Seniority}, Preferences{self.Preferences})"

class ScheduleData:
    def __init__(self, input_json):
        self.parameters = input_json.get("parameters", {})
        self.objective_weights = input_json.get("objective weights", {})
        self.staff = [StaffMember(staff["ID"], staff["Name"], staff["Seniority"], staff["Preferences"]) 
                      for staff in input_json.get("staff", [])]
        self.Rst =  input_json.get("Rst")
        self.Mi = input_json.get("Mi")
        self.Li = input_json.get("Li")
        self.B = input_json.get("B", [])
        self.lambda1 = input_json.get("lambda")

    def getStaffID(self, staff_id):
        return next((staff for staff in self.staff if staff.ID == staff_id), None)
    
    def display(self):
        print(f"Total Staff: ", self.parameters.get("Total Staff"))
        print(f"Shifts: {', '.join(self.parameters.get('shifts', []))}")
        print(f"Days: [{', '.join(map(str, self.parameters.get('days', [])))}]")
        print("\nStaff:")
        for staff in self.staff:
            print(staff)
        print(f"\nObjective Weights:")
        for soft, weight in self.objective_weights.items():
            print(f"    {soft}: {weight}")
        print(f"\nRst: ", self.Rst)
        print(f"Mi: ", self.Mi)
        print(f"Li: ", self.Li)
        print(f"B Values: [{', '.join(map(str, self.B))}]")
        # for i in range(0, len(self.B)):
        #     print(self.B[i])
        print(f"lambda: ", self.lambda1)

def load_schedule(file):
    with open(file) as f:
        input_json = json.load(f)
    return ScheduleData(input_json)

if __name__ == "__main__":
    # Loading schedule data
    schedule = load_schedule("NewAttempt/input.json")
    schedule.display()
import json
import random
from datetime import datetime, timedelta

# Sample locations in Kerala (can be expanded for more realism)
locations = [
    "Thiruvananthapuram", "Kazhakoottam", "Attingal", "Varkala", "Kollam", "Karunagappally",
    "Kayamkulam", "Haripad", "Alappuzha", "Cherthala", "Ernakulam", "Angamaly", "Thrissur",
    "Palakkad", "Malappuram", "Kozhikode", "Vadakara", "Kannur", "Payyanur", "Kasaragod"
]

def generate_vehicle_number():
    return f"KL {random.randint(1, 15):02d} {chr(random.randint(65, 90))}{chr(random.randint(65, 90))} {random.randint(1000, 9999)}"

def generate_route():
    route_length = random.randint(3, 8)  # Random number of stops per route
    start_index = random.randint(0, len(locations) - route_length)
    return locations[start_index:start_index + route_length]

def generate_schedule(route):
    start_time = datetime.strptime("05:00 AM", "%I:%M %p") + timedelta(minutes=random.randint(0, 180))
    schedule = []
    trip_duration = 0
    
    for i, station in enumerate(route):
        arrival_time = start_time + timedelta(minutes=trip_duration)
        departure_time = arrival_time + timedelta(minutes=random.randint(1, 5))  # Short stop duration
        schedule.append({
            "station": station,
            "arrivalTime": arrival_time.strftime("%I:%M %p"),
            "departureTime": departure_time.strftime("%I:%M %p")
        })
        trip_duration += random.randint(15, 45)  # Random travel time between stops
    
    return [{"trip": 1, "stations": schedule}]

bus_schedules = []

for _ in range(1000):
    route = generate_route()
    bus_schedules.append({
        "Vehicle Number": generate_vehicle_number(),
        "route": route,
        "schedule": generate_schedule(route)
    })

with open("kerala_bus_schedules.json", "w", encoding="utf-8") as f:
    json.dump({"busSchedules": bus_schedules}, f, indent=4)

print("Bus schedules generated successfully!")
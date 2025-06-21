import asyncio
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from bson.objectid import ObjectId
import random

# Load environment variables
load_dotenv()

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGODB_URI)
db = client.fixnow_db

# Sample data
service_categories = [
    "plumbing", "electrical", "appliance_repair", "hvac", "carpentry", 
    "painting", "roofing", "flooring", "general_handyman", "mobile_repair"
]

specific_services = {
    "plumbing": ["leaky_pipe", "clogged_drain", "water_heater", "faucet_replacement", "toilet_repair"],
    "electrical": ["outlet_repair", "lighting_fixture", "circuit_breaker", "wiring", "electrical_panel"],
    "appliance_repair": ["refrigerator", "washing_machine", "dryer", "dishwasher", "oven"],
    "hvac": ["air_conditioning", "heating", "ventilation", "thermostat", "duct_work"],
    "carpentry": ["cabinet_installation", "door_repair", "window_repair", "trim_work", "shelving"],
    "painting": ["interior_painting", "exterior_painting", "wallpaper", "texture_work", "staining"],
    "roofing": ["leak_repair", "shingle_replacement", "flashing_repair", "gutter_cleaning", "roof_inspection"],
    "flooring": ["tile_installation", "hardwood_repair", "laminate_installation", "carpet_installation", "vinyl_flooring"],
    "general_handyman": ["furniture_assembly", "mounting_tv", "fence_repair", "deck_repair", "minor_repairs"],
    "mobile_repair": ["screen_replacement", "battery_replacement", "charging_port", "software_issues", "water_damage"]
}

san_francisco_locations = [
    {"lat": 37.7749, "lng": -122.4194},  # Downtown
    {"lat": 37.8025, "lng": -122.4058},  # North Beach
    {"lat": 37.7598, "lng": -122.4127},  # Mission
    {"lat": 37.7785, "lng": -122.3892},  # SOMA
    {"lat": 37.7699, "lng": -122.4330},  # Castro
    {"lat": 37.7835, "lng": -122.4467},  # Pacific Heights
    {"lat": 37.7619, "lng": -122.4347},  # Noe Valley
    {"lat": 37.7697, "lng": -122.4683},  # Sunset
    {"lat": 37.7811, "lng": -122.4161}   # Tenderloin
]

# Sample technicians
async def seed_technicians():
    # Clear existing technicians
    await db.technicians.delete_many({})
    
    # Generate 20 technicians
    for i in range(20):
        # Create a user first
        user_id = ObjectId()
        user_name = f"Technician {i+1}"
        service_category = random.choice(service_categories)
        
        # Select 2-4 services from the category
        num_services = random.randint(2, 4)
        services = random.sample(specific_services[service_category], num_services)
        
        # Add the general category as a service
        services.append(service_category)
        
        # Create technician
        technician = {
            "_id": ObjectId(),
            "user_id": str(user_id),
            "services": services,
            "description": f"Professional {service_category.replace('_', ' ')} specialist with over {random.randint(1, 15)} years of experience.",
            "hourly_rate": round(random.uniform(50, 150), 2),
            "location": random.choice(san_francisco_locations),
            "service_area_radius_km": random.randint(10, 50),
            "ratings": round(random.uniform(3.5, 5), 1),
            "review_count": random.randint(0, 100),
            "created_at": datetime.now()
        }
        
        await db.technicians.insert_one(technician)
        
        # Create corresponding user
        user = {
            "_id": user_id,
            "email": f"tech{i+1}@example.com",
            "name": user_name,
            "phone": f"555-{random.randint(100, 999)}-{random.randint(1000, 9999)}",
            "user_type": "technician",
            "created_at": datetime.now()
        }
        
        await db.users.insert_one(user)
        
    print(f"Created {await db.technicians.count_documents({})} sample technicians")

# Run the seed function
async def main():
    print("Seeding database with sample data...")
    await seed_technicians()
    print("Database seeded successfully!")
    
if __name__ == "__main__":
    asyncio.run(main())

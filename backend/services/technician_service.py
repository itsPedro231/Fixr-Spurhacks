from typing import Dict, List, Optional
from database.mongodb import get_database
import math

# Simple function to calculate distance between two points using Haversine formula
def calculate_distance(loc1: Dict[str, float], loc2: Dict[str, float]) -> float:
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    """
    # Convert decimal degrees to radians
    lat1 = math.radians(loc1["lat"])
    lon1 = math.radians(loc1["lng"])
    lat2 = math.radians(loc2["lat"])
    lon2 = math.radians(loc2["lng"])
    
    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    r = 6371  # Radius of earth in kilometers
    return c * r

async def find_nearby_technicians(
    location: Dict[str, float], 
    problem_tags: Optional[List[str]] = None, 
    radius_km: float = 10.0
) -> List[Dict]:
    """
    Find technicians near a given location that offer services matching the problem tags
    Returns a list of technicians with distance information
    """
    db = get_database()
    
    # Get all technicians that offer the required services
    query = {}
    if problem_tags and len(problem_tags) > 0:
        query["services"] = {"$in": problem_tags}
    
    # In a real application, you'd use MongoDB's geospatial queries
    # For hackathon purposes, we'll get all technicians and filter them here
    technicians = await db.get_all_technicians()
    
    # Filter technicians by distance and add distance information
    nearby_techs = []
    for tech in technicians:
        tech_dict = tech.dict()
        distance = calculate_distance(location, tech.location)
        
        if distance <= tech.service_area_radius_km:
            tech_dict["distance_km"] = round(distance, 1)
            nearby_techs.append(tech_dict)
    
    # Sort by distance
    nearby_techs.sort(key=lambda x: x["distance_km"])
    
    return nearby_techs

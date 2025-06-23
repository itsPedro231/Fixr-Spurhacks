import os
from dotenv import load_dotenv
from typing import Dict, Any
import google.generativeai as genai
import json

# Load environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

async def processImage(image_b64: str) -> Dict[str, Any]:
    """
    Analyze an image using Google's Gemini Pro Vision API
    Returns a dictionary with analysis results
    """
    try:
        # Set up Gemini model
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = """
        You're a professional home repair expert. Analyze this image of a problem and:
        1. Identify what's broken or malfunctioning
        2. List 3-5 specific issues that could be causing the problem
        3. Categorize the problem (plumbing, electrical, appliance, etc.)
        4. Rate how urgent this issue is (1-5, where 5 is most urgent)
        
        Format your response as JSON with the following structure:
        {
          "identified_object": "brief description of what is shown",
          "issues": ["issue 1", "issue 2", "issue 3"],
          "category": "primary category",
          "subcategory": "specific subcategory",
          "urgency": integer from 1-5,
          "tags": ["tag1", "tag2", "tag3"]
        }
        """
        
        # Call Gemini API
        response = model.generate_content(
            [prompt, {"mime_type": "image/jpeg", "data": image_b64}],
            generation_config={"response_mime_type": "application/json"}
        )
        
        # Parse response
        result = json.loads(response.text)
        
        # For a hackathon, we could do further post-processing here
        # In production, we'd do proper JSON validation and error handling
        
        return result
        
    except Exception as e:
        print(f"Error in Gemini analysis: {str(e)}")
        # Fallback result for hackathon purposes
        return {
            "identified_object": "Unable to analyze image",
            "issues": ["Unknown issue"],
            "category": "general",
            "subcategory": "unknown",
            "urgency": 1,
            "tags": ["unidentified_problem"]
        }
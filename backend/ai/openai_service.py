import os
from dotenv import load_dotenv
import openai
from typing import Dict, Any, Optional, List

# Load environment variables
load_dotenv()

# Configure OpenAI API
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai.api_key = OPENAI_API_KEY

async def diagnose_with_gpt(
    description: str, 
    image_analysis: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Diagnose a problem using OpenAI's GPT model
    Returns a dictionary with diagnosis, DIY steps, and recommended specialist type
    """
    try:
        # Create system prompt based on image analysis if available
        system_prompt = """
        You are an expert home repair assistant that diagnoses problems and suggests solutions.
        First identify the problem, then provide DIY steps if applicable, and finally suggest what 
        type of specialist would be needed if professional help is required.
        """
        
        messages = [{"role": "system", "content": system_prompt}]
        
        # Include image analysis if available
        if image_analysis:
            image_prompt = f"""
            A visual analysis of the problem has identified:
            - Object: {image_analysis.get('identified_object', 'Unknown')}
            - Issues: {', '.join(image_analysis.get('issues', ['Unknown']))}
            - Category: {image_analysis.get('category', 'Unknown')}
            - Tags: {', '.join(image_analysis.get('tags', ['Unknown']))}
            - Urgency: {image_analysis.get('urgency', 1)}/5
            
            Based on this analysis and the user's description, diagnose the problem.
            """
            messages.append({"role": "system", "content": image_prompt})
        
        # Add user's description
        messages.append({"role": "user", "content": description})
        
        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-4-turbo",
            messages=messages,
            response_format={"type": "json_object"}
        )
        
        # Extract and parse the response
        result = response.choices[0].message.content
        
        # For a hackathon, we could do further post-processing here
        # In production, you'd do proper JSON validation and error handling
        
        return result
        
    except Exception as e:
        print(f"Error in GPT diagnosis: {str(e)}")
        # Fallback result for hackathon purposes
        return {
            "diagnosis": "Unable to diagnose the problem at this time.",
            "diy_steps": ["Please try again or consult a professional directly."],
            "specialist_type": ["general_handyman"],
            "estimated_difficulty": "unknown",
            "estimated_cost": "unknown"
        }

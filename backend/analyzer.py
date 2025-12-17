import os
import json
import re
from dotenv import load_dotenv
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

model = genai.GenerativeModel(
    "gemini-2.5-flash",
    generation_config={
        "temperature": 0.3,
        "max_output_tokens": 2048
    }
)

def extract_json(text: str):
    """
    Extract valid JSON object from LLM output safely
    """
    # Case 1: clean JSON
    try:
        return json.loads(text)
    except:
        pass

    # Case 2: JSON inside text / markdown
    match = re.search(r"\{[\s\S]*\}", text)
    if match:
        try:
            return json.loads(match.group())
        except:
            pass

    return None


def analyze_resume_with_jd(resume_text: str, jd_text: str):
    prompt = f"""
You are an ATS & recruitment engine.

STRICT RULES:
- Return ONLY valid JSON
- No explanation
- No markdown
- No extra text

JSON FORMAT:
{{
  "overallMatch": number,
  "sections": {{
    "skills": {{ "score": number }},
    "experience": {{ "score": number }},
    "education": {{ "score": number }}
  }},
  "matchedSkills": [string],
  "missingSkills": [string],
  "recommendations": [string]
}}

Resume:
{resume_text}

Job Description:
{jd_text}
"""

    try:
        response = model.generate_content(prompt)
        parsed = extract_json(response.text)

        if not parsed:
            return {"error": "Invalid AI JSON output"}

        return parsed

    except ResourceExhausted:
        return {"error": "Gemini quota exceeded. Try again later."}

    except Exception as e:
        return {"error": str(e)}

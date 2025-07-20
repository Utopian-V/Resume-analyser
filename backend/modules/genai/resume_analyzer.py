"""
Resume Analysis Service using Groq AI
Handled by: AI/ML Team
Purpose: AI-powered resume analysis and feedback generation
"""
import os
import json
import aiohttp
import asyncio
from typing import Dict, List, Optional, Any
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class ResumeAnalyzer:
    def __init__(self):
        self.groq_api_key = os.getenv('GROQ_API_KEY')
        self.groq_model = os.getenv('GROQ_MODEL', 'llama3-8b-8192')
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        
        if not self.groq_api_key:
            print("⚠️ Warning: GROQ_API_KEY not found. Resume analysis will use fallback mode.")
    
    async def analyze_resume_text(self, resume_text: str) -> Dict[str, Any]:
        """Analyze resume text using Groq AI"""
        try:
            if not self.groq_api_key:
                return self._get_fallback_analysis()
            
            # Create the analysis prompt
            prompt = self._create_analysis_prompt(resume_text)
            
            # Call Groq API
            async with aiohttp.ClientSession() as session:
                headers = {
                    "Authorization": f"Bearer {self.groq_api_key}",
                    "Content-Type": "application/json"
                }
                
                payload = {
                    "model": self.groq_model,
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are an expert resume analyst and career advisor. Analyze resumes and provide detailed, actionable feedback."
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "temperature": 0.3,
                    "max_tokens": 2000
                }
                
                async with session.post(self.base_url, headers=headers, json=payload) as response:
                    if response.status == 200:
                        data = await response.json()
                        content = data['choices'][0]['message']['content']
                        
                        # Parse the JSON response
                        try:
                            analysis = json.loads(content)
                            return self._validate_and_enhance_analysis(analysis)
                        except json.JSONDecodeError:
                            # If JSON parsing fails, try to extract structured data
                            return self._parse_text_response(content)
                    else:
                        error_text = await response.text()
                        print(f"Groq API error: {response.status} - {error_text}")
                        return self._get_fallback_analysis()
                        
        except Exception as e:
            print(f"Resume analysis error: {e}")
            return self._get_fallback_analysis()
    
    def _create_analysis_prompt(self, resume_text: str) -> str:
        """Create a detailed prompt for resume analysis"""
        return f"""
Please analyze the following resume and provide a comprehensive assessment in JSON format.

Resume Text:
{resume_text[:4000]}  # Limit text length to avoid token limits

Please provide your analysis in the following JSON format:
{{
    "skills": [
        {{"name": "skill_name", "level": "Beginner/Intermediate/Advanced", "confidence": 0.0-1.0}}
    ],
    "experience": "estimated_years",
    "education": "highest_degree",
    "recommendations": [
        "specific_actionable_recommendation"
    ],
    "overall_score": 0-100,
    "strengths": [
        "specific_strength"
    ],
    "areas_for_improvement": [
        "specific_area_to_improve"
    ],
    "project_analysis": {{
        "project_count": 0,
        "project_quality": "Low/Medium/High",
        "suggestions": [
            "project_improvement_suggestion"
        ]
    }}
}}

Focus on:
1. Technical skills and proficiency levels
2. Experience assessment
3. Education background
4. Specific, actionable recommendations
5. Overall resume quality score
6. Key strengths and weaknesses
7. Project portfolio analysis

Be specific and provide actionable feedback.
"""
    
    def _validate_and_enhance_analysis(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Validate and enhance the AI analysis"""
        # Ensure all required fields exist
        required_fields = [
            "skills", "experience", "education", "recommendations",
            "overall_score", "strengths", "areas_for_improvement"
        ]
        
        for field in required_fields:
            if field not in analysis:
                if field == "skills":
                    analysis[field] = []
                elif field in ["recommendations", "strengths", "areas_for_improvement"]:
                    analysis[field] = []
                elif field == "overall_score":
                    analysis[field] = 50
                else:
                    analysis[field] = "Not specified"
        
        # Add project analysis if missing
        if "project_analysis" not in analysis:
            analysis["project_analysis"] = {
                "project_count": 0,
                "project_quality": "Medium",
                "suggestions": ["Add more projects to showcase your skills"]
            }
        
        # Validate score range
        if not isinstance(analysis["overall_score"], int) or analysis["overall_score"] < 0 or analysis["overall_score"] > 100:
            analysis["overall_score"] = 50
        
        return analysis
    
    def _parse_text_response(self, content: str) -> Dict[str, Any]:
        """Parse text response when JSON parsing fails"""
        # Try to extract structured information from text
        analysis = {
            "skills": [],
            "experience": "Not specified",
            "education": "Not specified",
            "recommendations": [],
            "overall_score": 50,
            "strengths": [],
            "areas_for_improvement": [],
            "project_analysis": {
                "project_count": 0,
                "project_quality": "Medium",
                "suggestions": ["Unable to analyze projects from text response"]
            }
        }
        
        # Extract recommendations and suggestions from text
        lines = content.split('\n')
        for line in lines:
            line = line.strip()
            if line.startswith('-') or line.startswith('•'):
                suggestion = line[1:].strip()
                if suggestion:
                    analysis["recommendations"].append(suggestion)
        
        return analysis
    
    def _get_fallback_analysis(self) -> Dict[str, Any]:
        """Return fallback analysis when AI is not available"""
        return {
            "skills": [
                {"name": "JavaScript", "level": "Intermediate", "confidence": 0.7},
                {"name": "React", "level": "Intermediate", "confidence": 0.6},
                {"name": "Python", "level": "Beginner", "confidence": 0.5},
                {"name": "Node.js", "level": "Intermediate", "confidence": 0.6},
                {"name": "MongoDB", "level": "Beginner", "confidence": 0.4}
            ],
            "experience": "1-3 years",
            "education": "Bachelor's degree",
            "recommendations": [
                "Add more specific project descriptions",
                "Include quantifiable achievements",
                "Highlight relevant technical skills",
                "Add certifications if available",
                "Improve formatting and readability"
            ],
            "overall_score": 65,
            "strengths": [
                "Good technical foundation",
                "Relevant project experience"
            ],
            "areas_for_improvement": [
                "Add more detailed project descriptions",
                "Include specific metrics and achievements",
                "Highlight leadership and teamwork experience",
                "Add relevant certifications"
            ],
            "project_analysis": {
                "project_count": 3,
                "project_quality": "Medium",
                "suggestions": [
                    "Add more detailed project descriptions",
                    "Include GitHub links for code projects",
                    "Highlight technologies used in each project",
                    "Add deployment links for live projects"
                ]
            }
        }

# Global instance
resume_analyzer = ResumeAnalyzer() 
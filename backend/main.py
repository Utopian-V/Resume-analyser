import os
import pdfplumber
import requests
import json
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer
from dotenv import load_dotenv
from typing import List, Dict, Optional
from pydantic import BaseModel
import uuid
from datetime import datetime

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama3-8b-8192")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# In-memory storage (replace with database in production)
users_db = {}
user_sessions = {}
job_listings = []
dsa_questions = []
user_progress = {}
aptitude_tests = []

# Pydantic models
class User(BaseModel):
    email: str
    name: str
    skills: List[str] = []
    target_roles: List[str] = []

class JobListing(BaseModel):
    id: str
    title: str
    company: str
    location: str
    description: str
    requirements: List[str]
    salary_range: str
    application_deadline: str
    posted_date: str

class DSAQuestion(BaseModel):
    id: str
    title: str
    difficulty: str
    category: str
    description: str
    leetcode_url: str
    tags: List[str]

class UserProgress(BaseModel):
    user_id: str
    completed_questions: List[str] = []
    applied_jobs: List[str] = []
    resume_score: Optional[int] = None
    last_analysis_date: Optional[str] = None

class InterviewMessage(BaseModel):
    user_id: str
    role: str
    message: str
    conversation_id: Optional[str] = None

# Aptitude Test Models
class AptitudeOption(BaseModel):
    id: str
    text: str
    is_correct: bool

class AptitudeQuestion(BaseModel):
    id: str
    question_text: str
    category: str
    difficulty: str
    time_limit: int
    points: int
    options: List[AptitudeOption]
    explanation: Optional[str]

class AptitudeTest(BaseModel):
    id: str
    title: str
    duration: int
    total_questions: int
    passing_score: int
    instructions: List[str]
    questions: List[AptitudeQuestion]

# Sample data initialization
def initialize_sample_data():
    global job_listings, dsa_questions
    
    # Sample job listings
    job_listings = [
        {
            "id": "job1",
            "title": "Software Engineer",
            "company": "Tech Corp",
            "location": "San Francisco, CA",
            "description": "Full-stack development role",
            "requirements": ["Python", "React", "AWS", "DSA"],
            "salary_range": "$120k - $150k",
            "application_deadline": "2024-02-15",
            "posted_date": "2024-01-15"
        },
        {
            "id": "job2", 
            "title": "Frontend Developer",
            "company": "Startup Inc",
            "location": "Remote",
            "description": "React/TypeScript focused role",
            "requirements": ["React", "TypeScript", "CSS", "DSA"],
            "salary_range": "$90k - $120k",
            "application_deadline": "2024-02-20",
            "posted_date": "2024-01-20"
        }
    ]
    
    # Sample DSA questions
    dsa_questions = [
        {
            "id": "dsa1",
            "title": "Two Sum",
            "difficulty": "Easy",
            "category": "Arrays",
            "description": "Find two numbers that add up to target",
            "leetcode_url": "https://leetcode.com/problems/two-sum/",
            "tags": ["Array", "Hash Table"]
        },
        {
            "id": "dsa2",
            "title": "Valid Parentheses",
            "difficulty": "Easy", 
            "category": "Stack",
            "description": "Check if parentheses are valid",
            "leetcode_url": "https://leetcode.com/problems/valid-parentheses/",
            "tags": ["Stack", "String"]
        },
        {
            "id": "dsa3",
            "title": "Merge Two Sorted Lists",
            "difficulty": "Easy",
            "category": "Linked List",
            "description": "Merge two sorted linked lists",
            "leetcode_url": "https://leetcode.com/problems/merge-two-sorted-lists/",
            "tags": ["Linked List", "Recursion"]
        }
    ]

initialize_sample_data()

# Authentication helper
def get_current_user(token: str = Depends(security)):
    if token.credentials not in user_sessions:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user_sessions[token.credentials]

def extract_text_from_pdf(file_path):
    try:
        with pdfplumber.open(file_path) as pdf:
            text = "\n".join(page.extract_text() or "" for page in pdf.pages)
        return text
    except Exception as e:
        raise RuntimeError(f"PDF extraction failed: {str(e)}")

def build_enhanced_prompt(resume_text):
    return (
        "You are a professional resume reviewer and career advisor. Analyze the following resume text and provide comprehensive feedback in the following JSON format ONLY:\n"
        "{\n"
        "  \"score\": <number>,\n"
        "  \"ats_compliance\": {\n"
        "    \"score\": <number>,\n"
        "    \"issues\": [<string>],\n"
        "    \"passed_checks\": [<string>],\n"
        "    \"failed_checks\": [<string>]\n"
        "  },\n"
        "  \"improvements\": [\n"
        "    {\n"
        "      \"suggestion\": <string>,\n"
        "      \"reason\": <string>,\n"
        "      \"highlight_text\": <string>\n"
        "    }\n"
        "  ],\n"
        "  \"skill_match\": {\n"
        "    \"matched_skills\": [<string>],\n"
        "    \"missing_skills\": [<string>]\n"
        "  },\n"
        "  \"targeted_roles\": [<string>],\n"
        "  \"red_flags\": [<string>],\n"
        "  \"comments\": <string>,\n"
        "  \"project_analysis\": [\n"
        "    {\n"
        "      \"project_name\": <string>,\n"
        "      \"description\": <string>,\n"
        "      \"strengths\": [<string>],\n"
        "      \"improvements\": [<string>],\n"
        "      \"impact_score\": <number>,\n"
        "      \"suggestions\": [<string>]\n"
        "    }\n"
        "  ],\n"
        "  \"dsa_recommendations\": {\n"
        "    \"priority_topics\": [<string>],\n"
        "    \"difficulty_level\": <string>,\n"
        "    \"estimated_prep_time\": <string>\n"
        "  },\n"
        "  \"career_path\": {\n"
        "    \"short_term_goals\": [<string>],\n"
        "    \"long_term_goals\": [<string>],\n"
        "    \"recommended_certifications\": [<string>]\n"
        "  }\n"
        "}\n"
        "Resume:\n"
        "'''\n"
        f"{resume_text}\n"
        "'''\n"
        "Return ONLY valid JSON, no explanation, no markdown, no extra text."
    )

def build_interview_prompt(role, user_message, conversation_history=""):
    return (
        f"You are an AI interviewer for a {role} position. You should ask relevant technical and behavioral questions based on the candidate's responses. "
        f"Keep your responses professional, encouraging, and focused on assessing the candidate's skills and experience for the {role} role. "
        f"Ask follow-up questions to dig deeper into their responses. "
        f"Conversation history: {conversation_history}\n"
        f"Candidate's latest response: {user_message}\n"
        f"Provide your next question or response as an interviewer for the {role} position. "
        f"Keep it conversational and professional. Don't include any JSON formatting or special instructions."
    )

def call_groq(prompt, model=GROQ_MODEL):
    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": model,
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 2000,
                "temperature": 0.4,
            },
            timeout=60
        )
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]
    except Exception as e:
        raise RuntimeError(f"Groq API error: {str(e)}")

@app.post("/analyze-resume/")
async def analyze_resume(file: UploadFile = File(...)):
    file_location = f"temp_{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())
    try:
        resume_text = extract_text_from_pdf(file_location)
        if not resume_text.strip():
            return JSONResponse(content={"error": "No extractable text found in PDF. Please upload a text-based resume PDF."}, status_code=400)
        prompt = build_enhanced_prompt(resume_text)
        try:
            content = call_groq(prompt)
        except Exception as oe:
            return JSONResponse(content={"error": f"Groq API error: {str(oe)}"}, status_code=500)
        import re
        match = re.search(r"\{.*\}", content, re.DOTALL)
        if match:
            try:
                feedback = json.loads(match.group())
            except Exception as je:
                feedback = {"error": f"LLM response JSON parse error: {str(je)}", "llm_response": content}
        else:
            feedback = {"error": "Could not parse LLM response.", "llm_response": content}
        if os.getenv("DEBUG_FEEDBACK") == "1":
            feedback["_debug"] = {"extracted_text": resume_text, "llm_response": content}
        return JSONResponse(content=feedback)
    except Exception as e:
        import traceback
        print("Exception in /analyze-resume/:", e)
        traceback.print_exc()
        return JSONResponse(content={"error": f"Server error: {str(e)}"}, status_code=500)
    finally:
        os.remove(file_location)

# Firebase user management (simplified)
@app.post("/user/register/")
async def register_firebase_user(user_id: str, email: str, name: str):
    users_db[user_id] = {
        "email": email,
        "name": name,
        "skills": [],
        "target_roles": []
    }
    user_progress[user_id] = UserProgress(user_id=user_id).dict()
    return {"user_id": user_id, "message": "User registered successfully"}

@app.get("/user/{user_id}/profile/")
async def get_user_profile(user_id: str):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    return users_db[user_id]

# Job listings endpoints
@app.get("/jobs/")
async def get_jobs(user_id: str = None):
    if user_id and user_id in user_progress:
        # Filter jobs based on user's skills and target roles
        user_data = user_progress[user_id]
        return {"jobs": job_listings, "recommended": job_listings[:3]}
    return {"jobs": job_listings, "recommended": []}

@app.post("/jobs/{job_id}/apply/")
async def apply_for_job(job_id: str, user_id: str):
    if user_id not in user_progress:
        raise HTTPException(status_code=404, detail="User not found")
    
    if job_id not in [job["id"] for job in job_listings]:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job_id not in user_progress[user_id]["applied_jobs"]:
        user_progress[user_id]["applied_jobs"].append(job_id)
    
    return {"message": "Application submitted successfully", "job_id": job_id}

# DSA questions endpoints
@app.get("/dsa/questions/")
async def get_dsa_questions(user_id: str = None, difficulty: str = None, category: str = None):
    filtered_questions = dsa_questions
    
    if difficulty:
        filtered_questions = [q for q in filtered_questions if q["difficulty"].lower() == difficulty.lower()]
    
    if category:
        filtered_questions = [q for q in filtered_questions if q["category"].lower() == category.lower()]
    
    if user_id and user_id in user_progress:
        completed = user_progress[user_id].get("completed_questions", [])
        for question in filtered_questions:
            question["completed"] = question["id"] in completed
    
    return {"questions": filtered_questions}

@app.post("/dsa/questions/{question_id}/complete/")
async def complete_question(question_id: str, user_id: str):
    if user_id not in user_progress:
        raise HTTPException(status_code=404, detail="User not found")
    
    if question_id not in [q["id"] for q in dsa_questions]:
        raise HTTPException(status_code=404, detail="Question not found")
    
    if question_id not in user_progress[user_id]["completed_questions"]:
        user_progress[user_id]["completed_questions"].append(question_id)
    
    return {"message": "Question marked as completed", "question_id": question_id}

@app.get("/dsa/recommendations/")
async def get_dsa_recommendations(user_id: str):
    if user_id not in user_progress:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get user's completed questions
    completed = user_progress[user_id].get("completed_questions", [])
    
    # Recommend questions based on completion pattern
    if len(completed) < 3:
        recommended = [q for q in dsa_questions if q["difficulty"] == "Easy" and q["id"] not in completed][:5]
    elif len(completed) < 10:
        recommended = [q for q in dsa_questions if q["difficulty"] == "Medium" and q["id"] not in completed][:5]
    else:
        recommended = [q for q in dsa_questions if q["difficulty"] == "Hard" and q["id"] not in completed][:5]
    
    return {"recommendations": recommended, "progress": len(completed)}

# User progress endpoints
@app.get("/user/progress/")
async def get_user_progress(user_id: str):
    if user_id not in user_progress:
        raise HTTPException(status_code=404, detail="User not found")
    
    progress = user_progress[user_id]
    applied_jobs = [job for job in job_listings if job["id"] in progress.get("applied_jobs", [])]
    completed_questions = [q for q in dsa_questions if q["id"] in progress.get("completed_questions", [])]
    
    return {
        "user_id": user_id,
        "applied_jobs": applied_jobs,
        "completed_questions": completed_questions,
        "resume_score": progress.get("resume_score"),
        "last_analysis_date": progress.get("last_analysis_date")
    }

@app.post("/user/progress/resume-score/")
async def update_resume_score(user_id: str, score: int):
    if user_id not in user_progress:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_progress[user_id]["resume_score"] = score
    user_progress[user_id]["last_analysis_date"] = datetime.now().isoformat()
    
    return {"message": "Resume score updated successfully", "score": score}

# Interview chat endpoint
@app.post("/interview/chat/")
async def interview_chat(message: InterviewMessage):
    try:
        # Build conversation context
        conversation_history = ""  # In production, fetch from database
        
        prompt = build_interview_prompt(message.role, message.message, conversation_history)
        response = call_groq(prompt)
        
        return {
            "response": response,
            "conversation_id": message.conversation_id or str(uuid.uuid4())
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Interview chat error: {str(e)}")

def initialize_aptitude_data():
    global aptitude_tests
    aptitude_tests = [
        {
            "id": "test1",
            "title": "Quantitative Aptitude Assessment",
            "duration": 30,
            "total_questions": 20,
            "passing_score": 60,
            "instructions": [
                "Read each question carefully",
                "Each question has only one correct answer",
                "Time limit is strictly enforced",
                "No negative marking",
                "Calculator usage is not permitted"
            ],
            "questions": [
                {
                    "id": "q1",
                    "question_text": "If a train travels 360 kilometers in 5 hours, what is its speed in kilometers per hour?",
                    "category": "Numerical",
                    "difficulty": "Easy",
                    "time_limit": 90,
                    "points": 5,
                    "options": [
                        {"id": "a", "text": "72", "is_correct": True},
                        {"id": "b", "text": "70", "is_correct": False},
                        {"id": "c", "text": "75", "is_correct": False},
                        {"id": "d", "text": "80", "is_correct": False}
                    ],
                    "explanation": "Speed = Distance/Time = 360/5 = 72 km/hr"
                },
                {
                    "id": "q2",
                    "question_text": "What is 15% of 200?",
                    "category": "Numerical",
                    "difficulty": "Easy",
                    "time_limit": 60,
                    "points": 5,
                    "options": [
                        {"id": "a", "text": "20", "is_correct": False},
                        {"id": "b", "text": "30", "is_correct": True},
                        {"id": "c", "text": "40", "is_correct": False},
                        {"id": "d", "text": "50", "is_correct": False}
                    ],
                    "explanation": "15% of 200 = (15/100) × 200 = 30"
                }
            ]
        }
    ]

@app.on_event("startup")
async def startup_event():
    initialize_sample_data()
    initialize_aptitude_data()

# Aptitude test endpoints
@app.get("/aptitude/tests/")
async def get_aptitude_tests():
    return {"tests": aptitude_tests}

@app.get("/aptitude/test/{test_id}")
async def get_aptitude_test(test_id: str):
    test = next((t for t in aptitude_tests if t["id"] == test_id), None)
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    return test

@app.post("/aptitude/test/{test_id}/submit")
async def submit_aptitude_test(test_id: str, answers: Dict[str, str]):
    test = next((t for t in aptitude_tests if t["id"] == test_id), None)
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    
    score = 0
    total_possible = 0
    results = []
    
    for question in test["questions"]:
        if question["id"] in answers:
            total_possible += question["points"]
            user_answer = answers[question["id"]]
            correct_answer = next(o["id"] for o in question["options"] if o["is_correct"])
            
            if user_answer == correct_answer:
                score += question["points"]
            
            results.append({
                "question_id": question["id"],
                "correct": user_answer == correct_answer,
                "points_earned": question["points"] if user_answer == correct_answer else 0
            })
    
    percentage = (score / total_possible) * 100 if total_possible > 0 else 0
    
    return {
        "score": score,
        "total_possible": total_possible,
        "percentage": percentage,
        "passed": percentage >= test["passing_score"],
        "results": results
    }

@app.post("/aptitude/questions/add")
async def add_aptitude_question(question: AptitudeQuestion):
    if not aptitude_tests:
        raise HTTPException(status_code=400, detail="No test available to add questions to")
    
    try:
        question_dict = question.dict()
        question_dict["id"] = f"q{len(aptitude_tests[0]['questions']) + 1}"
        aptitude_tests[0]["questions"].append(question_dict)
        aptitude_tests[0]["total_questions"] = len(aptitude_tests[0]["questions"])
        return {"message": "Question added successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
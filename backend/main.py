import os
import pdfplumber
import requests
import json
from fastapi.responses import FileResponse
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer
from dotenv import load_dotenv
from typing import List, Dict, Optional
from pydantic import BaseModel
import uuid
from datetime import datetime
import glob
import sqlalchemy
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama3-8b-8192")

POSTGRES_URL = os.getenv("DATABASE_URL")

# SQLAlchemy async engine for PostgreSQL (Supabase)
if POSTGRES_URL:
    engine = create_async_engine(POSTGRES_URL, echo=True, future=True)
    async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
else:
    engine = None
    async_session = None

app = FastAPI()

# CORS middleware configuration
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

# --- Aptitude Test Persistence ---
APTITUDE_TESTS_FILE = "aptitude_tests.json"
aptitude_tests = {}  # {test_id: {...}}
_aptitude_tests_loaded = False  # Cache flag

# NCS Job Models
class NCSJob(BaseModel):
    id: str
    title: str
    company: str
    location: str
    description: str
    requirements: List[str]
    salary_range: str
    application_deadline: str
    posted_date: str
    source: str
    source_url: str
    category: str
    employment_type: str
    experience_level: str
    remote_friendly: bool
    government_job: bool

class BulkJobUpdate(BaseModel):
    jobs: List[NCSJob]
    source: str

# NCS Jobs storage
ncs_jobs = []

def load_ncs_jobs():
    """Load NCS jobs from JSON file"""
    global ncs_jobs
    try:
        ncs_file_path = os.path.join(os.path.dirname(__file__), '../scripts/ncs_scraper/ncs_jobs_full.json')
        ncs_file_path = os.path.abspath(ncs_file_path)
        if os.path.exists(ncs_file_path):
            with open(ncs_file_path, 'r') as f:
                data = json.load(f)
                ncs_jobs = data.get('jobs', [])
                print(f"Loaded {len(ncs_jobs)} NCS jobs from file")
        else:
            print("NCS jobs file not found")
            ncs_jobs = []
    except Exception as e:
        print(f"Error loading NCS jobs: {e}")
        ncs_jobs = []

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
    question_text: str
    category: str
    difficulty: str
    time_limit: int
    points: int
    options: List[AptitudeOption]
    explanation: Optional[str] = None

class TestSubmission(BaseModel):
    answers: Dict[str, str]
    user_id: str

# --- Aptitude Test Persistence Functions ---
def load_aptitude_tests():
    global aptitude_tests, _aptitude_tests_loaded
    if _aptitude_tests_loaded:
        return  # Already loaded, skip file operation
    
    try:
        if os.path.exists(APTITUDE_TESTS_FILE):
            with open(APTITUDE_TESTS_FILE, "r") as f:
                aptitude_tests = json.load(f)
        else:
            # Initialize with a comprehensive test bank
            aptitude_tests["test1"] = create_comprehensive_test()
            save_aptitude_tests()
        _aptitude_tests_loaded = True
    except Exception as e:
        print(f"Error loading aptitude tests: {e}")
        # Fallback to default test
        aptitude_tests["test1"] = create_comprehensive_test()
        _aptitude_tests_loaded = True

def create_comprehensive_test():
    return {
        "id": "test1",
        "title": "Comprehensive Aptitude Assessment",
        "duration": 45,  # 45 minutes for 20 questions
        "total_questions": 20,
        "passing_score": 60,
        "instructions": [
            "Read each question carefully before answering",
            "Each question has only one correct answer",
            "Time limit is strictly enforced",
            "No negative marking",
            "Calculator usage is not permitted",
            "You can navigate between questions using Previous/Next buttons"
        ],
        "questions": [
            # Numerical Questions (8 questions)
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
            },
            {
                "id": "q3",
                "question_text": "A shopkeeper sells an item for $120, making a 20% profit. What was the cost price?",
                "category": "Numerical",
                "difficulty": "Medium",
                "time_limit": 120,
                "points": 10,
                "options": [
                    {"id": "a", "text": "$96", "is_correct": False},
                    {"id": "b", "text": "$100", "is_correct": True},
                    {"id": "c", "text": "$110", "is_correct": False},
                    {"id": "d", "text": "$115", "is_correct": False}
                ],
                "explanation": "If selling price is 120% of cost price, then cost price = 120/1.2 = $100"
            },
            {
                "id": "q4",
                "question_text": "If 3 workers can complete a task in 8 days, how many days will 6 workers take?",
                "category": "Numerical",
                "difficulty": "Medium",
                "time_limit": 120,
                "points": 10,
                "options": [
                    {"id": "a", "text": "4 days", "is_correct": True},
                    {"id": "b", "text": "6 days", "is_correct": False},
                    {"id": "c", "text": "12 days", "is_correct": False},
                    {"id": "d", "text": "16 days", "is_correct": False}
                ],
                "explanation": "More workers = less time. 6 workers = 3 workers × 2, so time = 8/2 = 4 days"
            },
            {
                "id": "q5",
                "question_text": "What is the next number in the sequence: 2, 6, 12, 20, 30, ?",
                "category": "Numerical",
                "difficulty": "Hard",
                "time_limit": 180,
                "points": 15,
                "options": [
                    {"id": "a", "text": "40", "is_correct": False},
                    {"id": "b", "text": "42", "is_correct": True},
                    {"id": "c", "text": "44", "is_correct": False},
                    {"id": "d", "text": "45", "is_correct": False}
                ],
                "explanation": "Difference increases by 2: +4, +6, +8, +10, +12. So 30 + 12 = 42"
            },
            {
                "id": "q6",
                "question_text": "A rectangle has length 12cm and width 8cm. What is its area?",
                "category": "Numerical",
                "difficulty": "Easy",
                "time_limit": 60,
                "points": 5,
                "options": [
                    {"id": "a", "text": "96 cm²", "is_correct": True},
                    {"id": "b", "text": "80 cm²", "is_correct": False},
                    {"id": "c", "text": "100 cm²", "is_correct": False},
                    {"id": "d", "text": "88 cm²", "is_correct": False}
                ],
                "explanation": "Area = length × width = 12 × 8 = 96 cm²"
            },
            {
                "id": "q7",
                "question_text": "If x + y = 10 and x - y = 4, what is the value of x?",
                "category": "Numerical",
                "difficulty": "Medium",
                "time_limit": 120,
                "points": 10,
                "options": [
                    {"id": "a", "text": "6", "is_correct": False},
                    {"id": "b", "text": "7", "is_correct": True},
                    {"id": "c", "text": "8", "is_correct": False},
                    {"id": "d", "text": "9", "is_correct": False}
                ],
                "explanation": "Adding the equations: 2x = 14, so x = 7"
            },
            {
                "id": "q8",
                "question_text": "What is 25% of 80% of 200?",
                "category": "Numerical",
                "difficulty": "Hard",
                "time_limit": 180,
                "points": 15,
                "options": [
                    {"id": "a", "text": "40", "is_correct": True},
                    {"id": "b", "text": "50", "is_correct": False},
                    {"id": "c", "text": "60", "is_correct": False},
                    {"id": "d", "text": "80", "is_correct": False}
                ],
                "explanation": "25% of 80% of 200 = 0.25 × 0.8 × 200 = 0.2 × 200 = 40"
            },
            # Logical Questions (6 questions)
            {
                "id": "q9",
                "question_text": "If all roses are flowers and some flowers are red, which statement is definitely true?",
                "category": "Logical",
                "difficulty": "Medium",
                "time_limit": 120,
                "points": 10,
                "options": [
                    {"id": "a", "text": "All roses are red", "is_correct": False},
                    {"id": "b", "text": "Some roses are red", "is_correct": True},
                    {"id": "c", "text": "All red things are roses", "is_correct": False},
                    {"id": "d", "text": "No roses are red", "is_correct": False}
                ],
                "explanation": "Since all roses are flowers and some flowers are red, some roses must be red"
            },
            {
                "id": "q10",
                "question_text": "Complete the sequence: A, C, F, J, O, ?",
                "category": "Logical",
                "difficulty": "Hard",
                "time_limit": 180,
                "points": 15,
                "options": [
                    {"id": "a", "text": "T", "is_correct": False},
                    {"id": "b", "text": "U", "is_correct": True},
                    {"id": "c", "text": "V", "is_correct": False},
                    {"id": "d", "text": "W", "is_correct": False}
                ],
                "explanation": "The difference increases by 1: +2, +3, +4, +5, +6. So O + 6 = U"
            },
            {
                "id": "q11",
                "question_text": "If today is Monday, what day will it be 100 days from now?",
                "category": "Logical",
                "difficulty": "Medium",
                "time_limit": 120,
                "points": 10,
                "options": [
                    {"id": "a", "text": "Tuesday", "is_correct": False},
                    {"id": "b", "text": "Wednesday", "is_correct": True},
                    {"id": "c", "text": "Thursday", "is_correct": False},
                    {"id": "d", "text": "Friday", "is_correct": False}
                ],
                "explanation": "100 ÷ 7 = 14 weeks + 2 days. So Monday + 2 days = Wednesday"
            },
            {
                "id": "q12",
                "question_text": "Which number comes next: 1, 3, 6, 10, 15, ?",
                "category": "Logical",
                "difficulty": "Easy",
                "time_limit": 90,
                "points": 5,
                "options": [
                    {"id": "a", "text": "20", "is_correct": False},
                    {"id": "b", "text": "21", "is_correct": True},
                    {"id": "c", "text": "22", "is_correct": False},
                    {"id": "d", "text": "25", "is_correct": False}
                ],
                "explanation": "Difference increases by 1: +2, +3, +4, +5, +6. So 15 + 6 = 21"
            },
            {
                "id": "q13",
                "question_text": "If A=1, B=2, C=3, what is the sum of the letters in 'CAT'?",
                "category": "Logical",
                "difficulty": "Easy",
                "time_limit": 60,
                "points": 5,
                "options": [
                    {"id": "a", "text": "6", "is_correct": True},
                    {"id": "b", "text": "7", "is_correct": False},
                    {"id": "c", "text": "8", "is_correct": False},
                    {"id": "d", "text": "9", "is_correct": False}
                ],
                "explanation": "C=3, A=1, T=20. But in this sequence, T=20 is not valid. C=3, A=1, T=2. So 3+1+2=6"
            },
            {
                "id": "q14",
                "question_text": "A clock shows 3:15. What is the angle between the hour and minute hands?",
                "category": "Logical",
                "difficulty": "Hard",
                "time_limit": 180,
                "points": 15,
                "options": [
                    {"id": "a", "text": "7.5°", "is_correct": True},
                    {"id": "b", "text": "15°", "is_correct": False},
                    {"id": "c", "text": "22.5°", "is_correct": False},
                    {"id": "d", "text": "30°", "is_correct": False}
                ],
                "explanation": "Hour hand moves 0.5° per minute. At 3:15, hour hand is at 3×30 + 15×0.5 = 97.5°. Minute hand is at 15×6 = 90°. Difference = 7.5°"
            },
            # Verbal Questions (4 questions)
            {
                "id": "q15",
                "question_text": "Choose the word that best completes the analogy: Book is to Reading as Fork is to:",
                "category": "Verbal",
                "difficulty": "Easy",
                "time_limit": 90,
                "points": 5,
                "options": [
                    {"id": "a", "text": "Cooking", "is_correct": False},
                    {"id": "b", "text": "Eating", "is_correct": True},
                    {"id": "c", "text": "Kitchen", "is_correct": False},
                    {"id": "d", "text": "Food", "is_correct": False}
                ],
                "explanation": "Book is used for reading, fork is used for eating"
            },
            {
                "id": "q16",
                "question_text": "Which word is the opposite of 'Benevolent'?",
                "category": "Verbal",
                "difficulty": "Medium",
                "time_limit": 120,
                "points": 10,
                "options": [
                    {"id": "a", "text": "Generous", "is_correct": False},
                    {"id": "b", "text": "Kind", "is_correct": False},
                    {"id": "c", "text": "Malevolent", "is_correct": True},
                    {"id": "d", "text": "Charitable", "is_correct": False}
                ],
                "explanation": "Benevolent means kind and generous, malevolent means evil and harmful"
            },
            {
                "id": "q17",
                "question_text": "Complete the sentence: The weather was so _____ that we had to cancel the picnic.",
                "category": "Verbal",
                "difficulty": "Medium",
                "time_limit": 120,
                "points": 10,
                "options": [
                    {"id": "a", "text": "pleasant", "is_correct": False},
                    {"id": "b", "text": "sunny", "is_correct": False},
                    {"id": "c", "text": "inclement", "is_correct": True},
                    {"id": "d", "text": "warm", "is_correct": False}
                ],
                "explanation": "Inclement means bad or severe weather, which would cause cancellation"
            },
            {
                "id": "q18",
                "question_text": "Which of these is NOT a synonym for 'Happy'?",
                "category": "Verbal",
                "difficulty": "Easy",
                "time_limit": 60,
                "points": 5,
                "options": [
                    {"id": "a", "text": "Joyful", "is_correct": False},
                    {"id": "b", "text": "Melancholy", "is_correct": True},
                    {"id": "c", "text": "Cheerful", "is_correct": False},
                    {"id": "d", "text": "Delighted", "is_correct": False}
                ],
                "explanation": "Melancholy means sad or depressed, which is the opposite of happy"
            },
            # Data Interpretation (2 questions)
            {
                "id": "q19",
                "question_text": "If a company's revenue increased from $100,000 to $120,000, what was the percentage increase?",
                "category": "Data Interpretation",
                "difficulty": "Medium",
                "time_limit": 120,
                "points": 10,
                "options": [
                    {"id": "a", "text": "15%", "is_correct": False},
                    {"id": "b", "text": "20%", "is_correct": True},
                    {"id": "c", "text": "25%", "is_correct": False},
                    {"id": "d", "text": "30%", "is_correct": False}
                ],
                "explanation": "Increase = $20,000. Percentage = (20,000/100,000) × 100 = 20%"
            },
            {
                "id": "q20",
                "question_text": "In a survey of 200 people, 60% prefer coffee, 30% prefer tea, and 10% prefer neither. How many people prefer tea?",
                "category": "Data Interpretation",
                "difficulty": "Easy",
                "time_limit": 90,
                "points": 5,
                "options": [
                    {"id": "a", "text": "40", "is_correct": False},
                    {"id": "b", "text": "50", "is_correct": False},
                    {"id": "c", "text": "60", "is_correct": True},
                    {"id": "d", "text": "70", "is_correct": False}
                ],
                "explanation": "30% of 200 = 0.3 × 200 = 60 people"
            }
        ]
    }

def save_aptitude_tests():
    try:
        with open(APTITUDE_TESTS_FILE, "w") as f:
            json.dump(aptitude_tests, f, indent=2)
        global _aptitude_tests_loaded
        _aptitude_tests_loaded = True  # Ensure cache is marked as loaded
    except Exception as e:
        print(f"Error saving aptitude tests: {e}")

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
# User registration
@app.post("/user/register/")
async def register_firebase_user(user_id: str, email: str, name: str):
    # This function is no longer needed as user_progress is in-memory
    # and user_sessions is also in-memory.
    # Keeping it for now as it might be called by other parts of the app.
    user_sessions[user_id] = {"email": email, "name": name, "skills": [], "target_roles": []}
    return {"message": "User registered", "user_id": user_id}

# Get user profile
@app.get("/user/{user_id}/profile/")
async def get_user_profile(user_id: str):
    # This function is no longer needed as user_sessions is in-memory.
    # Keeping it for now as it might be called by other parts of the app.
    user = user_sessions.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Get user progress
@app.get("/user/progress/")
async def get_user_progress(user_id: str):
    # This function is no longer needed as user_progress is in-memory.
    # Keeping it for now as it might be called by other parts of the app.
    progress = user_progress.get(user_id)
    if not progress:
        raise HTTPException(status_code=404, detail="User not found")
    return progress

# Update resume score
@app.post("/user/progress/resume-score/")
async def update_resume_score(user_id: str, score: int):
    # This function is no longer needed as user_progress is in-memory.
    # Keeping it for now as it might be called by other parts of the app.
    user_progress[user_id] = {"user_id": user_id, "completed_questions": [], "applied_jobs": [], "resume_score": score, "last_analysis_date": datetime.now().isoformat()}
    return {"message": "Resume score updated", "user_id": user_id, "score": score}

# Mark question complete
@app.post("/dsa/questions/{question_id}/complete/")
async def complete_question(question_id: str, user_id: str):
    # This function is no longer needed as user_progress is in-memory.
    # Keeping it for now as it might be called by other parts of the app.
    user_progress[user_id] = {"user_id": user_id, "completed_questions": [], "applied_jobs": [], "resume_score": None, "last_analysis_date": None}
    user_progress[user_id]["completed_questions"].append(question_id)
    return {"message": "Question marked complete", "user_id": user_id, "question_id": question_id}

# Apply for job
@app.post("/jobs/{job_id}/apply/")
async def apply_for_job(job_id: str, user_id: str):
    # This function is no longer needed as user_progress is in-memory.
    # Keeping it for now as it might be called by other parts of the app.
    user_progress[user_id] = {"user_id": user_id, "completed_questions": [], "applied_jobs": [], "resume_score": None, "last_analysis_date": None}
    user_progress[user_id]["applied_jobs"].append(job_id)
    return {"message": "Application submitted successfully", "job_id": job_id}

# Job listings endpoints
@app.get("/jobs/")
async def get_jobs(user_id: str = None):
    if user_id and user_id in user_progress:
        # Filter jobs based on user's skills and target roles
        user_data = user_progress[user_id]
        return {"jobs": job_listings, "recommended": job_listings[:3]}
    return {"jobs": job_listings, "recommended": []}

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

# --- Leaderboard (stub) ---
leaderboard = []  # [{user_id, score, percentage, date}]

@app.get("/api/aptitude/leaderboard/{test_id}")
async def get_leaderboard(test_id: str):
    # For now, just return the stub
    return {"leaderboard": leaderboard}

# NCS Jobs API Endpoints
@app.post("/api/jobs/bulk-update")
async def bulk_update_jobs(update: BulkJobUpdate):
    """Update job listings with NCS jobs"""
    global job_listings, ncs_jobs
    
    try:
        # Convert NCS jobs to standard job format
        new_jobs = []
        for ncs_job in update.jobs:
            job = {
                "id": ncs_job.id,
                "title": ncs_job.title,
                "company": ncs_job.company,
                "location": ncs_job.location,
                "description": ncs_job.description,
                "requirements": ncs_job.requirements,
                "salary_range": ncs_job.salary_range,
                "application_deadline": ncs_job.application_deadline,
                "posted_date": ncs_job.posted_date,
                "source": ncs_job.source,
                "source_url": ncs_job.source_url,
                "category": ncs_job.category,
                "employment_type": ncs_job.employment_type,
                "experience_level": ncs_job.experience_level,
                "remote_friendly": ncs_job.remote_friendly,
                "government_job": ncs_job.government_job
            }
            new_jobs.append(job)
        
        # Add to existing job listings
        job_listings.extend(new_jobs)
        ncs_jobs = new_jobs
        
        return {
            "message": f"Successfully added {len(new_jobs)} NCS jobs",
            "total_jobs": len(job_listings),
            "ncs_jobs": len(ncs_jobs)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating jobs: {str(e)}")

@app.get("/api/jobs/ncs")
async def get_ncs_jobs():
    """Get all NCS jobs"""
    return {
        "jobs": ncs_jobs,
        "total": len(ncs_jobs),
        "source": "National Career Service (NCS)"
    }

@app.get("/api/jobs/sources")
async def get_job_sources():
    """Get available job sources"""
    sources = {
        "ncs": {
            "name": "National Career Service (NCS)",
            "description": "Government of India job portal",
            "total_jobs": len(ncs_jobs),
            "last_updated": datetime.now().isoformat()
        },
        "manual": {
            "name": "Manual Entries",
            "description": "Manually added job listings",
            "total_jobs": len([j for j in job_listings if j.get("source") != "National Career Service (NCS)"]),
            "last_updated": datetime.now().isoformat()
        }
    }
    return sources

def get_company_logo_url(company_domain):
    # Placeholder: In production, use a real logo service or static assets
    return f"https://logo.clearbit.com/{company_domain}"

# Load Apple jobs from JSON at startup
@app.get("/api/apple-jobs")
def get_apple_jobs():
    file_path = os.path.join(os.path.dirname(__file__), 'jobs_data/jobs_apple.com.json')
    return FileResponse(file_path, media_type="application/json")
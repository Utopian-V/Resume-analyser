import os
import pdfplumber
import requests
import json
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

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama3-8b-8192")

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

# --- API Endpoints ---
@app.on_event("startup")
async def startup_event():
    print("🚀 Starting Resume Review AI Backend...")
    print("📊 Initializing sample data...")
    initialize_sample_data()
    print("🧠 Loading aptitude tests...")
    load_aptitude_tests()
    print(f"✅ Loaded {len(aptitude_tests)} aptitude test(s)")
    print("🎯 Backend ready!")

@app.get("/api/aptitude/tests")
async def get_aptitude_tests():
    load_aptitude_tests()  # Ensure tests are loaded
    return {"tests": list(aptitude_tests.values())}

@app.get("/api/aptitude/test/{test_id}")
async def get_aptitude_test(test_id: str):
    import time
    start_time = time.time()
    
    load_aptitude_tests()  # Ensure tests are loaded
    test = aptitude_tests.get(test_id)
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    
    response_time = time.time() - start_time
    print(f"📊 Aptitude test loaded in {response_time:.3f}s")
    
    return test

@app.post("/api/aptitude/test/{test_id}/submit")
async def submit_aptitude_test(test_id: str, submission: TestSubmission):
    load_aptitude_tests()  # Ensure tests are loaded
    test = aptitude_tests.get(test_id)
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    score = 0
    total_possible = 0
    results = []
    for question in test["questions"]:
        total_possible += question["points"]
        user_answer = submission.answers.get(question["id"])
        correct_answer = next(o["id"] for o in question["options"] if o["is_correct"])
        is_correct = user_answer == correct_answer
        if is_correct:
            score += question["points"]
        results.append({
            "question_id": question["id"],
            "question_text": question["question_text"],
            "user_answer": user_answer,
            "correct_answer": correct_answer,
            "is_correct": is_correct,
            "points_earned": question["points"] if is_correct else 0,
            "explanation": question.get("explanation", "")
        })
    percentage = (score / total_possible) * 100 if total_possible > 0 else 0
    passed = percentage >= test["passing_score"]
    # Optionally, update leaderboard here
    return {
        "score": score,
        "total_possible": total_possible,
        "percentage": percentage,
        "passed": passed,
        "results": results
    }

@app.post("/api/aptitude/questions/add")
async def add_aptitude_question(question: AptitudeQuestion, test_id: str = "test1"):
    try:
        load_aptitude_tests()  # Ensure tests are loaded
        test = aptitude_tests.get(test_id)
        if not test:
            raise HTTPException(status_code=404, detail="Test not found")
        question_id = f"q{len(test['questions']) + 1}"
        question_dict = question.dict()
        question_dict["id"] = question_id
        test["questions"].append(question_dict)
        test["total_questions"] = len(test["questions"])
        aptitude_tests[test_id] = test
        save_aptitude_tests()
        return {"message": "Question added successfully", "question_id": question_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

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

@app.get("/api/jobs/all")
async def get_all_company_jobs(
    category: str = Query(None),
    company: str = Query(None),
    experience: str = Query(None),
    remote: bool = Query(None),
    government: bool = Query(None),
    source: str = Query(None),
    search: str = Query(None)
):
    """Aggregate all jobs from jobs_*.json files and support filtering."""
    jobs_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../scripts/ncs_scraper'))
    job_files = glob.glob(os.path.join(jobs_dir, 'jobs_*.json'))
    all_jobs = []
    for file_path in job_files:
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
                jobs = data.get('jobs', [])
                # Infer company from filename
                company_domain = os.path.basename(file_path)[5:-5]
                for job in jobs:
                    job['company_domain'] = company_domain
                    job['company_logo'] = get_company_logo_url(company_domain)
                    job['company_credit'] = f"Jobs scraped from {company_domain} career page"
                    all_jobs.append(job)
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
            continue
    # Filtering
    def job_filter(job):
        if category and job.get('category') != category:
            return False
        if company and (company.lower() not in job.get('company', '').lower() and company.lower() not in job.get('company_domain', '').lower()):
            return False
        if experience and job.get('experience_level') != experience:
            return False
        if remote is not None and bool(job.get('remote_friendly')) != remote:
            return False
        if government is not None and bool(job.get('government_job')) != government:
            return False
        if source and source.lower() not in str(job.get('source', '')).lower():
            return False
        if search:
            s = search.lower()
            if s not in job.get('title', '').lower() and s not in job.get('description', '').lower():
                return False
        return True
    filtered_jobs = [job for job in all_jobs if job_filter(job)]
    return {
        "total": len(filtered_jobs),
        "jobs": filtered_jobs
    }
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
import os
import json
import uuid
from typing import Optional

def load_all_jobs():
    jobs_dir = os.path.join(os.path.dirname(__file__), '../jobs_data')
    all_jobs = []
    for filename in os.listdir(jobs_dir):
        if filename.startswith('jobs_') and filename.endswith('.json'):
            file_path = os.path.join(jobs_dir, filename)
            try:
                with open(file_path, 'r') as f:
                    data = json.load(f)
                    jobs = data.get('jobs', [])
                    all_jobs.extend(jobs)
            except Exception as e:
                continue
    return all_jobs

router = APIRouter()

@router.get("/api/jobs/corpus")
def get_jobs_corpus():
    jobs = load_all_jobs()
    if not jobs:
        raise HTTPException(status_code=404, detail="No jobs found.")
    return JSONResponse(content={"jobs": jobs})

# Resume Analysis Endpoints
@router.post("/analyze-resume/")
async def analyze_resume(file: UploadFile = File(...)):
    """Analyze uploaded resume and return skill assessment"""
    try:
        # Simulate resume analysis
        # In a real implementation, you would process the PDF/text file
        # and extract skills, experience, etc.
        
        # Mock analysis results
        analysis_result = {
            "skills": [
                {"name": "JavaScript", "level": "Advanced", "confidence": 0.9},
                {"name": "React", "level": "Intermediate", "confidence": 0.8},
                {"name": "Python", "level": "Intermediate", "confidence": 0.7},
                {"name": "Node.js", "level": "Advanced", "confidence": 0.85},
                {"name": "MongoDB", "level": "Beginner", "confidence": 0.6}
            ],
            "experience": "3-5 years",
            "recommendations": [
                "Focus on system design skills",
                "Practice more DSA problems",
                "Learn cloud technologies"
            ],
            "score": 75
        }
        
        return JSONResponse(content=analysis_result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume analysis failed: {str(e)}")

# Aptitude Test Endpoints
@router.get("/api/aptitude/test/{test_id}")
async def get_aptitude_test(test_id: str):
    """Get aptitude test questions"""
    try:
        # Load aptitude questions from JSON file
        questions_file = os.path.join(os.path.dirname(__file__), '../aptitude_tests.json')
        
        if not os.path.exists(questions_file):
            # Create sample questions if file doesn't exist
            sample_questions = {
                "test1": {
                    "id": "test1",
                    "title": "General Aptitude Test",
                    "duration": 30,
                    "questions": [
                        {
                            "id": "q1",
                            "question": "If a train travels at 60 km/h, how long will it take to travel 180 km?",
                            "options": [
                                {"id": "a", "text": "2 hours"},
                                {"id": "b", "text": "3 hours"},
                                {"id": "c", "text": "4 hours"},
                                {"id": "d", "text": "5 hours"}
                            ],
                            "correct_answer": "b"
                        },
                        {
                            "id": "q2",
                            "question": "What is 25% of 200?",
                            "options": [
                                {"id": "a", "text": "25"},
                                {"id": "b", "text": "50"},
                                {"id": "c", "text": "75"},
                                {"id": "d", "text": "100"}
                            ],
                            "correct_answer": "b"
                        }
                    ]
                }
            }
            
            with open(questions_file, 'w') as f:
                json.dump(sample_questions, f, indent=2)
        
        with open(questions_file, 'r') as f:
            tests = json.load(f)
        
        if test_id not in tests:
            raise HTTPException(status_code=404, detail="Test not found")
        
        return JSONResponse(content=tests[test_id])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load test: {str(e)}")

@router.post("/api/aptitude/test/{test_id}/submit")
async def submit_aptitude_test(test_id: str, answers: dict, user_id: Optional[str] = None):
    """Submit aptitude test answers and get results"""
    try:
        # Load test questions
        questions_file = os.path.join(os.path.dirname(__file__), '../aptitude_tests.json')
        
        if not os.path.exists(questions_file):
            raise HTTPException(status_code=404, detail="Test not found")
        
        with open(questions_file, 'r') as f:
            tests = json.load(f)
        
        if test_id not in tests:
            raise HTTPException(status_code=404, detail="Test not found")
        
        test = tests[test_id]
        questions = test.get("questions", [])
        
        # Calculate score
        correct_answers = 0
        total_questions = len(questions)
        
        for question in questions:
            question_id = question["id"]
            correct_answer = question["correct_answer"]
            
            if question_id in answers and answers[question_id] == correct_answer:
                correct_answers += 1
        
        score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
        passed = score >= 70  # 70% passing threshold
        
        result = {
            "score": round(score, 2),
            "correct_answers": correct_answers,
            "total_questions": total_questions,
            "passed": passed,
            "user_id": user_id,
            "test_id": test_id
        }
        
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to submit test: {str(e)}")

@router.post("/api/aptitude/questions/add")
async def add_aptitude_question(question: dict, test_id: str = "test1"):
    """Add a new aptitude question"""
    try:
        questions_file = os.path.join(os.path.dirname(__file__), '../aptitude_tests.json')
        
        # Load existing tests
        if os.path.exists(questions_file):
            with open(questions_file, 'r') as f:
                tests = json.load(f)
        else:
            tests = {}
        
        # Initialize test if it doesn't exist
        if test_id not in tests:
            tests[test_id] = {
                "id": test_id,
                "title": f"Aptitude Test {test_id}",
                "duration": 30,
                "questions": []
            }
        
        # Add question
        question["id"] = f"q{len(tests[test_id]['questions']) + 1}"
        tests[test_id]["questions"].append(question)
        
        # Save back to file
        with open(questions_file, 'w') as f:
            json.dump(tests, f, indent=2)
        
        return JSONResponse(content={"message": "Question added successfully", "question_id": question["id"]})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add question: {str(e)}")

@router.get("/api/aptitude/leaderboard/{test_id}")
async def get_aptitude_leaderboard(test_id: str):
    """Get aptitude test leaderboard"""
    try:
        # Mock leaderboard data
        # In a real implementation, this would come from a database
        leaderboard = [
            {"user_id": "user1", "username": "John Doe", "score": 95, "timestamp": "2024-01-15T10:30:00Z"},
            {"user_id": "user2", "username": "Jane Smith", "score": 88, "timestamp": "2024-01-14T15:45:00Z"},
            {"user_id": "user3", "username": "Mike Johnson", "score": 82, "timestamp": "2024-01-13T09:20:00Z"},
            {"user_id": "user4", "username": "Sarah Wilson", "score": 78, "timestamp": "2024-01-12T14:15:00Z"},
            {"user_id": "user5", "username": "David Brown", "score": 75, "timestamp": "2024-01-11T11:30:00Z"}
        ]
        
        return JSONResponse(content={"leaderboard": leaderboard})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load leaderboard: {str(e)}")

# User Management Endpoints
@router.post("/user/register/")
async def register_user(user_data: dict):
    """Register a new user"""
    try:
        # Mock user registration
        # In a real implementation, this would save to a database
        user_id = str(uuid.uuid4())
        
        return JSONResponse(content={
            "user_id": user_id,
            "message": "User registered successfully",
            "user": {
                "id": user_id,
                "email": user_data.get("email"),
                "name": user_data.get("name")
            }
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@router.get("/user/{user_id}/profile/")
async def get_user_profile(user_id: str):
    """Get user profile"""
    try:
        # Mock user profile
        profile = {
            "id": user_id,
            "name": "John Doe",
            "email": "john@example.com",
            "joined_date": "2024-01-01",
            "progress": {
                "dsa_questions_completed": 45,
                "aptitude_tests_taken": 3,
                "resume_score": 75
            }
        }
        
        return JSONResponse(content=profile)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load profile: {str(e)}")

@router.get("/user/progress/")
async def get_user_progress(user_id: str):
    """Get user progress"""
    try:
        # Mock progress data
        progress = {
            "user_id": user_id,
            "dsa_questions_completed": 45,
            "aptitude_tests_taken": 3,
            "resume_score": 75,
            "total_questions_available": 200,
            "streak_days": 7
        }
        
        return JSONResponse(content=progress)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load progress: {str(e)}")

@router.post("/user/progress/resume-score/")
async def update_resume_score(user_id: str, score: int):
    """Update user's resume score"""
    try:
        # Mock update
        return JSONResponse(content={
            "user_id": user_id,
            "resume_score": score,
            "message": "Score updated successfully"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update score: {str(e)}")

# DSA Endpoints
@router.get("/dsa/questions/")
async def get_dsa_questions(user_id: Optional[str] = None, difficulty: Optional[str] = None, category: Optional[str] = None):
    """Get DSA questions"""
    try:
        # Mock DSA questions
        questions = [
            {
                "id": "q1",
                "title": "Two Sum",
                "difficulty": "Easy",
                "category": "Arrays",
                "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target."
            },
            {
                "id": "q2",
                "title": "Valid Parentheses",
                "difficulty": "Easy",
                "category": "Stack",
                "description": "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid."
            }
        ]
        
        return JSONResponse(content={"questions": questions})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load questions: {str(e)}")

@router.post("/dsa/questions/{question_id}/complete/")
async def complete_dsa_question(question_id: str, user_id: str):
    """Mark DSA question as completed"""
    try:
        return JSONResponse(content={
            "question_id": question_id,
            "user_id": user_id,
            "message": "Question marked as completed"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to complete question: {str(e)}")

@router.get("/dsa/recommendations/")
async def get_dsa_recommendations(user_id: str):
    """Get DSA recommendations for user"""
    try:
        recommendations = [
            "Focus on array manipulation problems",
            "Practice more dynamic programming",
            "Work on graph algorithms"
        ]
        
        return JSONResponse(content={"recommendations": recommendations})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load recommendations: {str(e)}")

# Interview Chat Endpoints
@router.post("/interview/chat/")
async def send_interview_message(user_id: str, role: str, message: str, conversation_id: Optional[str] = None):
    """Send interview chat message"""
    try:
        # Mock AI response
        ai_response = f"Thank you for your response about {role}. Here's some feedback on your answer..."
        
        return JSONResponse(content={
            "conversation_id": conversation_id or str(uuid.uuid4()),
            "response": ai_response,
            "user_id": user_id
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process message: {str(e)}")

# Job Application Endpoints
@router.post("/jobs/{job_id}/apply/")
async def apply_for_job(job_id: str, user_id: str):
    """Apply for a job"""
    try:
        return JSONResponse(content={
            "job_id": job_id,
            "user_id": user_id,
            "status": "applied",
            "message": "Application submitted successfully"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to apply: {str(e)}")

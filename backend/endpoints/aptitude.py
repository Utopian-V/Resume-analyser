from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional
import os
import json

router = APIRouter(prefix="/aptitude", tags=["aptitude"])

def load_aptitude_tests():
    """Load aptitude tests from JSON file"""
    tests_file = os.path.join(os.path.dirname(__file__), '../data/aptitude_tests.json')
    
    if not os.path.exists(tests_file):
        # Create default test structure
        default_tests = {
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
                    }
                ]
            }
        }
        
        os.makedirs(os.path.dirname(tests_file), exist_ok=True)
        with open(tests_file, 'w') as f:
            json.dump(default_tests, f, indent=2)
    
    with open(tests_file, 'r') as f:
        return json.load(f)

@router.get("/test/{test_id}")
async def get_aptitude_test(test_id: str):
    """Get aptitude test by ID"""
    try:
        tests = load_aptitude_tests()
        
        if test_id not in tests:
            raise HTTPException(status_code=404, detail="Test not found")
        
        return tests[test_id]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load test: {str(e)}")

@router.post("/test/{test_id}/submit")
async def submit_aptitude_test(test_id: str, answers: dict, user_id: Optional[str] = None):
    """Submit aptitude test answers and get results"""
    try:
        tests = load_aptitude_tests()
        
        if test_id not in tests:
            raise HTTPException(status_code=404, detail="Test not found")
        
        test = tests[test_id]
        questions = test.get("questions", [])
        
        # Calculate score
        correct_answers = sum(
            1 for question in questions
            if answers.get(question["id"]) == question["correct_answer"]
        )
        
        total_questions = len(questions)
        score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
        passed = score >= 70
        
        return {
            "score": round(score, 2),
            "correct_answers": correct_answers,
            "total_questions": total_questions,
            "passed": passed,
            "user_id": user_id,
            "test_id": test_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to submit test: {str(e)}")

@router.post("/questions/add")
async def add_aptitude_question(question: dict, test_id: str = "test1"):
    """Add a new aptitude question"""
    try:
        tests_file = os.path.join(os.path.dirname(__file__), '../data/aptitude_tests.json')
        
        # Load existing tests
        if os.path.exists(tests_file):
            with open(tests_file, 'r') as f:
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
        
        # Add question with unique ID
        question["id"] = f"q{len(tests[test_id]['questions']) + 1}"
        tests[test_id]["questions"].append(question)
        
        # Save back to file
        os.makedirs(os.path.dirname(tests_file), exist_ok=True)
        with open(tests_file, 'w') as f:
            json.dump(tests, f, indent=2)
        
        return {"message": "Question added successfully", "question_id": question["id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add question: {str(e)}")

@router.get("/leaderboard/{test_id}")
async def get_aptitude_leaderboard(test_id: str):
    """Get aptitude test leaderboard"""
    # This would typically connect to a database
    # For now, return mock data
    return {
        "test_id": test_id,
        "leaderboard": [
            {"user_id": "user1", "score": 95, "rank": 1},
            {"user_id": "user2", "score": 88, "rank": 2},
            {"user_id": "user3", "score": 82, "rank": 3}
        ]
    } 
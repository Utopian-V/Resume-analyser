from fastapi import APIRouter, HTTPException
from typing import Optional

router = APIRouter(prefix="/users", tags=["users"])

# Mock user data - in production this would be in a database
mock_users = {}
mock_progress = {}

@router.post("/register")
async def register_user(user_data: dict):
    """Register a new user"""
    try:
        user_id = user_data.get("user_id")
        if not user_id:
            raise HTTPException(status_code=400, detail="user_id is required")
        
        if user_id in mock_users:
            raise HTTPException(status_code=409, detail="User already exists")
        
        mock_users[user_id] = {
            "user_id": user_id,
            "name": user_data.get("name", ""),
            "email": user_data.get("email", ""),
            "created_at": "2024-01-01T00:00:00Z"
        }
        
        # Initialize user progress
        mock_progress[user_id] = {
            "resume_score": 0,
            "aptitude_tests_completed": 0,
            "dsa_questions_solved": 0,
            "interviews_practiced": 0
        }
        
        return {"message": "User registered successfully", "user_id": user_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@router.get("/{user_id}/profile")
async def get_user_profile(user_id: str):
    """Get user profile"""
    if user_id not in mock_users:
        raise HTTPException(status_code=404, detail="User not found")
    
    return mock_users[user_id]

@router.get("/progress")
async def get_user_progress(user_id: str):
    """Get user progress"""
    if user_id not in mock_progress:
        raise HTTPException(status_code=404, detail="User not found")
    
    return mock_progress[user_id]

@router.post("/progress/resume-score")
async def update_resume_score(user_id: str, score: int):
    """Update user's resume score"""
    if user_id not in mock_progress:
        raise HTTPException(status_code=404, detail="User not found")
    
    mock_progress[user_id]["resume_score"] = score
    return {"message": "Resume score updated", "score": score} 
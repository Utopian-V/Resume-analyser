from fastapi import APIRouter, HTTPException
from typing import Optional
from models import User
from core.optimized_database import db
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/users", tags=["users"])

class UserRegisterRequest(BaseModel):
    email: str
    name: str
    role: Optional[str] = "user"
    skills: Optional[list[str]] = []
    target_roles: Optional[list[str]] = []

class ResumeScoreUpdateRequest(BaseModel):
    user_id: str
    score: int

@router.post("/register")
async def register_user(user: UserRegisterRequest):
    """Register a new user in Neon/Postgres"""
    try:
        # Check if user already exists
        query = "SELECT id FROM users WHERE email = $1"
        existing = await db.fetchrow(query, user.email)
        if existing:
            raise HTTPException(status_code=409, detail="User already exists")
        # Insert user
        insert_query = """
            INSERT INTO users (email, name, role, skills, target_roles, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
            RETURNING id, email, name, role, skills, target_roles, created_at, updated_at
        """
        row = await db.fetchrow(insert_query, user.email, user.name, user.role, user.skills, user.target_roles)
        # Create progress row
        await db.execute(
            "INSERT INTO user_progress (user_id, resume_score, aptitude_tests_completed, dsa_questions_solved, interviews_practiced, updated_at) VALUES ($1, 0, 0, 0, 0, NOW())",
            row["id"]
        )
        return {"message": "User registered successfully", "user_id": row["id"]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@router.get("/{user_id}/profile")
async def get_user_profile(user_id: str):
    """Get user profile from Neon/Postgres"""
    query = "SELECT id, email, name, role, skills, target_roles, created_at, updated_at FROM users WHERE id = $1"
    row = await db.fetchrow(query, user_id)
    if not row:
        raise HTTPException(status_code=404, detail="User not found")
    return row

@router.get("/progress")
async def get_user_progress(user_id: str):
    """Get user progress from Neon/Postgres"""
    query = """
        SELECT up.resume_score, up.aptitude_tests_completed, up.dsa_questions_solved, up.interviews_practiced, up.updated_at
        FROM user_progress up
        JOIN users u ON up.user_id = u.id
        WHERE u.id = $1
    """
    row = await db.fetchrow(query, user_id)
    if not row:
        raise HTTPException(status_code=404, detail="User not found or no progress data")
    return row

@router.post("/progress/resume-score")
async def update_resume_score(data: ResumeScoreUpdateRequest):
    """Update user's resume score in Neon/Postgres"""
    # Check if user exists
    user_query = "SELECT id FROM users WHERE id = $1"
    user = await db.fetchrow(user_query, data.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # Update progress
    update_query = """
        UPDATE user_progress SET resume_score = $1, updated_at = NOW() WHERE user_id = $2
    """
    await db.execute(update_query, data.score, data.user_id)
    return {"message": "Resume score updated", "score": data.score} 
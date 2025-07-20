from fastapi import APIRouter, HTTPException
from typing import Optional
import os
import csv

router = APIRouter(prefix="/dsa", tags=["dsa"])

def load_dsa_questions():
    """Load DSA questions from CSV files"""
    questions = []
    dsa_dir = os.path.join(os.path.dirname(__file__), '../data/dsa-bank')
    
    if not os.path.exists(dsa_dir):
        return questions
    
    for filename in os.listdir(dsa_dir):
        if filename.endswith('.csv'):
            file_path = os.path.join(dsa_dir, filename)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    reader = csv.DictReader(f)
                    for row in reader:
                        questions.append({
                            "id": f"{filename}_{row.get('id', len(questions))}",
                            "category": filename.replace('.csv', ''),
                            "question": row.get('question', ''),
                            "difficulty": row.get('difficulty', 'medium'),
                            "solution": row.get('solution', ''),
                            "tags": row.get('tags', '').split(',') if row.get('tags') else []
                        })
            except Exception as e:
                print(f"Error loading {filename}: {e}")
                continue
    
    return questions

@router.get("/questions")
async def get_dsa_questions(
    user_id: Optional[str] = None, 
    difficulty: Optional[str] = None, 
    category: Optional[str] = None
):
    """Get DSA questions with optional filtering"""
    questions = load_dsa_questions()
    
    # Apply filters
    if difficulty:
        questions = [q for q in questions if q["difficulty"] == difficulty]
    
    if category:
        questions = [q for q in questions if category.lower() in q["category"].lower()]
    
    return {
        "questions": questions,
        "total": len(questions),
        "filters": {
            "difficulty": difficulty,
            "category": category
        }
    }

@router.post("/questions/{question_id}/complete")
async def complete_dsa_question(question_id: str, user_id: str):
    """Mark a DSA question as completed"""
    # In a real implementation, this would update the database
    return {
        "message": "Question marked as completed",
        "question_id": question_id,
        "user_id": user_id
    }

@router.get("/recommendations")
async def get_dsa_recommendations(user_id: str):
    """Get personalized DSA recommendations"""
    questions = load_dsa_questions()
    
    # Simple recommendation logic - return random questions
    import random
    recommended = random.sample(questions, min(5, len(questions)))
    
    return {
        "recommendations": recommended,
        "user_id": user_id
    } 
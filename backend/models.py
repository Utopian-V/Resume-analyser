"""
Data Models for PrepNexus Backend
Handled by: Backend Team
Purpose: Define data structures and validation schemas for the application

These models define the structure of data objects used throughout the application,
ensuring type safety and validation through Pydantic.
"""
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    """User roles for access control and permissions"""
    USER = "user"
    ADMIN = "admin"
    WRITER = "writer"

class DifficultyLevel(str, Enum):
    """Difficulty levels for DSA questions and aptitude tests"""
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

class User(BaseModel):
    """
    User model representing a platform user.
    
    Contains user profile information, skills, and preferences
    for personalized recommendations and progress tracking.
    """
    id: Optional[str] = Field(None, description="Unique user identifier")
    email: EmailStr = Field(..., description="User's email address")
    name: str = Field(..., min_length=1, max_length=100, description="User's full name")
    role: UserRole = Field(default=UserRole.USER, description="User's role in the system")
    skills: List[str] = Field(default_factory=list, description="User's technical skills")
    target_roles: List[str] = Field(default_factory=list, description="Target job roles")
    created_at: Optional[datetime] = Field(None, description="Account creation timestamp")
    updated_at: Optional[datetime] = Field(None, description="Last update timestamp")

    class Config:
        # Enable ORM mode for database integration
        from_attributes = True
        # Example data for documentation
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "name": "John Doe",
                "skills": ["Python", "React", "DSA"],
                "target_roles": ["Software Engineer", "Full Stack Developer"]
            }
        }

class JobListing(BaseModel):
    """
    Job listing model representing available job opportunities.
    
    Used for job matching, recommendations, and the job corpus
    that powers the platform's job-related features.
    """
    id: str = Field(..., description="Unique job identifier")
    title: str = Field(..., min_length=1, max_length=200, description="Job title")
    company: str = Field(..., min_length=1, max_length=100, description="Company name")
    location: str = Field(..., min_length=1, max_length=100, description="Job location")
    description: str = Field(..., min_length=10, description="Job description")
    requirements: List[str] = Field(default_factory=list, description="Required skills")
    salary_range: Optional[str] = Field(None, description="Salary range information")
    application_deadline: Optional[str] = Field(None, description="Application deadline")
    posted_date: Optional[datetime] = Field(None, description="Job posting date")
    job_type: Optional[str] = Field(None, description="Full-time, Part-time, Contract, etc.")

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "job_123",
                "title": "Senior Software Engineer",
                "company": "Tech Corp",
                "location": "San Francisco, CA",
                "description": "We're looking for a talented engineer...",
                "requirements": ["Python", "React", "5+ years experience"],
                "salary_range": "$120k - $180k"
            }
        }

class DSAQuestion(BaseModel):
    """
    Data Structures and Algorithms question model.
    
    Represents practice questions for DSA preparation,
    including difficulty levels, categories, and solutions.
    """
    id: str = Field(..., description="Unique question identifier")
    title: str = Field(..., min_length=1, max_length=200, description="Question title")
    difficulty: DifficultyLevel = Field(..., description="Question difficulty level")
    category: str = Field(..., min_length=1, max_length=50, description="Question category")
    description: str = Field(..., min_length=10, description="Question description")
    leetcode_url: Optional[str] = Field(None, description="Link to LeetCode problem")
    tags: List[str] = Field(default_factory=list, description="Question tags")
    solution: Optional[str] = Field(None, description="Solution explanation")
    time_complexity: Optional[str] = Field(None, description="Time complexity")
    space_complexity: Optional[str] = Field(None, description="Space complexity")

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "dsa_001",
                "title": "Two Sum",
                "difficulty": "easy",
                "category": "arrays",
                "description": "Given an array of integers...",
                "tags": ["hash-table", "arrays"],
                "time_complexity": "O(n)",
                "space_complexity": "O(n)"
            }
        }

class BlogPost(BaseModel):
    """
    Blog post model for the platform's content management.
    
    Represents blog articles with metadata for SEO,
    content management, and user engagement tracking.
    """
    id: Optional[str] = Field(None, description="Unique blog identifier")
    title: str = Field(..., min_length=1, max_length=200, description="Blog title")
    content: str = Field(..., min_length=10, description="Blog content (HTML)")
    author: str = Field(..., min_length=1, max_length=100, description="Author name")
    image: Optional[str] = Field(None, description="Featured image URL")
    tags: List[str] = Field(default_factory=list, description="Blog tags for categorization")
    created_at: Optional[datetime] = Field(None, description="Publication date")
    updated_at: Optional[datetime] = Field(None, description="Last update date")
    read_time: Optional[int] = Field(None, description="Estimated reading time in minutes")
    seo_description: Optional[str] = Field(None, description="SEO meta description")

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "title": "How to Ace Your Technical Interview",
                "content": "<h1>Technical Interview Guide</h1><p>...</p>",
                "author": "PrepNexus Team",
                "tags": ["interview", "technical", "career"],
                "read_time": 5
            }
        }

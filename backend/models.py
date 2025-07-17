from pydantic import BaseModel
from typing import List

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

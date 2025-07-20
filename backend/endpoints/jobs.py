from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
import os
import json

router = APIRouter(prefix="/jobs", tags=["jobs"])

def load_jobs_data():
    """Load all job data from JSON files"""
    jobs_dir = os.path.join(os.path.dirname(__file__), '../jobs_data')
    all_jobs = []
    
    if not os.path.exists(jobs_dir):
        return all_jobs
    
    for filename in os.listdir(jobs_dir):
        if filename.startswith('jobs_') and filename.endswith('.json'):
            file_path = os.path.join(jobs_dir, filename)
            try:
                with open(file_path, 'r') as f:
                    data = json.load(f)
                    jobs = data.get('jobs', [])
                    all_jobs.extend(jobs)
            except Exception as e:
                print(f"Error loading {filename}: {e}")
                continue
    
    return all_jobs

@router.get("/corpus")
async def get_jobs_corpus():
    """Get all available jobs"""
    jobs = load_jobs_data()
    if not jobs:
        raise HTTPException(status_code=404, detail="No jobs found")
    return {"jobs": jobs}

@router.get("/")
async def get_jobs(company: str = None, limit: int = 50):
    """Get jobs with optional filtering"""
    jobs = load_jobs_data()
    
    if company:
        jobs = [job for job in jobs if company.lower() in job.get('company', '').lower()]
    
    return {"jobs": jobs[:limit], "total": len(jobs)}

@router.get("/companies")
async def get_companies():
    """Get list of all companies"""
    jobs = load_jobs_data()
    companies = list(set(job.get('company', '') for job in jobs if job.get('company')))
    return {"companies": sorted(companies)}

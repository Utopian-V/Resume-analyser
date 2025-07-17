from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
import os
import json

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

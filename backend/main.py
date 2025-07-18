# =========================
# Imports
# =========================
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from endpoints.jobs import router as jobs_router
from endpoints.genai import router as genai_router
from endpoints.blogs import router as blogs_router

# =========================
# App Setup
# =========================
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Test Endpoint
# =========================
@app.get("/")
async def root():
    return {"message": "Prep Nexus API is running!"}

# =========================
# Routers
# =========================
app.include_router(jobs_router)
app.include_router(genai_router)
app.include_router(blogs_router)
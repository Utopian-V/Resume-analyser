# =========================
# Imports
# =========================
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from endpoints.jobs import router as jobs_router

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
# Routers
# =========================
app.include_router(jobs_router)
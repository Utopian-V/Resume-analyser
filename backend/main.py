"""
Main FastAPI Application Entry Point
Handled by: DevOps Team
Purpose: Application startup, routing, middleware configuration, and lifecycle management

This module serves as the main entry point for the PrepNexus backend API.
It configures the FastAPI application, sets up middleware, includes all
feature routers, and manages the application lifecycle including database
connections.

Key responsibilities:
- FastAPI application configuration and startup
- CORS middleware setup for frontend communication
- Database connection lifecycle management
- Feature router inclusion and organization
- Health check and monitoring endpoints
- SEO module integration (sitemap, RSS)
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Database connection management
from core.database import db

# Feature-specific endpoint routers
# Each router handles a specific domain of the application
from endpoints import blogs, jobs, aptitude, users, dsa, resume, interview

# SEO and content management modules
# These provide sitemap generation and RSS feeds for better SEO
from modules.seo import sitemap, rss

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager for startup and shutdown events.
    
    This function handles:
    - Database connection initialization on startup
    - Graceful database connection cleanup on shutdown
    - Application state management
    
    Args:
        app: FastAPI application instance
        
    Yields:
        None: Application runs during yield
    """
    # Application startup - initialize database connection pool
    await db.initialize()
    print("🚀 Application started - Database initialized")
    
    # Application runs here
    yield
    
    # Application shutdown - cleanup database connections
    await db.close()
    print("🛑 Application shutdown - Database closed")

# FastAPI application configuration
# Includes metadata for API documentation and versioning
app = FastAPI(
    title="PrepNexus API",
    description="AI-powered career preparation platform providing resume analysis, "
                "interview practice, DSA preparation, and job matching services",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",  # Swagger UI documentation
    redoc_url="/redoc"  # ReDoc documentation
)

# CORS (Cross-Origin Resource Sharing) middleware configuration
# Allows frontend application to communicate with the API
# In production, replace "*" with specific frontend domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Restrict to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],  # Content-Type, Authorization, etc.
)

# Feature Router Inclusion
# Each router handles a specific feature domain with its own endpoints
# This modular approach makes the codebase maintainable and scalable

# Content Management
app.include_router(blogs.router, prefix="/api")  # Blog management and content

# Job and Career Services
app.include_router(jobs.router, prefix="/api")   # Job listings and applications

# Assessment and Testing
app.include_router(aptitude.router, prefix="/api")  # Aptitude tests and assessments

# User Management
app.include_router(users.router, prefix="/api")     # User profiles and authentication

# Learning and Practice
app.include_router(dsa.router, prefix="/api")       # DSA questions and practice
app.include_router(resume.router, prefix="/api")    # Resume analysis and feedback
app.include_router(interview.router, prefix="/api") # Interview practice sessions

# Health and Performance Monitoring
from endpoints import health, performance, redis
app.include_router(health.router)  # Health monitoring endpoints
app.include_router(performance.router)  # Performance monitoring endpoints
app.include_router(redis.router)  # Redis cache management endpoints

# SEO and Content Discovery
# These routers provide sitemap and RSS feeds for better search engine visibility
app.include_router(sitemap.router, prefix="/seo")   # XML sitemap generation
app.include_router(rss.router, prefix="/seo")       # RSS feed generation

@app.get("/")
async def root():
    """
    Root endpoint providing API information and status.
    
    Returns:
        dict: API metadata including version, status, and available modules
    """
    return {
        "message": "PrepNexus API - AI-powered career preparation platform",
        "version": "1.0.0",
        "status": "operational",
        "documentation": {
            "swagger": "/docs",
            "redoc": "/redoc"
        },
        "modules": [
            "blogs",      # Content management
            "jobs",       # Job listings and applications
            "aptitude",   # Assessment and testing
            "users",      # User management
            "dsa",        # DSA practice
            "resume",     # Resume analysis
            "interview",  # Interview practice
            "seo"         # Sitemap and RSS
        ],
        "health_check": "/health"
    }

@app.get("/health")
async def health_check():
    """
    Health check endpoint for monitoring and load balancers.
    
    This endpoint is used by:
    - Load balancers to check service health
    - Monitoring systems to track API availability
    - DevOps tools for automated health checks
    
    Returns:
        dict: Health status and operational information
    """
    return {
        "status": "healthy",
        "message": "API is operational",
        "timestamp": "2024-01-01T00:00:00Z",  # TODO: Add actual timestamp
        "version": "1.0.0"
    }
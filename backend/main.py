
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Database connection management
from core.database import db

from endpoints import blogs, jobs, aptitude, users, dsa, resume, interview

from modules.seo.rss import  router as rss_router
from modules.seo.sitemap import router as sitemap_router



@asynccontextmanager
async def lifespan(app: FastAPI):
    
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
app.include_router(sitemap_router)   # XML sitemap generation
app.include_router(rss_router, prefix="/seo")       # RSS feed generation

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

@app.get("/debug/routes")
async def list_routes():
    return [route.path for route in app.routes]

@app.get("/debug/connections")
async def debug_connections():
    db_ok = False
    redis_ok = False
    try:
        await db.fetchval("SELECT 1")
        db_ok = True
    except Exception as e:
        db_ok = str(e)
    try:
        from core.redis_manager import redis_manager
        await redis_manager._redis.ping()
        redis_ok = True
    except Exception as e:
        redis_ok = str(e)
    return {"neon": db_ok, "redis": redis_ok}

# Minimal test endpoint for blogs router
@app.get("/api/blogs/test")
async def blogs_test():
    return {"status": "ok", "message": "Blogs router is working"}
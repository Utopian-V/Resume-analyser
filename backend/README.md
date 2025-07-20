# Backend Team Guide

## 🔧 Team Purpose
The Backend Team is responsible for building scalable APIs and managing server-side business logic for the PrepNexus platform.

## 📁 Code Structure

```
backend/
├── endpoints/              # API route handlers by feature
│   ├── blogs.py           # Blog management endpoints
│   ├── jobs.py            # Job-related endpoints
│   ├── aptitude.py        # Aptitude test endpoints
│   ├── users.py           # User management endpoints
│   ├── dsa.py             # DSA practice endpoints
│   ├── resume.py          # Resume analysis endpoints
│   ├── interview.py       # Interview prep endpoints
│   └── genai.py           # AI/ML endpoints
├── core/                  # Core services and database
│   ├── database.py        # Database connection and models
│   └── __init__.py
├── modules/               # Business logic modules
│   ├── analytics/         # Analytics and tracking
│   ├── genai/            # AI/ML services
│   ├── monitoring/       # Health monitoring
│   └── seo/              # SEO services
├── jobs_data/            # Job database files
├── main.py               # FastAPI application entry point
├── models.py             # Data models and schemas
├── utils.py              # Utility functions
└── requirements.txt      # Python dependencies
```

## 🚀 Key Responsibilities

### 1. API Development
- Design and implement RESTful APIs
- Ensure API consistency and versioning
- Implement proper error handling
- Maintain API documentation

### 2. Database Management
- Design efficient database schemas
- Implement database migrations
- Optimize database queries
- Ensure data integrity and security

### 3. Business Logic
- Implement core business rules
- Handle complex data processing
- Manage external service integrations
- Ensure data validation

### 4. Performance & Security
- Implement caching strategies
- Optimize API response times
- Ensure security best practices
- Monitor system performance

## 🛠️ Development Guidelines

### API Endpoint Structure
```python
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional

router = APIRouter(prefix="/feature", tags=["feature"])

@router.get("/")
async def get_items(limit: int = 50, offset: int = 0):
    """Get paginated list of items"""
    try:
        # Business logic here
        items = await get_items_from_db(limit, offset)
        return {"items": items, "total": len(items)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/")
async def create_item(item_data: dict):
    """Create a new item"""
    try:
        # Validation and business logic
        item = await create_item_in_db(item_data)
        return {"message": "Item created", "item": item}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### Database Models
```python
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: str
    role: str = "user"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
```

### Error Handling
```python
from fastapi import HTTPException
from typing import Union

async def safe_database_operation(operation):
    """Wrapper for database operations with error handling"""
    try:
        return await operation()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Database operation failed: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Usage
async def get_user(user_id: str):
    return await safe_database_operation(
        lambda: db.fetch_user(user_id)
    )
```

## 📚 API Documentation

### Endpoint Categories

#### 1. Blog Management (`/blogs`)
- `GET /blogs/` - Get paginated blog posts
- `GET /blogs/{id}` - Get specific blog post
- `POST /blogs/` - Create new blog post
- `PUT /blogs/{id}` - Update blog post
- `DELETE /blogs/{id}` - Delete blog post

#### 2. Job Management (`/jobs`)
- `GET /jobs/corpus` - Get all job data
- `GET /jobs/` - Get filtered jobs
- `GET /jobs/companies` - Get company list

#### 3. User Management (`/users`)
- `POST /users/register` - Register new user
- `GET /users/{id}/profile` - Get user profile
- `GET /users/progress` - Get user progress
- `POST /users/progress/resume-score` - Update resume score

#### 4. Aptitude Tests (`/aptitude`)
- `GET /aptitude/test/{test_id}` - Get test questions
- `POST /aptitude/test/{test_id}/submit` - Submit test answers
- `POST /aptitude/questions/add` - Add new question
- `GET /aptitude/leaderboard/{test_id}` - Get leaderboard

#### 5. DSA Practice (`/dsa`)
- `GET /dsa/questions` - Get DSA questions
- `POST /dsa/questions/{id}/complete` - Mark question complete
- `GET /dsa/recommendations` - Get personalized recommendations

#### 6. Resume Analysis (`/resume`)
- `POST /resume/analyze` - Analyze uploaded resume

#### 7. Interview Prep (`/interview`)
- `POST /interview/chat` - Send interview message
- `GET /interview/conversations/{user_id}` - Get user conversations

### Response Format
```python
# Success Response
{
    "data": {...},
    "message": "Operation successful",
    "status": "success"
}

# Error Response
{
    "error": "Error message",
    "status": "error",
    "code": 400
}

# Paginated Response
{
    "items": [...],
    "total": 100,
    "page": 1,
    "limit": 20,
    "has_next": true
}
```

## 🔗 Database Management

### Connection Setup
```python
import asyncpg
from contextlib import asynccontextmanager

class Database:
    def __init__(self):
        self.pool = None
    
    async def initialize(self):
        """Initialize database connection pool"""
        self.pool = await asyncpg.create_pool(
            DATABASE_URL,
            min_size=5,
            max_size=20
        )
    
    async def close(self):
        """Close database connection pool"""
        if self.pool:
            await self.pool.close()
    
    @asynccontextmanager
    async def get_connection(self):
        """Get database connection from pool"""
        async with self.pool.acquire() as connection:
            yield connection

db = Database()
```

### Query Patterns
```python
# Simple query
async def get_user_by_id(user_id: str):
    async with db.get_connection() as conn:
        row = await conn.fetchrow(
            "SELECT * FROM users WHERE id = $1",
            user_id
        )
        return dict(row) if row else None

# Complex query with joins
async def get_user_with_progress(user_id: str):
    async with db.get_connection() as conn:
        rows = await conn.fetch("""
            SELECT 
                u.*,
                up.resume_score,
                up.aptitude_tests_completed,
                up.dsa_questions_solved
            FROM users u
            LEFT JOIN user_progress up ON u.id = up.user_id
            WHERE u.id = $1
        """, user_id)
        return [dict(row) for row in rows]
```

## 🔒 Security Guidelines

### Input Validation
```python
from pydantic import BaseModel, validator
from typing import Optional

class UserInput(BaseModel):
    name: str
    email: str
    age: Optional[int] = None
    
    @validator('email')
    def validate_email(cls, v):
        if '@' not in v:
            raise ValueError('Invalid email format')
        return v.lower()
    
    @validator('age')
    def validate_age(cls, v):
        if v is not None and (v < 0 or v > 120):
            raise ValueError('Age must be between 0 and 120')
        return v
```

### Authentication & Authorization
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def get_current_user(token: str = Depends(security)):
    """Validate JWT token and return user"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        return user_id
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

# Usage in endpoints
@router.get("/protected")
async def protected_endpoint(current_user: str = Depends(get_current_user)):
    return {"message": f"Hello {current_user}"}
```

## 📊 Performance Optimization

### Caching
```python
import redis
from functools import wraps

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def cache_result(expiry: int = 300):
    """Cache decorator for API responses"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            cache_key = f"{func.__name__}:{hash(str(args) + str(kwargs))}"
            
            # Try to get from cache
            cached = redis_client.get(cache_key)
            if cached:
                return json.loads(cached)
            
            # Execute function and cache result
            result = await func(*args, **kwargs)
            redis_client.setex(cache_key, expiry, json.dumps(result))
            return result
        return wrapper
    return decorator

# Usage
@cache_result(expiry=600)
async def get_jobs_corpus():
    return await load_all_jobs()
```

### Database Optimization
```python
# Use indexes for frequently queried columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_jobs_company ON jobs(company);
CREATE INDEX idx_blogs_created_at ON blogs(created_at);

# Use prepared statements
async def get_users_by_role(role: str):
    async with db.get_connection() as conn:
        return await conn.fetch(
            "SELECT * FROM users WHERE role = $1",
            role
        )
```

## 🧪 Testing Guidelines

### Unit Tests
```python
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_jobs():
    response = client.get("/jobs/")
    assert response.status_code == 200
    assert "jobs" in response.json()

def test_create_user():
    user_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123"
    }
    response = client.post("/users/register", json=user_data)
    assert response.status_code == 200
    assert response.json()["message"] == "User registered successfully"
```

### Integration Tests
```python
import asyncio
import asyncpg

async def test_database_connection():
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        result = await conn.fetchval("SELECT 1")
        assert result == 1
    finally:
        await conn.close()

# Run with pytest
# pytest test_api.py -v
```

## 📈 Monitoring & Logging

### Logging Setup
```python
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# Usage in endpoints
@router.get("/jobs")
async def get_jobs():
    logger.info("Fetching jobs from database")
    try:
        jobs = await load_jobs_data()
        logger.info(f"Successfully fetched {len(jobs)} jobs")
        return {"jobs": jobs}
    except Exception as e:
        logger.error(f"Failed to fetch jobs: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch jobs")
```

### Health Checks
```python
@router.get("/health")
async def health_check():
    """Comprehensive health check"""
    try:
        # Check database connection
        async with db.get_connection() as conn:
            await conn.fetchval("SELECT 1")
        
        # Check external services
        redis_ping = redis_client.ping()
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "database": "connected",
            "redis": "connected" if redis_ping else "disconnected"
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail="Service unhealthy")
```

## 🚀 Deployment

### Docker Configuration
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost/dbname

# Security
SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256

# External Services
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your-gemini-key

# Application
DEBUG=False
LOG_LEVEL=INFO
```

## 🤝 Collaboration

### Code Review Checklist
- [ ] API follows RESTful conventions
- [ ] Proper error handling implemented
- [ ] Input validation added
- [ ] Database queries optimized
- [ ] Security considerations addressed
- [ ] Tests written for new functionality
- [ ] Documentation updated
- [ ] Performance impact considered

### Git Workflow
1. Create feature branch from `main`
2. Implement feature with tests
3. Update API documentation
4. Create pull request
5. Address review feedback
6. Merge to `main`

---

**Backend Team Lead**: backend@prepnexus.com
**Last Updated**: July 2024 
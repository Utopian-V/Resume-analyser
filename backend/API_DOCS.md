# API Documentation

## 🚀 Base URL
```
Production: https://prepnexus-backend.onrender.com
Development: http://localhost:8000
```

## 📚 Authentication
Currently, the API uses simple user ID-based authentication. In production, implement JWT tokens.

## 🔗 Endpoints

### 1. Blog Management

#### Get All Blogs
```http
GET /blogs/
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "blogs": [
    {
      "id": "1",
      "title": "How to Ace Your Technical Interview",
      "content": "Technical interviews can be challenging...",
      "author": "PrepNexus Team",
      "created_at": "2024-07-20T10:00:00Z",
      "tags": ["interview", "technical", "career"]
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "has_next": true
}
```

#### Get Single Blog
```http
GET /blogs/{id}
```

**Response:**
```json
{
  "id": "1",
  "title": "How to Ace Your Technical Interview",
  "content": "Technical interviews can be challenging...",
  "author": "PrepNexus Team",
  "created_at": "2024-07-20T10:00:00Z",
  "tags": ["interview", "technical", "career"],
  "read_time": "5 min"
}
```

#### Create Blog
```http
POST /blogs/
```

**Request Body:**
```json
{
  "title": "New Blog Post",
  "content": "Blog content here...",
  "author": "Author Name",
  "tags": ["tag1", "tag2"]
}
```

### 2. Job Management

#### Get All Jobs
```http
GET /jobs/corpus
```

**Response:**
```json
{
  "jobs": [
    {
      "id": "job1",
      "title": "Software Engineer",
      "company": "Google",
      "location": "Mountain View, CA",
      "description": "We're looking for a talented engineer...",
      "requirements": ["Python", "JavaScript", "React"],
      "salary_range": "$120k - $180k"
    }
  ]
}
```

#### Get Filtered Jobs
```http
GET /jobs/
```

**Query Parameters:**
- `company` (optional): Filter by company name
- `limit` (optional): Number of jobs to return (default: 50)

#### Get Companies
```http
GET /jobs/companies
```

**Response:**
```json
{
  "companies": ["Google", "Microsoft", "Apple", "Amazon"]
}
```

### 3. User Management

#### Register User
```http
POST /users/register
```

**Request Body:**
```json
{
  "user_id": "user123",
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user_id": "user123"
}
```

#### Get User Profile
```http
GET /users/{user_id}/profile
```

**Response:**
```json
{
  "user_id": "user123",
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2024-07-20T10:00:00Z"
}
```

#### Get User Progress
```http
GET /users/progress?user_id={user_id}
```

**Response:**
```json
{
  "resume_score": 75,
  "aptitude_tests_completed": 3,
  "dsa_questions_solved": 25,
  "interviews_practiced": 2
}
```

#### Update Resume Score
```http
POST /users/progress/resume-score
```

**Request Body:**
```json
{
  "user_id": "user123",
  "score": 85
}
```

### 4. Aptitude Tests

#### Get Test
```http
GET /aptitude/test/{test_id}
```

**Response:**
```json
{
  "id": "test1",
  "title": "General Aptitude Test",
  "duration": 30,
  "questions": [
    {
      "id": "q1",
      "question": "If a train travels at 60 km/h, how long will it take to travel 180 km?",
      "options": [
        {"id": "a", "text": "2 hours"},
        {"id": "b", "text": "3 hours"},
        {"id": "c", "text": "4 hours"},
        {"id": "d", "text": "5 hours"}
      ],
      "correct_answer": "b"
    }
  ]
}
```

#### Submit Test
```http
POST /aptitude/test/{test_id}/submit
```

**Request Body:**
```json
{
  "answers": {
    "q1": "b",
    "q2": "a"
  },
  "user_id": "user123"
}
```

**Response:**
```json
{
  "score": 85.5,
  "correct_answers": 17,
  "total_questions": 20,
  "passed": true,
  "user_id": "user123",
  "test_id": "test1"
}
```

#### Add Question
```http
POST /aptitude/questions/add
```

**Request Body:**
```json
{
  "question": "What is 25% of 200?",
  "options": [
    {"id": "a", "text": "25"},
    {"id": "b", "text": "50"},
    {"id": "c", "text": "75"},
    {"id": "d", "text": "100"}
  ],
  "correct_answer": "b",
  "test_id": "test1"
}
```

#### Get Leaderboard
```http
GET /aptitude/leaderboard/{test_id}
```

**Response:**
```json
{
  "test_id": "test1",
  "leaderboard": [
    {"user_id": "user1", "score": 95, "rank": 1},
    {"user_id": "user2", "score": 88, "rank": 2},
    {"user_id": "user3", "score": 82, "rank": 3}
  ]
}
```

### 5. DSA Practice

#### Get Questions
```http
GET /dsa/questions
```

**Query Parameters:**
- `user_id` (optional): User ID for personalized questions
- `difficulty` (optional): Filter by difficulty (easy, medium, hard)
- `category` (optional): Filter by category (arrays, strings, etc.)

**Response:**
```json
{
  "questions": [
    {
      "id": "q1",
      "category": "Arrays",
      "question": "Find the maximum subarray sum",
      "difficulty": "medium",
      "solution": "Use Kadane's algorithm...",
      "tags": ["dynamic-programming", "arrays"]
    }
  ],
  "total": 150,
  "filters": {
    "difficulty": "medium",
    "category": "arrays"
  }
}
```

#### Complete Question
```http
POST /dsa/questions/{question_id}/complete
```

**Request Body:**
```json
{
  "user_id": "user123"
}
```

#### Get Recommendations
```http
GET /dsa/recommendations?user_id={user_id}
```

**Response:**
```json
{
  "recommendations": [
    {
      "id": "q1",
      "category": "Dynamic Programming",
      "question": "Longest Common Subsequence",
      "difficulty": "hard",
      "reason": "Based on your performance in array problems"
    }
  ],
  "user_id": "user123"
}
```

### 6. Resume Analysis

#### Analyze Resume
```http
POST /resume/analyze
```

**Request:**
- Content-Type: `multipart/form-data`
- Body: File upload (PDF, DOCX, TXT)

**Response:**
```json
{
  "skills": [
    {"name": "JavaScript", "level": "Advanced", "confidence": 0.9},
    {"name": "React", "level": "Intermediate", "confidence": 0.8},
    {"name": "Python", "level": "Intermediate", "confidence": 0.7}
  ],
  "experience": "3-5 years",
  "education": "Bachelor's in Computer Science",
  "recommendations": [
    "Focus on system design skills",
    "Practice more DSA problems",
    "Learn cloud technologies"
  ],
  "overall_score": 75,
  "strengths": [
    "Strong frontend development skills",
    "Good understanding of JavaScript ecosystem"
  ],
  "areas_for_improvement": [
    "System design and architecture",
    "Advanced algorithms and data structures"
  ]
}
```

### 7. Interview Preparation

#### Send Message
```http
POST /interview/chat
```

**Request Body:**
```json
{
  "user_id": "user123",
  "role": "technical",
  "message": "Tell me about your experience with React",
  "conversation_id": "conv123"
}
```

**Response:**
```json
{
  "conversation_id": "conv123",
  "response": "That's an interesting approach. Can you explain the time complexity of your solution?",
  "messages": [
    {
      "sender": "user",
      "message": "Tell me about your experience with React",
      "timestamp": "2024-07-20T10:00:00Z"
    },
    {
      "sender": "ai",
      "message": "That's an interesting approach. Can you explain the time complexity of your solution?",
      "timestamp": "2024-07-20T10:00:01Z"
    }
  ]
}
```

#### Get Conversations
```http
GET /interview/conversations/{user_id}
```

**Response:**
```json
{
  "conversations": {
    "conv123": {
      "messages": [...],
      "user_id": "user123",
      "role": "technical"
    }
  },
  "total": 1
}
```

## 🔧 Health & Monitoring

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-07-20T10:00:00Z",
  "database": "connected",
  "redis": "connected"
}
```

### API Status
```http
GET /
```

**Response:**
```json
{
  "message": "PrepNexus API",
  "version": "1.0.0",
  "status": "operational",
  "modules": [
    "blogs",
    "jobs",
    "aptitude",
    "users",
    "dsa",
    "resume",
    "interview"
  ]
}
```

## 🚨 Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid input data",
  "status": "error",
  "code": 400
}
```

### 404 Not Found
```json
{
  "error": "Resource not found",
  "status": "error",
  "code": 404
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "status": "error",
  "code": 500
}
```

## 📊 Rate Limiting
- Default: 100 requests per minute per IP
- Authenticated users: 1000 requests per minute
- Admin endpoints: 50 requests per minute

## 🔐 Security
- CORS enabled for all origins (configure for production)
- Input validation on all endpoints
- File upload size limit: 10MB
- Supported file types: PDF, DOCX, TXT

## 📈 Performance
- Response time target: < 200ms
- Database connection pooling
- Caching for frequently accessed data
- Async operations for I/O intensive tasks

---

**API Version**: 1.0.0
**Last Updated**: July 2024 
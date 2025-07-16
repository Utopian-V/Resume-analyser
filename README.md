# AI Resume Review & Career Platform

A comprehensive AI-powered platform that helps users analyze their resumes, prepare for technical interviews, and find job opportunities. The platform provides personalized feedback, DSA preparation, and job recommendations based on user profiles.

## 🚀 Complete User Story Implementation

### User Journey
1. **User Registration/Login**: Users create accounts or log in to track their progress
2. **Resume Upload & Analysis**: Upload PDF resumes for comprehensive AI analysis
3. **Personalized Feedback**: Get detailed feedback on resume strengths, weaknesses, and improvements
4. **Project Analysis**: Detailed analysis of each project/internship with improvement suggestions
5. **DSA Preparation**: Personalized DSA question recommendations with progress tracking
6. **Job Opportunities**: Browse and apply for relevant job positions
7. **Progress Tracking**: Monitor resume scores, DSA progress, and job applications

## ✨ Features

### 🔐 User Management
- User registration and login system
- Personal dashboard with progress tracking
- User profile management with skills and target roles

### 📄 Resume Analysis
- **AI-Powered Analysis**: Comprehensive resume review using Groq AI
- **ATS Compliance**: Check resume compatibility with Applicant Tracking Systems
- **Skill Matching**: Identify matched and missing skills
- **Targeted Roles**: Get role recommendations based on resume content
- **Project Analysis**: Detailed analysis of each project with impact scores
- **Improvement Suggestions**: Actionable feedback with specific recommendations
- **Visual Feedback**: Graphical representation of scores and metrics

### 💻 DSA Preparation
- **Personalized Recommendations**: AI-driven question suggestions based on skill gaps
- **Progress Tracking**: Monitor completed questions and overall progress
- **Difficulty Levels**: Easy, Medium, and Hard questions with filtering
- **Category Filtering**: Filter by topics (Arrays, Stack, Linked List, etc.)
- **LeetCode Integration**: Direct links to practice questions on LeetCode
- **Completion Tracking**: Mark questions as completed and track progress

### 💼 Job Opportunities
- **Job Listings**: Browse available job positions
- **Personalized Recommendations**: Job suggestions based on user skills and target roles
- **Application Tracking**: Track applied jobs and application status
- **Job Details**: Complete job information including requirements, salary, and deadlines
- **Easy Application**: One-click job application system

### 📊 Dashboard & Analytics
- **Progress Overview**: Resume scores, DSA progress, and job applications
- **Recent Activity**: Track last resume analysis and activity
- **Visual Metrics**: Beautiful charts and progress indicators
- **Download Reports**: Export feedback as PDF reports

## 🛠️ Technical Stack

### Backend
- **Framework**: FastAPI (Python)
- **AI Integration**: Groq API with Llama3-8b model
- **PDF Processing**: pdfplumber for text extraction
- **Authentication**: JWT-based user management
- **Data Storage**: In-memory storage (can be extended to database)

### Frontend
- **Framework**: React with hooks
- **Styling**: Styled-components with beautiful gradients
- **Animations**: Framer Motion for smooth transitions
- **PDF Viewer**: react-pdf for interactive PDF display
- **Icons**: React Icons (Feather icons)
- **Charts**: Custom progress bars and metrics

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- Groq API key

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Environment Variables
Create a `.env` file in the backend directory:
```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama3-8b-8192
DEBUG_FEEDBACK=1
```

### Frontend Setup
```bash
cd frontend
npm install
```

### Environment Variables
Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:8000
```

### Running the Application

#### Backend
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## 📱 Usage Guide

### 1. User Registration/Login
- Start by creating an account or logging in
- Add your skills and target roles for personalized recommendations

### 2. Resume Analysis
- Upload your PDF resume
- Get comprehensive AI analysis with scores and feedback
- View detailed project analysis with improvement suggestions
- Download feedback as PDF report

### 3. DSA Preparation
- Browse recommended DSA questions based on your profile
- Filter by difficulty and category
- Mark questions as completed to track progress
- Practice directly on LeetCode with provided links

### 4. Job Opportunities
- Browse available job listings
- View personalized job recommendations
- Apply for positions with one click
- Track your applications

### 5. Dashboard
- Monitor your overall progress
- View resume scores and recent activity
- Track DSA completion and job applications

## 🔧 API Endpoints

### User Management
- `POST /register/` - User registration
- `POST /login/` - User login
- `GET /user/progress/` - Get user progress
- `POST /user/progress/resume-score/` - Update resume score

### Resume Analysis
- `POST /analyze-resume/` - Analyze uploaded resume

### DSA Questions
- `GET /dsa/questions/` - Get DSA questions with filters
- `POST /dsa/questions/{id}/complete/` - Mark question as completed
- `GET /dsa/recommendations/` - Get personalized recommendations

### Job Listings
- `GET /jobs/` - Get job listings with recommendations
- `POST /jobs/{id}/apply/` - Apply for a job

## 🎨 UI/UX Features

- **Modern Design**: Beautiful gradients and smooth animations
- **Responsive Layout**: Works on desktop and mobile devices
- **Interactive Elements**: Hover effects and smooth transitions
- **Progress Visualization**: Charts and progress bars
- **Tabbed Interface**: Easy navigation between features
- **PDF Highlighting**: Interactive PDF viewer with keyword highlighting

## 🔮 Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- Email notifications for job applications
- Advanced DSA question bank integration
- Resume template generation
- Interview preparation modules
- Company-specific job recommendations
- Advanced analytics and insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.

---

**Built with ❤️ using FastAPI, React, and AI-powered insights** 
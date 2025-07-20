# PrepNexus - AI-Powered Career Preparation Platform

## 🚀 Project Overview

PrepNexus is a comprehensive career preparation platform that combines AI-powered resume analysis, job matching, aptitude testing, DSA practice, and interview preparation into a unified experience.

## 🏗️ Architecture Overview

```
resume-review-ai/
├── backend/                 # FastAPI Backend (Python)
│   ├── endpoints/          # API Routes by Feature
│   ├── core/              # Database & Core Services
│   ├── modules/           # Business Logic Modules
│   └── jobs_data/         # Job Database
├── frontend/               # React Frontend (JavaScript)
│   ├── src/
│   │   ├── components/    # React Components
│   │   │   ├── features/  # Feature-specific Components
│   │   │   └── shared/    # Shared UI Components
│   │   ├── config/        # Configuration Files
│   │   ├── hooks/         # Custom React Hooks
│   │   └── utils/         # Utility Functions
│   └── public/            # Static Assets
└── scripts/               # Build & Deployment Scripts
```

## 👥 Team Segmentation

### 🎯 **Frontend Team** (`frontend/`)
**Purpose**: Build responsive, user-friendly interfaces and manage client-side state
**Responsibilities**:
- React component development
- State management and data flow
- UI/UX implementation
- Performance optimization
- Cross-browser compatibility

**Key Files**:
- `src/App.js` - Main application entry point
- `src/components/features/` - Feature-specific components
- `src/components/shared/` - Reusable UI components
- `src/config/routes.js` - Application routing
- `src/api.js` - API integration layer

### 🔧 **Backend Team** (`backend/`)
**Purpose**: Build scalable APIs and manage server-side business logic
**Responsibilities**:
- RESTful API development
- Database design and management
- Business logic implementation
- Authentication and authorization
- Performance and security

**Key Files**:
- `main.py` - FastAPI application entry point
- `endpoints/` - API route handlers by feature
- `core/database.py` - Database connection and models
- `models.py` - Data models and schemas

### 📊 **Data Team** (`backend/jobs_data/`, `frontend/src/data/`)
**Purpose**: Manage and curate platform data
**Responsibilities**:
- Job data curation and updates
- DSA question bank management
- Aptitude test content
- Interview question database
- Data quality assurance

### 🚀 **DevOps Team** (`scripts/`, `Dockerfile`, `.github/`)
**Purpose**: Ensure smooth deployment and infrastructure management
**Responsibilities**:
- CI/CD pipeline management
- Docker containerization
- Environment configuration
- Monitoring and logging
- Performance optimization

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Animations
- **React Icons** - Icon library

### Backend
- **FastAPI** - Web framework
- **PostgreSQL** - Primary database
- **asyncpg** - Async database driver
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### Infrastructure
- **Docker** - Containerization
- **Netlify** - Frontend hosting
- **Railway/Render** - Backend hosting
- **GitHub Actions** - CI/CD

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL 13+

### Frontend Development
```bash
cd frontend
npm install
npm start
```

### Backend Development
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## 📚 Documentation

- [Frontend Team Guide](./frontend/README.md)
- [Backend Team Guide](./backend/README.md)
- [API Documentation](./backend/API_DOCS.md)
- [Component Library](./frontend/COMPONENT_GUIDE.md)

## 🤝 Contributing

1. Follow the team segmentation guidelines
2. Use conventional commit messages
3. Write tests for new features
4. Update documentation for API changes
5. Follow the established code style

## 📈 Project Status

- ✅ Core platform features implemented
- ✅ Modular architecture established
- ✅ Team segmentation completed
- 🔄 Performance optimization in progress
- 📋 Additional features planned

---

**Last Updated**: July 2024
**Version**: 1.0.0 
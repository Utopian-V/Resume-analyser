# PrepNexus Codebase Navigation Guide

## 🗺️ Overview
This guide helps developers navigate the PrepNexus codebase efficiently, understand the architecture, and find the right files for their tasks.

## 📁 Project Structure

```
resume-review-ai/
├── 📁 backend/                    # FastAPI Backend (Python)
│   ├── 📁 endpoints/             # API Routes by Feature
│   ├── 📁 core/                  # Database & Core Services
│   ├── 📁 modules/               # Business Logic Modules
│   ├── 📁 jobs_data/             # Job Database Files
│   ├── main.py                   # Application Entry Point
│   ├── models.py                 # Data Models
│   └── requirements.txt          # Python Dependencies
├── 📁 frontend/                   # React Frontend (JavaScript)
│   ├── 📁 src/
│   │   ├── 📁 components/        # React Components
│   │   │   ├── 📁 features/      # Feature-specific Components
│   │   │   └── 📁 shared/        # Shared UI Components
│   │   ├── 📁 config/            # Configuration Files
│   │   ├── 📁 hooks/             # Custom React Hooks
│   │   ├── 📁 utils/             # Utility Functions
│   │   ├── 📁 data/              # Static Data Files
│   │   ├── api.js                # API Integration Layer
│   │   └── App.js                # Main Application Component
│   └── package.json              # Frontend Dependencies
└── 📁 scripts/                    # Build & Deployment Scripts
```

## 🚀 Quick Start Navigation

### For New Developers
1. **Start with**: `README.md` - Project overview and team segmentation
2. **Frontend**: `frontend/README.md` - Frontend team guide
3. **Backend**: `backend/README.md` - Backend team guide
4. **API Docs**: `backend/API_DOCS.md` - Complete API documentation
5. **Components**: `frontend/COMPONENT_GUIDE.md` - Component library

### For Feature Development
1. **Identify feature**: Check `frontend/src/components/features/` for existing features
2. **API endpoints**: Check `backend/endpoints/` for corresponding APIs
3. **Data models**: Check `backend/models.py` for data structures
4. **Routing**: Check `frontend/src/config/routes.js` for frontend routes

## 🔍 File Finding Guide

### I Need To...

#### Add a New API Endpoint
**Start Here**: `backend/endpoints/`
- **Blogs**: `backend/endpoints/blogs.py`
- **Jobs**: `backend/endpoints/jobs.py`
- **Users**: `backend/endpoints/users.py`
- **Aptitude**: `backend/endpoints/aptitude.py`
- **DSA**: `backend/endpoints/dsa.py`
- **Resume**: `backend/endpoints/resume.py`
- **Interview**: `backend/endpoints/interview.py`

**Then**: Add to `backend/main.py` router registration

#### Create a New Frontend Component
**Start Here**: `frontend/src/components/features/`
- **Feature-specific**: `features/[feature-name]/`
- **Shared UI**: `shared/ui/`
- **Layout**: `shared/layout/`

**Then**: Update `frontend/src/config/routes.js` if needed

#### Modify Database Schema
**Start Here**: `backend/models.py`
**Then**: `backend/core/database.py` for connection logic

#### Update Job Data
**Start Here**: `backend/jobs_data/`
**Files**: JSON files for each company

#### Add New DSA Questions
**Start Here**: `frontend/src/data/dsa-bank/`
**Files**: CSV files by category

#### Modify Styling
**Start Here**: `frontend/src/styles/GlobalStyles.js`
**Then**: Individual component styled-components

#### Add New Routes
**Frontend**: `frontend/src/config/routes.js`
**Backend**: Add to appropriate endpoint file

## 🎯 Feature-Specific Navigation

### Blog System
```
Frontend: frontend/src/components/features/blog/Blog.js
Backend: backend/endpoints/blogs.py
Data: backend/modules/genai/blog_generator.py
```

**Key Files**:
- Blog listing: `Blog.js` (lines 1-150)
- Individual post: `Blog.js` (lines 151-307)
- API endpoints: `blogs.py` (lines 1-78)
- Blog generation: `blog_generator.py`

### Job Management
```
Frontend: frontend/src/components/features/jobs/JobListings.js
Backend: backend/endpoints/jobs.py
Data: backend/jobs_data/*.json
```

**Key Files**:
- Job display: `JobListings.js`
- Job API: `jobs.py`
- Company data: `jobs_data/jobs_google.com.json`

### User Dashboard
```
Frontend: frontend/src/components/features/dashboard/UserDashboard.js
Backend: backend/endpoints/users.py
```

**Key Files**:
- Dashboard UI: `UserDashboard.js`
- User API: `users.py`
- Progress tracking: `users.py` (lines 40-65)

### Aptitude Tests
```
Frontend: frontend/src/components/features/aptitude/
Backend: backend/endpoints/aptitude.py
Data: frontend/src/data/aptitude_tests.json
```

**Key Files**:
- Test interface: `AptitudeTest.js`
- Question manager: `AptitudeQuestionManager.js`
- Test API: `aptitude.py`

### DSA Practice
```
Frontend: frontend/src/components/features/dsa/
Backend: backend/endpoints/dsa.py
Data: frontend/src/data/dsa-bank/
```

**Key Files**:
- DSA interface: `EnhancedDSABank.js`
- DSA preparation: `DSAPreparation.js`
- DSA API: `dsa.py`

### Resume Analysis
```
Frontend: frontend/src/components/features/resume/
Backend: backend/endpoints/resume.py
```

**Key Files**:
- File upload: `FileUpload.js`
- Skill assessment: `SkillAssessment.js`
- Resume API: `resume.py`

### Interview Prep
```
Frontend: frontend/src/components/features/interview/InterviewPrep.js
Backend: backend/endpoints/interview.py
```

**Key Files**:
- Interview interface: `InterviewPrep.js`
- Chat API: `interview.py`

### Admin Portal
```
Frontend: frontend/src/components/features/admin/
Backend: backend/endpoints/ (various files)
```

**Key Files**:
- Admin portal: `AdminPortal.js`
- Blog management: `BlogManagement.js`
- User management: `UserManagement.js`

## 🔧 Development Workflows

### Adding a New Feature

#### 1. Backend First Approach
```bash
# 1. Create API endpoint
backend/endpoints/new_feature.py

# 2. Add to main.py
backend/main.py (add router)

# 3. Create frontend component
frontend/src/components/features/new-feature/NewFeature.js

# 4. Add to routes
frontend/src/config/routes.js

# 5. Update API layer
frontend/src/api.js
```

#### 2. Frontend First Approach
```bash
# 1. Create component
frontend/src/components/features/new-feature/NewFeature.js

# 2. Add to routes
frontend/src/config/routes.js

# 3. Create API endpoint
backend/endpoints/new_feature.py

# 4. Update API layer
frontend/src/api.js
```

### Debugging Common Issues

#### Frontend Build Errors
```bash
# Check import paths
grep -r "from.*\.js" frontend/src/

# Check for missing files
find frontend/src -name "*.js" -exec basename {} \;

# Verify routes
cat frontend/src/config/routes.js
```

#### Backend API Errors
```bash
# Check endpoint registration
grep -r "include_router" backend/main.py

# Check import errors
python -c "import endpoints.blogs"

# Test API endpoints
curl http://localhost:8000/health
```

#### Database Issues
```bash
# Check database connection
python backend/test_db.py

# Check models
cat backend/models.py

# Check database URL
echo $DATABASE_URL
```

## 📊 Data Flow Understanding

### Frontend to Backend Flow
```
1. User Action → React Component
2. Component → Custom Hook (useAPI)
3. Hook → api.js (fetch call)
4. api.js → Backend API Endpoint
5. Endpoint → Database Query
6. Database → Endpoint Response
7. Response → Frontend Component
8. Component → UI Update
```

### Key Integration Points
- **API Layer**: `frontend/src/api.js`
- **Custom Hooks**: `frontend/src/hooks/`
- **Backend Endpoints**: `backend/endpoints/`
- **Database**: `backend/core/database.py`

## 🎨 Styling and UI

### Global Styles
**Location**: `frontend/src/styles/GlobalStyles.js`
**Purpose**: Global CSS reset and theme variables

### Component Styling
**Pattern**: Styled-components in each component file
**Example**:
```javascript
const Container = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
`;
```

### Theme System
**Location**: `frontend/src/styles/GlobalStyles.js`
**Usage**: Access via `theme` prop in styled-components

## 🔍 Search and Find Commands

### Find Component by Name
```bash
find frontend/src -name "*ComponentName*"
```

### Find API Endpoint
```bash
grep -r "def endpoint_name" backend/endpoints/
```

### Find File Imports
```bash
grep -r "import.*ComponentName" frontend/src/
```

### Find Database Queries
```bash
grep -r "SELECT\|INSERT\|UPDATE\|DELETE" backend/
```

### Find Styled Components
```bash
grep -r "styled\." frontend/src/
```

## 🚨 Common Gotchas

### Import Path Issues
- **Problem**: Relative imports break after file moves
- **Solution**: Use absolute imports or update paths systematically

### API Endpoint Registration
- **Problem**: New endpoints not accessible
- **Solution**: Ensure added to `main.py` router registration

### Database Connection
- **Problem**: Connection pool exhausted
- **Solution**: Check `backend/core/database.py` pool settings

### Frontend Build Errors
- **Problem**: Missing dependencies or broken imports
- **Solution**: Check `package.json` and import statements

### Environment Variables
- **Problem**: API calls fail in production
- **Solution**: Check `REACT_APP_API_URL` in frontend environment

## 📚 Learning Paths

### For Frontend Developers
1. **Start**: `frontend/README.md`
2. **Components**: `frontend/COMPONENT_GUIDE.md`
3. **API Integration**: `frontend/src/api.js`
4. **Routing**: `frontend/src/config/routes.js`
5. **Styling**: `frontend/src/styles/GlobalStyles.js`

### For Backend Developers
1. **Start**: `backend/README.md`
2. **API Docs**: `backend/API_DOCS.md`
3. **Endpoints**: `backend/endpoints/`
4. **Database**: `backend/core/database.py`
5. **Models**: `backend/models.py`

### For Full-Stack Developers
1. **Start**: `README.md`
2. **Architecture**: Project structure overview
3. **API Integration**: `frontend/src/api.js` + `backend/endpoints/`
4. **Data Flow**: Database → Backend → Frontend
5. **Deployment**: `scripts/` directory

## 🔄 Maintenance Tasks

### Regular Checks
- **Dependencies**: Update `package.json` and `requirements.txt`
- **Security**: Check for vulnerable packages
- **Performance**: Monitor API response times
- **Logs**: Check application logs for errors

### Code Quality
- **Linting**: Run ESLint and flake8
- **Testing**: Execute test suites
- **Documentation**: Update guides when adding features
- **Reviews**: Code review for all changes

## 📞 Getting Help

### Team Contacts
- **Frontend Team**: frontend@prepnexus.com
- **Backend Team**: backend@prepnexus.com
- **DevOps Team**: devops@prepnexus.com

### Documentation
- **API Docs**: `backend/API_DOCS.md`
- **Component Guide**: `frontend/COMPONENT_GUIDE.md`
- **Team Guides**: `frontend/README.md`, `backend/README.md`

### Debugging Resources
- **Browser DevTools**: For frontend issues
- **FastAPI Docs**: `http://localhost:8000/docs`
- **Logs**: Application and error logs
- **Git History**: Previous implementations

---

**Navigation Guide Version**: 1.0.0
**Last Updated**: July 2024
**Maintained By**: PrepNexus Development Team 
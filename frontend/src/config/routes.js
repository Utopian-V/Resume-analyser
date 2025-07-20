import UserDashboard from '../components/features/dashboard/UserDashboard.js';
import JobListings from '../components/features/jobs/JobListings.js';
import ResumeAnalysis from '../components/features/resume/FileUpload.js';
import AptitudeTest from '../components/features/aptitude/AptitudeTest.js';
import EnhancedDSABank from '../components/features/dsa/EnhancedDSABank.js';
import InterviewPrep from '../components/features/interview/InterviewPrep.js';
import Blog, { BlogPost } from '../components/features/blog/Blog.js';
import LandingPage from '../components/shared/layout/LandingPage.js';
import AdminPortal from '../components/features/admin/AdminPortal.js';

// Placeholder components for new public routes
const DataInterpretation = () => <div style={{padding:'4rem',color:'#6366f1',textAlign:'center'}}>Data Interpretation Practice Coming Soon!</div>;
const ResumeFeedback = ResumeAnalysis;
const MockInterview = InterviewPrep;
const DSAPractice = EnhancedDSABank;


export const dashboardRoutes = [
  {
    path: '/app',
    component: UserDashboard,
    exact: true
  },
  {
    path: '/app/jobs',
    component: JobListings
  },
  {
    path: '/app/resume',
    component: ResumeAnalysis
  },
  {
    path: '/app/aptitude',
    component: AptitudeTest
  },
  {
    path: '/app/dsa',
    component: EnhancedDSABank
  },
  {
    path: '/app/interview',
    component: InterviewPrep
  }
];

export const adminRoutes = [
  {
    path: '/admin',
    component: AdminPortal,
    exact: true
  },
  {
    path: '/admin/*',
    component: AdminPortal
  }
];

export const publicRoutes = [
  {
    path: '/',
    component: LandingPage,
    exact: true
  },
  {
    path: '/blog',
    component: Blog
  },
  {
    path: '/blog/:id',
    component: BlogPost
  },
  {
    path: '/aptitude-test',
    component: AptitudeTest
  },
  {
    path: '/data-interpretation',
    component: DataInterpretation
  },
  {
    path: '/dsa-practice',
    component: DSAPractice
  },
  {
    path: '/resume-feedback',
    component: ResumeFeedback
  },
  {
    path: '/mock-interview',
    component: MockInterview
  }
];
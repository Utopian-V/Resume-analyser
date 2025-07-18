import UserDashboard from '../components/UserDashboard';
import JobListings from '../components/JobListings';
import ResumeAnalysis from '../components/FileUpload';
import AptitudeTest from '../components/AptitudeTest';
import EnhancedDSABank from '../components/EnhancedDSABank';
import InterviewPrep from '../components/InterviewPrep';
import Blog from '../components/Blog';
import LandingPage from '../components/landing/LandingPage';
import AdminPortal from '../components/AdminPortal';

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
    path: '/blog/:slug',
    component: Blog
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
  },
  {
    path: '/admin',
    component: AdminPortal
  }
];
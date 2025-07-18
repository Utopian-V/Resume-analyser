import UserDashboard from '../components/UserDashboard';
import JobListings from '../components/JobListings';
import ResumeAnalysis from '../components/FileUpload'; // If you renamed FileUpload.js to ResumeAnalysis.js, update this import!
import AptitudeTest from '../components/AptitudeTest';
import EnhancedDSABank from '../components/EnhancedDSABank';
import InterviewPrep from '../components/InterviewPrep';
import Blog from '../components/Blog';
import LandingPage from '../components/landing/LandingPage';

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
  }
];
import UserDashboard from '../components/UserDashboard';
import JobListings from '../components/JobListings';
import FileUpload from '../components/FileUpload';
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
    component: FileUpload
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
  },
  {
    path: '/app/blog',
    component: Blog
  }
];

export const publicRoutes = [
  {
    path: '/',
    component: LandingPage,
    exact: true
  }
]; 
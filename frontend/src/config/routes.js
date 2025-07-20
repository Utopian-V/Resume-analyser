/**
 * Application Routing Configuration
 * 
 * This module defines all application routes organized by access level:
 * - Dashboard routes: Main application features requiring user authentication
 * - Admin routes: Administrative functions and content management
 * - Public routes: Marketing pages and public content accessible to all users
 * 
 * Route Structure:
 * - Dashboard routes: /app/* - Main application features
 * - Admin routes: /admin/* - Administrative functions
 * - Public routes: /* - Marketing and public content
 */

// Dashboard Components - Main application features
import UserDashboard from '../components/features/dashboard/UserDashboard.js';
import JobListings from '../components/features/jobs/JobListings.js';
import ResumeAnalysis from '../components/features/resume/FileUpload.js';
import AptitudeTest from '../components/features/aptitude/AptitudeTest.js';
import EnhancedDSABank from '../components/features/dsa/EnhancedDSABank.js';
import InterviewPrep from '../components/features/interview/InterviewPrep.js';

// Content Components - Blog and marketing
import Blog, { BlogPost } from '../components/features/blog/Blog.js';
import LandingPage from '../components/shared/layout/LandingPage.js';

// Admin Components - Administrative functions
import AdminPortal from '../components/features/admin/AdminPortal.js';

// Placeholder Components for Future Features
// These provide temporary UI while features are under development
const DataInterpretation = () => (
  <div style={{padding:'4rem',color:'#6366f1',textAlign:'center'}}>
    📊 Data Interpretation Practice Coming Soon!
  </div>
);

// Component Aliases for Route Reuse
// Some routes can reuse existing components with different contexts
const ResumeFeedback = ResumeAnalysis;  // Same component, different route context
const MockInterview = InterviewPrep;    // Same component, different route context
const DSAPractice = EnhancedDSABank;    // Same component, different route context

/**
 * Dashboard Routes - Main Application Features
 * 
 * These routes require user authentication and provide the core
 * functionality of the PrepNexus platform. All routes are prefixed
 * with /app and wrapped in DashboardLayout for consistent UI.
 */
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

/**
 * Admin Routes - Administrative Functions
 * 
 * These routes provide administrative functionality including:
 * - Content management (blogs, questions)
 * - User management
 * - System settings
 * - Analytics and reporting
 * 
 * All admin routes are prefixed with /admin and should include
 * proper authentication and authorization checks.
 */
export const adminRoutes = [
  {
    path: '/admin',
    component: AdminPortal,
    exact: true
  },
  {
    path: '/admin/*',
    component: AdminPortal  // Catch-all for admin sub-routes
  }
];

/**
 * Public Routes - Marketing and Public Content
 * 
 * These routes are accessible to all users without authentication.
 * They serve as entry points to the platform and provide:
 * - Landing page and marketing content
 * - Blog articles and educational content
 * - Feature previews and demos
 * - SEO-optimized public pages
 */
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
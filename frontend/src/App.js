/**
 * Main Application Component
 * 
 * This is the root component of the PrepNexus application that handles:
 * - Application routing and navigation
 * - Global state management
 * - Layout structure and component composition
 * - Mobile responsiveness with menu handling
 * 
 * The app uses React Router for navigation and styled-components for styling.
 * All routes are organized into three categories: public, admin, and dashboard.
 */
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';

// Global styles for consistent theming across the application
import { GlobalStyle } from './styles/GlobalStyles.js';

// Layout components for consistent UI structure
import { Navbar, MobileMenu, DashboardLayout } from './components/shared/layout/index.js';

// Interactive FAQ chat component for user support
import FAQChat from './components/shared/ui/FAQChat.js';

// Custom hook for FAQ functionality
import { useFAQ } from './hooks/useFAQ.js';

// Route configurations organized by access level
import { dashboardRoutes, publicRoutes, adminRoutes } from './config/routes.js';

/**
 * Main application container with dark theme background
 * Uses min-height: 100vh to ensure full viewport coverage
 */
const AppContainer = styled.div`
  min-height: 100vh;
  background: #0f172a; /* Dark blue background for professional look */
`;

function App() {
  // Global state management for user session and UI
  const [userId, setUserId] = useState('user123'); // TODO: Replace with actual auth system
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/app');
  
  // FAQ functionality hook for user support
  const faq = useFAQ();

  // Mobile menu handlers for responsive navigation
  const handleMobileMenuOpen = () => setIsMobileMenuOpen(true);
  const handleMobileMenuClose = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Global styles applied to entire application */}
      <GlobalStyle />
      
      {/* Main application container */}
      <AppContainer>
        {/* Navigation bar - always visible */}
        <Navbar onMobileMenuOpen={handleMobileMenuOpen} />
        
        {/* Mobile menu overlay - only visible on mobile */}
        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          onClose={handleMobileMenuClose} 
        />

        {/* Application routing system */}
        <Routes>
          {/* Public Routes - Accessible to all users */}
          {/* These routes don't require authentication and are for marketing/content */}
          {publicRoutes.map(({ path, component: Component, exact }) => (
            <Route 
              key={path}
              path={path} 
              element={<Component />} 
              exact={exact}
            />
          ))}
          
          {/* Admin Routes - Restricted to admin users */}
          {/* Admin portal and content management features */}
          {adminRoutes.map(({ path, component: Component, exact }) => (
            <Route 
              key={path}
              path={path} 
              element={<Component />} 
              exact={exact}
            />
          ))}
          
          {/* Dashboard Routes - Main application features */}
          {/* These routes are wrapped in DashboardLayout for consistent UI */}
          {dashboardRoutes.map(({ path, component: Component }) => (
            <Route 
              key={path}
              path={path} 
              element={
                <DashboardLayout 
                  currentPath={currentPath} 
                  setCurrentPath={setCurrentPath}
                >
                  {/* Pass user context to dashboard components */}
                  <Component userId={userId} setUserId={setUserId} />
                </DashboardLayout>
              } 
            />
          ))}
          
          {/* Fallback route - redirect to main dashboard */}
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>

        {/* Global FAQ chat component for user support */}
        {/* Positioned as overlay and accessible from anywhere in the app */}
        <FAQChat 
          isOpen={faq.isFAQModalOpen}
          onOpen={faq.handleFAQOpen}
          onClose={faq.handleFAQClose}
          faqQuestion={faq.faqQuestion}
          setFaqQuestion={faq.setFaqQuestion}
          faqMessages={faq.faqMessages}
          loading={faq.loading}
          onSubmit={faq.handleFAQQuestionSubmit}
        />
      </AppContainer>
    </>
  );
}

export default App;
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';

// Styles
import { GlobalStyle } from './styles/GlobalStyles.js';

// Layout Components
import { Navbar, MobileMenu, DashboardLayout } from './components/shared/layout/index.js';

// Common Components
import FAQChat from './components/shared/ui/FAQChat.js';

// Hooks
import { useFAQ } from './hooks/useFAQ.js';

// Routes
import { dashboardRoutes, publicRoutes, adminRoutes } from './config/routes.js';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #0f172a;
`;

function App() {
  const [userId, setUserId] = useState('user123');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/app');
  
  const faq = useFAQ();

  const handleMobileMenuOpen = () => setIsMobileMenuOpen(true);
  const handleMobileMenuClose = () => setIsMobileMenuOpen(false);

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Navbar onMobileMenuOpen={handleMobileMenuOpen} />
        
        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          onClose={handleMobileMenuClose} 
        />

        <Routes>
          {/* Public Routes */}
          {publicRoutes.map(({ path, component: Component, exact }) => (
            <Route 
              key={path}
              path={path} 
              element={<Component />} 
              exact={exact}
            />
          ))}
          
          {/* Admin Routes */}
          {adminRoutes.map(({ path, component: Component, exact }) => (
            <Route 
              key={path}
              path={path} 
              element={<Component />} 
              exact={exact}
            />
          ))}
          
          {/* Dashboard Routes */}
          {dashboardRoutes.map(({ path, component: Component }) => (
            <Route 
              key={path}
              path={path} 
              element={
                <DashboardLayout 
                  currentPath={currentPath} 
                  setCurrentPath={setCurrentPath}
                >
                  <Component userId={userId} setUserId={setUserId} />
                </DashboardLayout>
              } 
            />
          ))}
          
          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>

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
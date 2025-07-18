import React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';

const AppContent = styled.div`
  background: #0f172a;
  min-height: 100vh;
`;

const ContentArea = styled.div`
  margin-left: 280px;
  padding: 2rem;
  min-height: calc(100vh - 80px);
  
  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const DashboardLayout = ({ children, currentPath, setCurrentPath }) => {
  return (
    <AppContent>
      <Sidebar currentPath={currentPath} setCurrentPath={setCurrentPath} />
      <ContentArea>
        {children}
      </ContentArea>
    </AppContent>
  );
};

export default DashboardLayout; 
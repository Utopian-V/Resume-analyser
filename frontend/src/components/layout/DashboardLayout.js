import React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar.js';
import Logo from '../Logo.js';

const AppContent = styled.div`
  background: #0f172a;
  min-height: 100vh;
`;

const TopBar = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  background: rgba(15, 23, 42, 0.85);
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 101;
`;

const ContentArea = styled.div`
  margin-left: 280px;
  padding: 2rem;
  min-height: calc(100vh - 64px);
  margin-top: 64px;
  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const DashboardLayout = ({ children, currentPath, setCurrentPath }) => {
  return (
    <AppContent>
      <TopBar>
        <Logo size="small" />
      </TopBar>
      <Sidebar currentPath={currentPath} setCurrentPath={setCurrentPath} />
      <ContentArea>
        {children}
      </ContentArea>
    </AppContent>
  );
};

export default DashboardLayout; 
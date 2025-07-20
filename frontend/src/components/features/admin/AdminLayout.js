import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: #0f172a;
`;

const Sidebar = styled.div`
  width: 250px;
  background: #1e293b;
  border-right: 1px solid #334155;
  padding: 1rem;
`;

const MainContent = styled.div`
  flex: 1;
  background: #0f172a;
  overflow-y: auto;
`;

const Logo = styled.div`
  color: #6366f1;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
`;

const NavItem = styled(Link)`
  display: block;
  padding: 0.75rem 1rem;
  color: ${props => props.active ? '#fff' : '#94a3b8'};
  background: ${props => props.active ? '#6366f1' : 'transparent'};
  border-radius: 6px;
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.active ? '#6366f1' : '#334155'};
    color: #fff;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileSidebar = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.open ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    width: 250px;
    height: 100vh;
    background: #1e293b;
    z-index: 1000;
    padding: 1rem;
  }
`;

export default function AdminLayout({ children }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/profile', label: 'Writer Profile' },
    { path: '/admin/new-blog', label: 'New Blog' },
    { path: '/admin/blogs', label: 'Manage Blogs' },
    { path: '/admin/users', label: 'Manage Users' },
    { path: '/admin/questions', label: 'Manage Questions' },
    { path: '/admin/settings', label: 'Settings' }
  ];

  return (
    <Container>
      <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        ☰
      </MobileMenuButton>
      
      <MobileSidebar open={mobileMenuOpen}>
        <Logo>Admin Portal</Logo>
        {navItems.map(item => (
          <NavItem
            key={item.path}
            to={item.path}
            active={location.pathname === item.path}
            onClick={() => setMobileMenuOpen(false)}
          >
            {item.label}
          </NavItem>
        ))}
      </MobileSidebar>

      <Sidebar>
        <Logo>Admin Portal</Logo>
        {navItems.map(item => (
          <NavItem
            key={item.path}
            to={item.path}
            active={location.pathname === item.path}
          >
            {item.label}
          </NavItem>
        ))}
      </Sidebar>

      <MainContent>
        {children}
      </MainContent>
    </Container>
  );
} 
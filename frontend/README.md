# Frontend Team Guide

## 🎯 Team Purpose
The Frontend Team is responsible for building responsive, user-friendly interfaces and managing client-side state for the PrepNexus platform.

## 📁 Code Structure

```
frontend/src/
├── components/
│   ├── features/           # Feature-specific components
│   │   ├── admin/         # Admin portal components
│   │   ├── aptitude/      # Aptitude test components
│   │   ├── blog/          # Blog components
│   │   ├── dashboard/     # User dashboard components
│   │   ├── dsa/           # DSA practice components
│   │   ├── interview/     # Interview prep components
│   │   ├── jobs/          # Job listings components
│   │   └── resume/        # Resume analysis components
│   └── shared/            # Reusable UI components
│       ├── layout/        # Layout components (Navbar, Sidebar, etc.)
│       └── ui/            # UI components (Buttons, Cards, etc.)
├── config/                # Configuration files
│   └── routes.js         # Application routing
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
├── styles/                # Global styles
├── data/                  # Static data files
├── api.js                 # API integration layer
└── App.js                 # Main application component
```

## 🚀 Key Responsibilities

### 1. Component Development
- Build reusable, accessible React components
- Implement responsive design patterns
- Ensure cross-browser compatibility
- Maintain component documentation

### 2. State Management
- Manage application state efficiently
- Implement proper data flow patterns
- Handle loading and error states
- Optimize re-renders and performance

### 3. User Experience
- Create intuitive user interfaces
- Implement smooth animations and transitions
- Ensure accessibility standards (WCAG 2.1)
- Optimize for mobile and desktop

### 4. Performance
- Implement code splitting and lazy loading
- Optimize bundle size
- Monitor Core Web Vitals
- Implement caching strategies

## 🛠️ Development Guidelines

### Component Structure
```javascript
// Feature Component Example
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useCustomHook } from '../../../hooks/useCustomHook';
import { apiCall } from '../../../api';

const ComponentName = ({ prop1, prop2 }) => {
  const [state, setState] = useState(null);
  const { data, loading, error } = useCustomHook();

  useEffect(() => {
    // Component logic
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <Container>
      {/* Component JSX */}
    </Container>
  );
};

const Container = styled.div`
  // Styled components
`;

export default ComponentName;
```

### File Naming Conventions
- **Components**: PascalCase (e.g., `UserDashboard.js`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useFAQ.js`)
- **Utilities**: camelCase (e.g., `csv.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`)

### Import Organization
```javascript
// 1. React and third-party libraries
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// 2. Internal components
import { Button } from '../../shared/ui/Button';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';

// 3. Hooks and utilities
import { useAPI } from '../../../hooks/useAPI';
import { formatDate } from '../../../utils/dateUtils';

// 4. Types and constants
import { API_ENDPOINTS } from '../../../config/constants';
```

## 📚 Component Library

### Shared UI Components
- `Button` - Reusable button component with variants
- `Card` - Content container with shadow and padding
- `Modal` - Overlay dialog component
- `LoadingSpinner` - Loading state indicator
- `ErrorMessage` - Error display component
- `FAQChat` - Interactive FAQ component

### Layout Components
- `Navbar` - Main navigation bar
- `Sidebar` - Dashboard sidebar navigation
- `DashboardLayout` - Main dashboard layout wrapper
- `MobileMenu` - Mobile navigation menu

## 🔗 API Integration

### API Layer (`src/api.js`)
```javascript
// Example API call
export const getUserProfile = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`);
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to fetch user profile: ${error.message}`);
  }
};
```

### Custom Hooks
```javascript
// Example custom hook
export const useUserProfile = (userId) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(userId);
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return { profile, loading, error };
};
```

## 🎨 Styling Guidelines

### Styled Components
```javascript
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 1rem 0;
`;
```

### Theme System
```javascript
// Global theme configuration
export const theme = {
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#ffffff',
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  }
};
```

## 🧪 Testing Guidelines

### Component Testing
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import UserDashboard from './UserDashboard';

describe('UserDashboard', () => {
  it('renders user information correctly', () => {
    render(<UserDashboard userId="123" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('handles loading state', () => {
    render(<UserDashboard userId="123" />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
```

## 🚀 Performance Best Practices

### Code Splitting
```javascript
// Lazy load components
const AdminPortal = lazy(() => import('./features/admin/AdminPortal'));
const BlogEditor = lazy(() => import('./features/admin/BlogEditor'));

// Route-based code splitting
const routes = [
  {
    path: '/admin',
    component: lazy(() => import('./features/admin/AdminPortal'))
  }
];
```

### Memoization
```javascript
// Memoize expensive components
const ExpensiveComponent = memo(({ data }) => {
  return <div>{/* Expensive rendering logic */}</div>;
});

// Memoize callbacks
const handleClick = useCallback((id) => {
  // Handle click logic
}, []);
```

## 📱 Responsive Design

### Breakpoints
```javascript
const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
};

// Usage in styled components
const Container = styled.div`
  padding: 1rem;
  
  @media (min-width: ${breakpoints.tablet}) {
    padding: 2rem;
  }
  
  @media (min-width: ${breakpoints.desktop}) {
    padding: 3rem;
  }
`;
```

## 🔍 Accessibility

### ARIA Labels
```javascript
<button 
  aria-label="Close modal"
  onClick={handleClose}
>
  <XIcon />
</button>
```

### Keyboard Navigation
```javascript
const handleKeyDown = (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleClick();
  }
};
```

## 📊 Monitoring & Analytics

### Error Tracking
```javascript
// Error boundary for component error handling
class ErrorBoundary extends Component {
  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service
    console.error('Component error:', error, errorInfo);
  }
}
```

### Performance Monitoring
```javascript
// Track component render time
useEffect(() => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Log performance metrics
    if (renderTime > 100) {
      console.warn(`Slow render detected: ${renderTime}ms`);
    }
  };
}, []);
```

## 🤝 Collaboration

### Code Review Checklist
- [ ] Component follows naming conventions
- [ ] Proper error handling implemented
- [ ] Loading states handled
- [ ] Accessibility requirements met
- [ ] Performance considerations addressed
- [ ] Tests written for new functionality
- [ ] Documentation updated

### Git Workflow
1. Create feature branch from `main`
2. Implement feature with tests
3. Update documentation
4. Create pull request
5. Address review feedback
6. Merge to `main`

---

**Frontend Team Lead**: frontend@prepnexus.com
**Last Updated**: July 2024 
# Component Library Guide

## 🎯 Overview
This guide documents all reusable components in the PrepNexus frontend, their usage, props, and examples.

## 📁 Component Structure

```
src/components/
├── features/              # Feature-specific components
│   ├── admin/            # Admin portal components
│   ├── aptitude/         # Aptitude test components
│   ├── blog/             # Blog components
│   ├── dashboard/        # User dashboard components
│   ├── dsa/              # DSA practice components
│   ├── interview/        # Interview prep components
│   ├── jobs/             # Job listings components
│   └── resume/           # Resume analysis components
└── shared/               # Reusable UI components
    ├── layout/           # Layout components
    └── ui/               # UI components
```

## 🏗️ Layout Components

### Navbar
**Location**: `shared/layout/Navbar.js`

**Purpose**: Main navigation bar with logo, menu items, and mobile menu toggle.

**Props**:
- `onMobileMenuOpen`: Function to open mobile menu

**Usage**:
```javascript
import { Navbar } from '../shared/layout';

<Navbar onMobileMenuOpen={handleMobileMenuOpen} />
```

**Features**:
- Responsive design
- Logo display
- Mobile menu toggle
- User authentication status

### Sidebar
**Location**: `shared/layout/Sidebar.js`

**Purpose**: Dashboard sidebar navigation with menu items and user info.

**Props**:
- `currentPath`: Current active route
- `setCurrentPath`: Function to update current path

**Usage**:
```javascript
import { Sidebar } from '../shared/layout';

<Sidebar 
  currentPath={currentPath} 
  setCurrentPath={setCurrentPath} 
/>
```

**Features**:
- Collapsible navigation
- Active route highlighting
- User profile section
- Quick actions menu

### DashboardLayout
**Location**: `shared/layout/DashboardLayout.js`

**Purpose**: Main layout wrapper for dashboard pages.

**Props**:
- `currentPath`: Current active route
- `setCurrentPath`: Function to update current path
- `children`: Child components to render

**Usage**:
```javascript
import { DashboardLayout } from '../shared/layout';

<DashboardLayout 
  currentPath={currentPath} 
  setCurrentPath={setCurrentPath}
>
  <UserDashboard />
</DashboardLayout>
```

**Features**:
- Sidebar integration
- Header with navigation
- Responsive layout
- Content area management

### MobileMenu
**Location**: `shared/layout/MobileMenu.js`

**Purpose**: Mobile navigation menu overlay.

**Props**:
- `isOpen`: Boolean to control menu visibility
- `onClose`: Function to close menu

**Usage**:
```javascript
import { MobileMenu } from '../shared/layout';

<MobileMenu 
  isOpen={isMobileMenuOpen} 
  onClose={handleMobileMenuClose} 
/>
```

**Features**:
- Slide-in animation
- Touch-friendly navigation
- Backdrop overlay
- Smooth transitions

## 🎨 UI Components

### Logo
**Location**: `shared/ui/Logo.js`

**Purpose**: PrepNexus logo component with responsive sizing.

**Props**:
- `size`: Logo size ('small', 'medium', 'large')
- `color`: Logo color (optional)

**Usage**:
```javascript
import Logo from '../shared/ui/Logo';

<Logo size="medium" />
```

### FAQChat
**Location**: `shared/ui/FAQChat.js`

**Purpose**: Interactive FAQ chat component with AI responses.

**Props**:
- `isOpen`: Boolean to control modal visibility
- `onOpen`: Function to open modal
- `onClose`: Function to close modal
- `faqQuestion`: Current question text
- `setFaqQuestion`: Function to update question
- `faqMessages`: Array of chat messages
- `loading`: Boolean for loading state
- `onSubmit`: Function to submit question

**Usage**:
```javascript
import FAQChat from '../shared/ui/FAQChat';

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
```

**Features**:
- Real-time chat interface
- AI-powered responses
- Message history
- Loading states
- Responsive design

### PDFViewer
**Location**: `shared/ui/PDFViewer.js`

**Purpose**: PDF document viewer component.

**Props**:
- `file`: PDF file object or URL
- `width`: Viewer width (optional)
- `height`: Viewer height (optional)

**Usage**:
```javascript
import PDFViewer from '../shared/ui/PDFViewer';

<PDFViewer 
  file={resumeFile} 
  width="100%" 
  height="600px" 
/>
```

**Features**:
- PDF rendering
- Zoom controls
- Page navigation
- Download functionality

### ReviewsSection
**Location**: `shared/ui/ReviewsSection.js`

**Purpose**: User reviews and testimonials display.

**Props**:
- `reviews`: Array of review objects
- `title`: Section title (optional)

**Usage**:
```javascript
import ReviewsSection from '../shared/ui/ReviewsSection';

<ReviewsSection 
  reviews={userReviews} 
  title="What Our Users Say" 
/>
```

**Features**:
- Star ratings
- User avatars
- Review text
- Responsive grid layout

## 📊 Feature Components

### UserDashboard
**Location**: `features/dashboard/UserDashboard.js`

**Purpose**: Main user dashboard with progress overview and quick actions.

**Props**:
- `userId`: User identifier
- `setUserId`: Function to update user ID

**Usage**:
```javascript
import UserDashboard from '../features/dashboard/UserDashboard';

<UserDashboard userId={userId} setUserId={setUserId} />
```

**Features**:
- Progress tracking
- Quick action cards
- Recent activity
- Performance metrics

### Blog
**Location**: `features/blog/Blog.js`

**Purpose**: Blog listing and individual blog post components.

**Props**:
- `id`: Blog post ID (for individual posts)

**Usage**:
```javascript
import Blog, { BlogPost } from '../features/blog/Blog';

// Blog listing
<Blog />

// Individual blog post
<BlogPost id="blog-123" />
```

**Features**:
- Blog card grid
- Search and filtering
- Pagination
- Rich text rendering
- Social sharing

### AptitudeTest
**Location**: `features/aptitude/AptitudeTest.js`

**Purpose**: Interactive aptitude test interface.

**Props**:
- `testId`: Test identifier (optional)

**Usage**:
```javascript
import AptitudeTest from '../features/aptitude/AptitudeTest';

<AptitudeTest testId="test1" />
```

**Features**:
- Question navigation
- Timer functionality
- Answer selection
- Progress tracking
- Results display

### JobListings
**Location**: `features/jobs/JobListings.js`

**Purpose**: Job search and listing interface.

**Props**:
- `company`: Filter by company (optional)
- `location`: Filter by location (optional)

**Usage**:
```javascript
import JobListings from '../features/jobs/JobListings';

<JobListings company="Google" location="Mountain View" />
```

**Features**:
- Job card display
- Search functionality
- Filtering options
- Company information
- Apply functionality

### FileUpload
**Location**: `features/resume/FileUpload.js`

**Purpose**: Resume upload and analysis interface.

**Props**:
- `onUpload`: Function called after successful upload
- `maxSize`: Maximum file size in MB (default: 10)

**Usage**:
```javascript
import FileUpload from '../features/resume/FileUpload';

<FileUpload 
  onUpload={handleResumeAnalysis} 
  maxSize={10} 
/>
```

**Features**:
- Drag and drop upload
- File validation
- Progress indicators
- Multiple file formats
- Error handling

### EnhancedDSABank
**Location**: `features/dsa/EnhancedDSABank.js`

**Purpose**: DSA practice interface with question bank.

**Props**:
- `category`: Question category filter (optional)
- `difficulty`: Difficulty level filter (optional)

**Usage**:
```javascript
import EnhancedDSABank from '../features/dsa/EnhancedDSABank';

<EnhancedDSABank category="arrays" difficulty="medium" />
```

**Features**:
- Question filtering
- Solution display
- Progress tracking
- Difficulty levels
- Category organization

### InterviewPrep
**Location**: `features/interview/InterviewPrep.js`

**Purpose**: AI-powered interview practice interface.

**Props**:
- `role`: Interview role (technical, behavioral, hr)
- `userId`: User identifier

**Usage**:
```javascript
import InterviewPrep from '../features/interview/InterviewPrep';

<InterviewPrep role="technical" userId={userId} />
```

**Features**:
- Role-based questions
- AI responses
- Conversation history
- Practice sessions
- Feedback system

## 🎯 Admin Components

### AdminPortal
**Location**: `features/admin/AdminPortal.js`

**Purpose**: Main admin portal entry point.

**Usage**:
```javascript
import AdminPortal from '../features/admin/AdminPortal';

<AdminPortal />
```

### AdminDashboard
**Location**: `features/admin/AdminDashboard.js`

**Purpose**: Admin dashboard with system overview.

**Features**:
- System metrics
- User statistics
- Content management
- Quick actions

### BlogManagement
**Location**: `features/admin/BlogManagement.js`

**Purpose**: Blog content management interface.

**Features**:
- Blog CRUD operations
- Content editor
- Publishing controls
- Analytics overview

### UserManagement
**Location**: `features/admin/UserManagement.js`

**Purpose**: User account management interface.

**Features**:
- User listing
- Account management
- Role assignment
- Activity monitoring

## 🎨 Styling Guidelines

### Styled Components Usage
```javascript
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
```

### Theme Integration
```javascript
const Button = styled.button`
  background: ${({ variant, theme }) => 
    variant === 'primary' ? theme.colors.primary : theme.colors.secondary};
  color: white;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;
```

### Responsive Design
```javascript
const ResponsiveContainer = styled.div`
  padding: 1rem;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
  
  @media (min-width: 1024px) {
    padding: 3rem;
  }
`;
```

## 🔧 Component Development

### Creating New Components
1. **Choose location**: Place in appropriate feature or shared directory
2. **Follow naming**: Use PascalCase for component names
3. **Add props**: Define clear prop interfaces
4. **Include documentation**: Add JSDoc comments
5. **Add tests**: Write unit tests for component logic

### Component Template
```javascript
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * ComponentName - Brief description
 * @param {Object} props - Component props
 * @param {string} props.title - Component title
 * @param {Function} props.onClick - Click handler
 */
const ComponentName = ({ title, onClick, children }) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Component initialization
  }, []);

  const handleClick = () => {
    onClick && onClick();
  };

  return (
    <Container onClick={handleClick}>
      <Title>{title}</Title>
      {children}
    </Container>
  );
};

ComponentName.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  children: PropTypes.node,
};

ComponentName.defaultProps = {
  onClick: () => {},
};

const Container = styled.div`
  // Styled component styles
`;

const Title = styled.h2`
  // Title styles
`;

export default ComponentName;
```

## 🧪 Testing Components

### Unit Test Example
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  it('renders with title', () => {
    render(<ComponentName title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<ComponentName title="Test" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Test'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

## 📱 Accessibility

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

### Focus Management
```javascript
useEffect(() => {
  const element = document.getElementById('focus-target');
  if (element) {
    element.focus();
  }
}, []);
```

---

**Component Library Version**: 1.0.0
**Last Updated**: July 2024 
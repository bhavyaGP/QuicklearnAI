# Contributing to QuickLearnAI Client

Thank you for your interest in contributing to QuickLearnAI! This document provides guidelines and instructions for contributing to the client-side application.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Component Guidelines](#component-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the community
- Show empathy towards other contributors

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js 18+ installed
- Git configured with your user information
- A code editor with ESLint and Prettier extensions
- Basic knowledge of React, Tailwind CSS, and JavaScript/ES6+

### Setup Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/QuicklearnAI.git
   cd QuicklearnAI/client
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/original-owner/QuicklearnAI.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

6. **Start development server**:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Strategy

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/**: New features (`feature/user-authentication`)
- **bugfix/**: Bug fixes (`bugfix/login-validation`)
- **hotfix/**: Critical production fixes

### Working on Features

1. **Sync with upstream**:
   ```bash
   git checkout main
   git pull upstream main
   ```

2. **Create feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes and commit**:
   ```bash
   git add .
   git commit -m "feat: add user authentication system"
   ```

4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request** on GitHub

## Coding Standards

### JavaScript/React Guidelines

#### File Naming
- **Components**: PascalCase (`UserProfile.jsx`)
- **Utilities**: camelCase (`apiClient.js`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.js`)
- **Hooks**: camelCase with `use` prefix (`useAuth.js`)

#### Component Structure
```jsx
// 1. Imports (external libraries first, then internal)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { apiService } from '@/services/api';

// 2. Constants
const DEFAULT_OPTIONS = {
  timeout: 5000,
  retries: 3
};

// 3. Component definition
const UserProfile = ({ userId, onUpdate }) => {
  // 4. State declarations
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // 5. Hooks
  const navigate = useNavigate();
  
  // 6. Event handlers
  const handleUpdate = async (data) => {
    setLoading(true);
    try {
      await apiService.updateUser(userId, data);
      onUpdate?.(data);
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 7. Effects
  useEffect(() => {
    fetchUser();
  }, [userId]);
  
  // 8. Helper functions
  const fetchUser = async () => {
    // Implementation
  };
  
  // 9. Render
  return (
    <div className="user-profile">
      {/* Component JSX */}
    </div>
  );
};

// 10. Default export
export default UserProfile;
```

#### Code Style Rules

- Use functional components with hooks
- Prefer arrow functions for inline handlers
- Use destructuring for props and state
- Add PropTypes or TypeScript for type safety
- Keep components under 200 lines when possible
- Extract complex logic into custom hooks

### CSS/Styling Guidelines

#### Tailwind CSS Usage
```jsx
// ✅ Good: Semantic class ordering
<div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm">

// ❌ Avoid: Random class ordering
<div className="border-gray-200 flex shadow-sm bg-white rounded-lg items-center p-4 justify-between border">
```

#### Class Ordering Convention
1. Layout (flex, grid, block)
2. Positioning (relative, absolute)
3. Box model (width, height, padding, margin)
4. Typography (font, text-color, text-align)
5. Background (bg-color, bg-image)
6. Borders (border, rounded)
7. Effects (shadow, opacity, transform)

#### Custom Styles
- Use Tailwind utilities first
- Create custom CSS only when necessary
- Follow BEM methodology for custom classes
- Use CSS-in-JS sparingly

### API Integration Standards

#### Service Functions
```javascript
// ✅ Good: Consistent error handling
export const userService = {
  getUser: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get user error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  }
};

// ❌ Avoid: Inconsistent error handling
export const getUser = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data; // No error handling
};
```

## Component Guidelines

### Component Types

#### 1. Page Components (`src/pages/`)
- Represent entire pages/routes
- Handle data fetching
- Compose smaller components
- Manage page-level state

#### 2. Feature Components (`src/components/`)
- Reusable business logic components
- Self-contained functionality
- Clear prop interfaces

#### 3. UI Components (`src/components/ui/`)
- Pure presentational components
- No business logic
- Highly reusable
- Well-documented props

### Component Checklist

Before submitting a component:

- [ ] Props are documented with PropTypes/TypeScript
- [ ] Component handles loading and error states
- [ ] Responsive design implemented
- [ ] Accessibility attributes added (ARIA labels, etc.)
- [ ] Component is tested
- [ ] Storybook story created (if applicable)

### Accessibility Requirements

- Use semantic HTML elements
- Add ARIA labels for screen readers
- Ensure keyboard navigation works
- Maintain color contrast ratios (4.5:1 minimum)
- Test with screen reader software

## Commit Message Guidelines

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples
```bash
feat(auth): add Google OAuth integration

- Implement Google login button
- Add OAuth callback handling
- Update user model for social login

Closes #123

fix(quiz): resolve timer not stopping on completion

The quiz timer was continuing after user submitted answers.
Fixed by clearing interval on component unmount.

Fixes #456
```

### Rules
- Use imperative mood ("add" not "added")
- Keep subject line under 50 characters
- Capitalize subject line
- No period at end of subject
- Reference issues in footer

## Pull Request Process

### Before Creating PR

1. **Sync with latest main**:
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Run quality checks**:
   ```bash
   npm run lint
   npm run test
   npm run build
   ```

3. **Update documentation** if needed

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No console.log statements
```

### Review Process

1. **Automated checks** must pass
2. **Two approvals** required from maintainers
3. **Address feedback** promptly
4. **Squash and merge** when approved

## Issue Reporting

### Bug Reports

Use the bug report template:

```markdown
**Describe the bug**
Clear description of the issue

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g. macOS, Windows]
- Browser: [e.g. Chrome, Firefox]
- Version: [e.g. 22]

**Additional context**
Any other relevant information
```

### Feature Requests

Include:
- Problem statement
- Proposed solution
- Alternative solutions considered
- Additional context

## Testing Guidelines

### Test Structure
```javascript
describe('UserProfile Component', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  it('should render user information correctly', () => {
    // Test implementation
  });

  it('should handle loading state', () => {
    // Test implementation
  });

  it('should handle error state', () => {
    // Test implementation
  });
});
```

### Testing Best Practices

- Write tests for all new features
- Test error scenarios
- Mock external dependencies
- Use data-testid for test selectors
- Keep tests simple and focused

### Test Types

1. **Unit Tests**: Individual components and functions
2. **Integration Tests**: Component interactions
3. **E2E Tests**: Critical user journeys

## Documentation

### Code Documentation

- Document complex algorithms
- Add JSDoc comments for utilities
- Update README for new features
- Include usage examples

### Component Documentation

```jsx
/**
 * User profile component with edit capabilities
 * 
 * @param {string} userId - The user's unique identifier
 * @param {Function} onUpdate - Callback when user is updated
 * @param {boolean} editable - Whether profile can be edited
 * @returns {JSX.Element} Rendered user profile
 */
const UserProfile = ({ userId, onUpdate, editable = false }) => {
  // Component implementation
};
```

## Performance Guidelines

### Optimization Techniques

- Use React.memo for pure components
- Implement lazy loading for routes
- Optimize images and assets
- Minimize bundle size
- Use proper dependency arrays in useEffect

### Monitoring

- Check bundle analyzer output
- Monitor Core Web Vitals
- Test on various devices/connections
- Use React DevTools Profiler

## Security Considerations

- Sanitize user inputs
- Validate data on both client and server
- Use HTTPS for all API calls
- Implement proper authentication checks
- Avoid exposing sensitive data in client code

## Getting Help

- Check existing issues and documentation
- Ask questions in GitHub Discussions
- Join our Discord/Slack community
- Reach out to maintainers

## Recognition

Contributors are recognized in:
- README.md acknowledgments
- Release notes
- Annual contributor reports

Thank you for contributing to QuickLearnAI! 🎉

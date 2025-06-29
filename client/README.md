# QuickLearnAI Client

A modern React-based frontend application for QuickLearnAI - an AI-powered learning platform that connects students with teachers and provides innovative study tools.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Components Overview](#components-overview)
- [API Integration](#api-integration)
- [Building for Production](#building-for-production)
- [Testing](#testing)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

## Features

- **AI-Powered Quiz Generation**: Create personalized quizzes from YouTube videos and content
- **Interactive Mind Maps**: Visualize learning with AI-generated mind maps
- **Real-time Doubt Resolution**: Connect with verified teachers for instant help
- **Live Video Chat**: Seamless communication between students and teachers
- **Progress Analytics**: Track learning progress with detailed statistics and charts
- **Question Paper Generation**: AI-powered exam paper creation for teachers
- **Admin Dashboard**: Comprehensive admin panel for managing users and orders
- **Payment Integration**: Razorpay integration for subscription management
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Tech Stack

- **Frontend Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.2
- **Styling**: Tailwind CSS 3.4.1
- **State Management**: React Context API & localStorage
- **Routing**: React Router DOM 7.1.1
- **Real-time Communication**: Socket.io Client 4.8.1
- **Charts & Analytics**: Recharts 2.15.3
- **Animations**: Framer Motion 11.18.2
- **UI Components**: Radix UI primitives
- **HTTP Client**: Axios 1.7.9
- **Icons**: Lucide React 0.469.0
- **Form Handling**: Custom hooks and validation
- **Toast Notifications**: React Hot Toast 2.5.2

## Prerequisites

Before setting up the client, ensure you have:

- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher (comes with Node.js)
- **Git**: For version control
- **Modern Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd QuicklearnAI
   ```

2. **Navigate to the client directory**:
   ```bash
   cd client
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

5. **Configure environment variables** (see [Environment Variables](#environment-variables) section)

## Development

### Starting the Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173` by default.

### Development Features

- **Hot Module Replacement (HMR)**: Instant updates without page refresh
- **ESLint Integration**: Code quality and style checking
- **Auto-formatting**: Prettier integration for consistent code style
- **Source Maps**: Easy debugging in development

## Project Structure

```
client/
├── public/                 # Static assets
│   ├── vite.svg           # App favicon
│   └── index.html         # Main HTML template
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Base UI components (buttons, cards, etc.)
│   │   ├── Navbar.jsx    # Navigation component
│   │   ├── Hero.jsx      # Landing page hero section
│   │   ├── Features.jsx  # Features showcase
│   │   ├── Security.jsx  # Security features section
│   │   ├── FAQ.jsx       # Frequently asked questions
│   │   ├── Footer.jsx    # Footer component
│   │   └── ...           # Other components
│   ├── pages/            # Page-level components
│   │   ├── quiz.jsx      # Quiz generation page
│   │   ├── ChatBot.jsx   # AI chatbot interface
│   │   ├── MindMap.jsx   # Mind map visualization
│   │   ├── AdminDashboard.jsx # Admin panel
│   │   └── ...           # Other pages
│   ├── services/         # API service layer
│   │   └── api.js        # API client and service functions
│   ├── hooks/            # Custom React hooks
│   │   └── useIntersectionObserver.js
│   ├── utils/            # Utility functions
│   │   └── socket.js     # Socket.io client setup
│   ├── lib/              # Shared libraries
│   │   └── utils.js      # Common utility functions
│   ├── assets/           # Images and static assets
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # React app entry point
│   └── index.css         # Global styles
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
├── eslint.config.js      # ESLint configuration
└── README.md             # This file
```

## Environment Variables

Create a `.env` file in the client directory with the following variables:

```bash
# API Endpoints
VITE_GEN_PROXY=http://localhost:5000          # Flask server endpoint
VITE_PROXY_API_URL=http://localhost:3001      # Node.js server endpoint  
VITE_API_URL=http://localhost:3001            # Primary API URL
VITE_SOCKET_URL=http://localhost:3001         # Socket.io server URL

# External Services
VITE_GOOGLE_CLIENT_ID=your_google_client_id   # Google OAuth (optional)
VITE_RAZORPAY_KEY_ID=your_razorpay_key        # Razorpay payment gateway
```

**Important**: 
- Never commit `.env` files with sensitive data
- Use `.env.example` as a template for required variables
- Prefix all environment variables with `VITE_` for Vite to recognize them

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality check |
| `npm run lint:fix` | Auto-fix ESLint issues |

## Components Overview

### Core Components

- **Navbar**: Navigation with role-based menu items
- **Hero**: Landing page with search functionality
- **Features**: Platform capabilities showcase
- **Security**: Security features and compliance
- **FAQ**: Expandable frequently asked questions

### Page Components

- **Quiz Generator**: AI-powered quiz creation from URLs
- **Mind Map**: Interactive visualization of learning content
- **ChatBot**: AI assistant for learning support
- **Admin Dashboard**: User and order management
- **Profile Page**: User analytics and progress tracking

### UI Components

Located in `src/components/ui/`:
- **Button**: Customizable button component
- **Card**: Container component with variants
- **Dialog**: Modal dialog implementation
- **Input**: Form input with validation
- **Table**: Data table with sorting and filtering
- **Tabs**: Tabbed interface component

## API Integration

The application integrates with multiple services:

### Services

1. **Quiz Service**: Generate quizzes from YouTube URLs
2. **Document Service**: PDF upload and processing
3. **Chat Service**: Real-time messaging
4. **Payment Service**: Razorpay integration
5. **Statistics Service**: User progress tracking
6. **Admin Service**: Administrative operations

### Authentication

- JWT-based authentication
- Role-based access control (Student, Teacher, Admin)
- Automatic token refresh
- Protected routes with `PrivateRoute` component

### Real-time Features

- Socket.io for live chat
- Real-time quiz sessions
- Live teacher-student matching
- Instant notifications

## Building for Production

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Preview the build**:
   ```bash
   npm run preview
   ```

3. **Deploy the `dist` folder** to your hosting service

### Optimization Features

- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Remove unused code
- **Asset Optimization**: Image and CSS optimization
- **Minification**: JavaScript and CSS minification

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Testing Strategy

- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API service testing
- **E2E Tests**: Critical user flow testing
- **Accessibility Tests**: WCAG compliance testing

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines on:
- Code style and conventions
- Pull request process
- Issue reporting
- Development workflow

## Troubleshooting

### Common Issues

#### Development Server Won't Start

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Build Failures

```bash
# Check for TypeScript errors
npm run type-check

# Clear Vite cache
rm -rf node_modules/.vite
```

#### Environment Variables Not Loading

- Ensure variables are prefixed with `VITE_`
- Restart development server after adding new variables
- Check `.env` file is in the correct directory

#### Socket Connection Issues

- Verify `VITE_SOCKET_URL` is correct
- Check if backend server is running
- Ensure CORS is properly configured

### Performance Issues

- Use React Developer Tools for component profiling
- Check Network tab for slow API calls
- Optimize images and assets
- Implement lazy loading for large components

### Browser Compatibility

The application supports:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

For older browser support, additional polyfills may be required.

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the FAQ section for common questions

---

**Happy coding! 🚀**

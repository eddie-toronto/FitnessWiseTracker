# FitnessWise - Back Workout Tracker

## Overview

FitnessWise is a Progressive Web App (PWA) designed for back workout tracking with a mobile-first approach. The application is built to eliminate workout progress loss due to accidental page refreshes, providing a robust and reliable fitness tracking experience. The system features a three-banner progressive disclosure design inspired by Amazon's mobile interface patterns.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom configuration
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React hooks with TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **PWA Features**: Service worker with caching and background sync

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Authentication**: Firebase Auth with Google OAuth
- **API**: RESTful endpoints with TypeScript validation using Zod

### Build System
- **Development**: Vite dev server with HMR
- **Production**: Vite build + ESBuild for server bundling
- **TypeScript**: Strict mode with path mapping for clean imports

## Key Components

### Three-Banner System
1. **App Banner**: Fixed header with global navigation, authentication status, and streak counter
2. **Day Banner**: Progressive disclosure for timer controls and workout context
3. **Workout Banner**: Individual exercise tracking and progression

### Core Features
- **Workout Sessions**: Persistent workout state with auto-save every 30 seconds
- **Timer System**: Built-in workout timer with play/pause functionality
- **Exercise Tracking**: Set-based exercise progression with rep counting
- **PWA Capabilities**: Offline support, installable app, background sync

### Authentication Flow
- Firebase Auth integration with Google OAuth
- Automatic user creation and profile management
- Session persistence across devices

## Data Flow

### User Authentication
1. User initiates Google OAuth through Firebase
2. Firebase returns user credentials
3. Backend creates or retrieves user profile
4. Client stores authentication state

### Workout Sessions
1. User starts workout (A, B, or C)
2. Session data stored locally and synced to backend
3. Auto-save every 30 seconds to prevent data loss
4. Real-time timer updates during workout
5. Progress tracking with set completion

### Data Persistence
- Local storage for immediate state persistence
- PostgreSQL for permanent data storage
- Background sync for offline capability

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives with shadcn/ui
- **State Management**: TanStack Query v5
- **Styling**: Tailwind CSS with custom fitness theme
- **Icons**: Lucide React icons
- **PWA**: Custom service worker implementation

### Backend Dependencies
- **Database**: Drizzle ORM with PostgreSQL dialect
- **Authentication**: Firebase Admin SDK
- **Validation**: Zod for type-safe API contracts
- **Database Provider**: Neon serverless PostgreSQL

### Development Tools
- **Build**: Vite with React plugin
- **TypeScript**: Strict configuration with path mapping
- **Linting**: ESLint with TypeScript support
- **Error Handling**: Replit error overlay for development

## Deployment Strategy

### Production Build
1. Frontend: Vite builds optimized React bundle
2. Backend: ESBuild bundles server code
3. Static assets served from dist/public
4. Database migrations via Drizzle Kit

### Environment Configuration
- **Database**: CONNECTION_URL via environment variable
- **Firebase**: Configuration via environment variables
- **PWA**: Manifest and service worker for installability

### Hosting Requirements
- Node.js runtime environment
- PostgreSQL database connection
- Static file serving capability
- HTTPS for PWA features

## Changelog

Changelog:
- July 04, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.
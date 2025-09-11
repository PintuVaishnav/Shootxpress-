# Overview

ShootXpress is a professional photography and videography booking platform that specializes in same-day reel delivery. The application allows customers to browse photography packages, view portfolio galleries, book shoots, and make advance payments through PhonePe integration. The platform features a modern React frontend with a comprehensive booking system and portfolio management capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with pages for Home, Packages, Gallery, and Contact
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom ShootXpress brand colors (black, white, orange)
- **State Management**: TanStack React Query for server state management and form handling with React Hook Form
- **Component Structure**: Modular component architecture with reusable UI components and feature-specific sections

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **API Design**: RESTful API endpoints for bookings, contacts, and portfolio management
- **Storage Layer**: Abstracted storage interface with in-memory implementation and PostgreSQL schema defined
- **File Structure**: Separation of routes, storage, and service layers for maintainability
- **Development Setup**: Vite middleware integration for hot reloading in development

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Design**: Three main entities - bookings, contacts, and portfolio items
- **Migration System**: Drizzle Kit for database schema migrations and management
- **Connection**: Neon Database serverless PostgreSQL for cloud deployment

## Authentication and Authorization
- **Current State**: No authentication system implemented - operates as a public booking platform
- **Session Management**: Basic session handling infrastructure present but not actively used
- **Security**: Form validation using Zod schemas for data integrity

## Payment Integration
- **Payment Gateway**: PhonePe integration with QR code-based payments
- **Payment Flow**: Advance payment collection during booking process
- **QR Code Strategy**: Static QR code implementation with payment verification simulation
- **Transaction Tracking**: PhonePe transaction ID storage for payment reconciliation

# External Dependencies

## Third-Party Services
- **SendGrid**: Email service for booking confirmations and contact form notifications
- **PhonePe**: Payment gateway for processing advance payments and booking transactions
- **Neon Database**: Serverless PostgreSQL hosting for production database

## Key Libraries and Frameworks
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Form Management**: React Hook Form with Hookform Resolvers for validation
- **Data Fetching**: TanStack React Query for API state management
- **Styling**: Tailwind CSS with PostCSS processing
- **Database**: Drizzle ORM with PostgreSQL dialect
- **Build Tools**: Vite with React plugin and TypeScript support
- **Development**: Replit-specific plugins for error handling and cartographer integration

## External Assets
- **Images**: Unsplash integration for portfolio gallery images
- **Fonts**: Google Fonts (Inter, DM Sans, Fira Code, Geist Mono, Architects Daughter)
- **Icons**: Lucide React for consistent iconography throughout the application
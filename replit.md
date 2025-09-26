# AIDevelo.AI Landing Page

## Overview

AIDevelo.AI is a German SaaS landing page designed to help businesses generate more leads automatically using AI. The application is built as a modern web landing page with lead capture functionality, featuring a dark mode design inspired by companies like Linear, Notion, and Vercel. The platform focuses on converting visitors into qualified leads through strategic use of forms, testimonials, and clear value propositions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18+ with TypeScript**: Component-based architecture using functional components and hooks
- **Vite**: Modern build tool for fast development and optimized production builds
- **Wouter**: Lightweight client-side routing library for navigation
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Shadcn/ui**: Modern component library built on Radix UI primitives
- **TanStack Query**: Server state management for API calls and caching

### Backend Architecture
- **Express.js**: RESTful API server handling lead submissions and data persistence
- **TypeScript**: End-to-end type safety across client and server
- **Shared Schema**: Common type definitions and validation schemas using Zod
- **Memory Storage**: In-memory data persistence with interface for easy database migration
- **Form Handling**: Validated lead capture with proper error handling and responses

### Design System
- **Dark Mode First**: Custom CSS variables and Tailwind configuration optimized for dark themes
- **Brand Colors**: Neon cyan (#00cfff) and vibrant purple (#a100ff) for conversion elements
- **Typography**: Inter font family with clear hierarchy (48px-14px range)
- **Component Variants**: Consistent button, card, and form styling with hover states
- **Responsive Layout**: Mobile-first approach with breakpoint-based adaptations

### Data Management
- **Drizzle ORM**: Type-safe database operations with PostgreSQL dialect
- **Schema Validation**: Zod schemas for runtime type checking and validation
- **Lead Management**: Structured data capture including name, company, industry, contact details
- **User System**: Basic user authentication schema (prepared for future expansion)

### Content Architecture
- **Modular Components**: Hero, Features, Pricing, Testimonials, Case Studies, Contact Form
- **German Localization**: All content optimized for German-speaking B2B market
- **Conversion Optimization**: Strategic CTA placement, social proof, and lead magnets
- **Asset Management**: Organized image assets with proper imports and optimization

## External Dependencies

### UI Framework
- **Radix UI**: Headless component primitives for accessibility and functionality
- **Lucide React**: Consistent icon set for UI elements
- **Class Variance Authority**: Type-safe component variant management

### Development Tools
- **ESBuild**: Fast JavaScript bundling for production builds
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **Replit Integration**: Development environment optimizations and error handling

### Database & Storage
- **Neon Database**: PostgreSQL-compatible serverless database (configured via Drizzle)
- **Connect PG Simple**: PostgreSQL session storage for future authentication needs

### Form & Validation
- **React Hook Form**: Performant form handling with minimal re-renders
- **Hookform Resolvers**: Integration between React Hook Form and Zod validation
- **Date-fns**: Date formatting and manipulation utilities

### State Management
- **TanStack React Query**: Server state synchronization and caching
- **React Context**: Local state management for UI components like toasts and mobile menu
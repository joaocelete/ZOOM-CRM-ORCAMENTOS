# Zoom CRM - Comunicação Visual

## Overview

Zoom CRM is a custom customer relationship management system designed specifically for the visual communication industry. The application manages clients, budgets, sales pipeline (deals), products, and production workflows. Built as a full-stack web application, it provides an intuitive dashboard-style interface inspired by modern SaaS tools like Agendor, Linear, and Notion.

The system enables sales teams to:
- Track client relationships and communication history
- Create dynamic budgets with multiple line items and automatic calculations
- Manage deals through a visual Kanban-style pipeline
- Maintain a product/service catalog with flexible pricing models
- Monitor production workflow from awaiting to completion
- Generate and send budgets via WhatsApp and PDF

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- Single Page Application (SPA) architecture

**UI Component Strategy:**
- shadcn/ui component library (Radix UI primitives) for accessible, customizable components
- Tailwind CSS for utility-first styling with custom design system
- Custom HSL-based color palette supporting light/dark themes
- Design system follows Material Design influences with data-focused layouts

**State Management:**
- TanStack Query (React Query) for server state management and caching
- React hooks for local component state
- Form handling with React Hook Form and Zod validation

**Key Design Patterns:**
- Component composition with reusable UI primitives
- Separation of presentation (components) and business logic (hooks/queries)
- Feature-based file organization (pages, components, hooks, lib)
- Path aliases (@/, @shared/) for clean imports

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript for type-safe API development
- RESTful API design pattern
- Node.js runtime environment

**API Structure:**
- Resource-based endpoints (/api/clients, /api/budgets, /api/deals, etc.)
- CRUD operations for all major entities
- JSON request/response format
- Express middleware for request logging and error handling

**Database Layer:**
- Drizzle ORM for type-safe database operations
- PostgreSQL as the primary database (via Neon serverless)
- Schema-first approach with TypeScript type inference
- Database migrations managed through Drizzle Kit

**Data Models:**
- Users (authentication/authorization)
- Clients (customer information)
- Products (catalog with m2/fixed/service pricing)
- Budgets (quotes with line items)
- Budget Items (individual products/services in a quote)
- Deals (pipeline/sales opportunities)
- Production (workflow tracking)

**Code Sharing:**
- Shared schema definitions between client and server (@shared/schema.ts)
- Zod schemas for runtime validation and type inference
- Consistent TypeScript types across the full stack

### External Dependencies

**Database:**
- Neon Serverless PostgreSQL - Cloud-hosted PostgreSQL database
- WebSocket support for serverless connection pooling
- Environment-based connection via DATABASE_URL

**UI Component Libraries:**
- Radix UI - Headless accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- Lucide React - Icon library
- date-fns - Date manipulation and formatting
- @hello-pangea/dnd - Drag and drop functionality for Kanban boards

**Development Tools:**
- Replit development environment plugins (dev banner, runtime error overlay, cartographer)
- TypeScript for static type checking
- ESBuild for production bundling
- Tailwind CSS with PostCSS for styling

**Third-Party Integrations:**
- WhatsApp Web API - Direct message sending via wa.me links (no API key required)
- PDF generation capability (planned for budget exports)

**Session Management:**
- connect-pg-simple - PostgreSQL session store for Express sessions
- Session-based authentication pattern

**Form Validation:**
- Zod - Schema validation library
- @hookform/resolvers - Integration between React Hook Form and Zod

The application follows a monorepo structure with clear separation between client, server, and shared code, enabling full-stack type safety and code reuse.
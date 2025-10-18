# Zoom CRM - Comunicação Visual

## Overview

Zoom CRM is a custom customer relationship management system designed specifically for the visual communication industry. The application manages clients, budgets, sales pipeline (deals), products, and production workflows. Built as a full-stack web application, it provides an intuitive dashboard-style interface inspired by modern SaaS tools like Agendor, Linear, and Notion.

The system enables sales teams to:
- Track client relationships and communication history
- Create dynamic budgets with multiple line items and automatic calculations
- Manage deals through a visual Kanban-style pipeline with drag-and-drop
- Maintain a product/service catalog with flexible pricing models
- Monitor production workflow from awaiting to completion
- Generate and send budgets via WhatsApp and PDF

## Recent Implementation (Latest Session - Oct 18, 2025)

### ✅ Completed: Responsive Mobile Design

**Bottom Navigation for Mobile**
- Created `BottomNavigation` component with 6 main sections
- Fixed position at bottom with safe-area padding
- Active item highlighted with primary color
- Visible only on mobile (< 768px)
- Desktop shows traditional navbar

**Mobile-Optimized Pages (All Pages):**

1. **Produtos** - Product catalog optimized
   - Filters stack vertically on mobile
   - 1 column grid (mobile) → 2 (tablet) → 3 (desktop)
   - Full-width buttons on mobile
   - Reduced spacing and responsive typography

2. **Orçamentos** - Budget management mobile-ready
   - Full-width tabs with short labels ("Lista" / "Novo")
   - 1 column card grid on mobile
   - Compact spacing (gap-3 vs gap-4)
   - Mobile-friendly form layout

3. **Clientes** - Client list mobile-optimized
   - Search and buttons in vertical layout
   - Action buttons (WhatsApp/Timeline) flex equally on mobile
   - 1 column grid for client cards
   - Phone/email info in column layout

4. **Pipeline** - Kanban with horizontal scroll
   - Columns: 240px (mobile) → 280px (desktop)
   - Horizontal scroll enabled
   - Adjusted height: calc(100vh-350px) on mobile
   - Filter/view controls remain accessible
   - Compact stage titles with line-clamp

5. **Produção** - Production tracking mobile-friendly
   - Similar kanban layout to pipeline
   - Horizontal scroll for status columns
   - Compact card design
   - Full-width action buttons

6. **Dashboard** - Analytics optimized for small screens
   - All grids: 1 column (mobile) → responsive
   - Reduced padding: p-4 (mobile) → p-6 (desktop)
   - Smaller headings: text-base (mobile) → text-lg (desktop)
   - Charts stack vertically on mobile

**Responsive Patterns Applied:**
- Breakpoint: md (768px) for mobile/desktop switch
- Typography: text-2xl md:text-3xl for headings
- Spacing: gap-3 md:gap-4, space-y-4 md:space-y-6
- Buttons: w-full md:w-auto for CTAs
- Padding: p-4 md:p-6 for cards
- Layout: flex-col md:flex-row for filters/controls

**Bottom Navigation Design:**
- 6 icons: Dashboard, Clientes, Orçamentos, Pipeline, Produtos, Produção
- Height: h-16 (64px)
- Grid layout: grid-cols-6
- Safe area support for iOS notch
- Smooth transitions on active state

## Previous Session (Oct 17, 2025)

### ✅ Completed: List Views & Product Import

1. **Excel Product Import (348 products)**
   - Script: `scripts/import-products.ts`
   - Imported from: `tabela de valores_1760702151126.xlsx`
   - Mapping: Código, Categoria, Descrição, Unidade, Valor → Products table
   - Type detection: M² → m2, UN → fixed, outros → service

2. **Enhanced Product List** (/produtos)
   - Search by name, description, category
   - Filter by category (dynamic from products)
   - Filter by type (Por m², Valor Fixo, Serviço)
   - Card view with pricing and production time

3. **Budget List & Approval** (/orcamentos)
   - Tabs: "Lista de Orçamentos" + "Criar Novo"
   - Search by client or value
   - Status badges: Rascunho, Enviado, Aprovado, Rejeitado
   - "Aprovar Orçamento" button (visible only on draft)
   - Loading skeleton states
   - Error handling with toasts

4. **Fixed: Budget Approval Workflow**
   - Issue: dealId NOT NULL constraint failed for budgets without deals
   - Solution: Made `production.dealId` nullable in schema
   - Now supports: Approve budget → Create production (with or without deal)
   - Tested: End-to-end flow works perfectly

### CRM-Level Professional Features:
1. **Deep Data Model Integration**
   - Activities log (tracks all interactions: calls, emails, stage changes)
   - Tasks management (linked to deals with priorities and due dates)
   - Deal-Budget many-to-many relationship (dealBudgets junction table)
   - Deal Products tracking for complex quotes

2. **Unified Deal Workspace** (/deal/:id)
   - 4 tabs: Overview, Orçamentos, Tarefas, Timeline
   - Timeline shows all deal activities chronologically
   - Create budgets directly from deals with pre-filled data

3. **Composite Workflow Endpoints**
   - POST /api/deals/:dealId/create-budget - Creates budget from deal
   - POST /api/budgets/:budgetId/approve - Approves budget → Creates production
   - POST /api/deals/:dealId/move-stage - Moves deal stage + auto-logs activity

4. **Pipeline Enhancements**
   - Drag-and-drop between stages with automatic logging
   - Stale deal indicators (shows "Xd parado" badge for deals >7 days inactive)
   - Visual deal value and client name on cards

### Known Limitations & Next Steps:
- Client timeline: Route exists but needs UI polish
- Deal products: Backend ready but UI not implemented
- Tasks management: Backend complete but UI needed

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
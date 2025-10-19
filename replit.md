# Zoom CRM - Comunicação Visual

## Overview

Zoom CRM is a custom customer relationship management system designed for the visual communication industry. It manages clients, budgets, sales pipelines (deals), products, and production workflows with secure role-based authentication. This full-stack web application offers an intuitive dashboard-style interface, enabling sales teams to track client relationships, create dynamic budgets, manage deals via a visual Kanban board, maintain a product catalog, monitor production, and generate/send budgets via WhatsApp and PDF. The project aims to provide a comprehensive tool for streamlining visual communication business operations with enterprise-grade security, offering a comprehensive tool for managing business operations, from initial client contact to final production and delivery.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with React 18 and TypeScript, using Vite for development and bundling. It's a Single Page Application (SPA) utilizing Wouter for routing. UI components are developed with shadcn/ui (Radix UI primitives) and styled with Tailwind CSS, following a custom HSL-based color palette and Material Design influences. State management is handled by TanStack Query for server state and React hooks for local component state, with form handling via React Hook Form and Zod validation. Key design patterns include component composition, separation of concerns, and feature-based file organization.

### Backend Architecture

The backend is developed with Express.js and TypeScript, adhering to a RESTful API design. It uses Node.js and features resource-based endpoints for CRUD operations, with JSON for requests and responses. Express middleware handles logging and error management. The database layer uses Drizzle ORM for type-safe operations with PostgreSQL (Neon Serverless). A schema-first approach with Drizzle Kit for migrations ensures consistency. Data models include Users, Clients, Products, Budgets, Budget Items, Deals, and Production. Shared schema definitions and Zod schemas ensure full-stack type safety and code consistency.

### System Design Choices

The application implements a comprehensive authentication and authorization system based on user roles (Admin, Salesperson, Employee) with secure session management and endpoint protection. Key features include a product favoritos system for quick access to frequently used items, an optimized product search with type auto-completion for budget creation, and a detailed documentation system covering all functionalities. The PDF generation system includes a customizable HTML template editor with real-time preview, allowing users full control over the layout, variables, and styling of generated PDFs, including an image crop tool for logo uploads. The system also features deep data model integration for activities and tasks, a unified deal workspace with multiple tabs (Overview, Budgets, Tasks, Timeline), and composite workflow endpoints. The Pipeline offers drag-and-drop functionality with activity logging and indicators for stale deals. Responsive design is a core principle, with a mobile-first approach including a bottom navigation bar for small screens and optimized layouts across all pages. Budget configuration includes comprehensive fields for observations, payment terms, warranty, installation details, material, finishing, installation deadlines, and validity days.

## External Dependencies

-   **Database:** Neon Serverless PostgreSQL
-   **UI Components:** Radix UI, Lucide React (icons), date-fns, @hello-pangea/dnd (drag and drop)
-   **Form Validation:** Zod, @hookform/resolvers
-   **Session Management:** connect-pg-simple (PostgreSQL session store)
-   **Third-Party Integrations:** WhatsApp Web API (for sending messages), html2pdf.js, react-image-crop (for logo editing).
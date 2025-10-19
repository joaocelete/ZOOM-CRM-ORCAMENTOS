# Zoom CRM - Comunicação Visual

## Overview

Zoom CRM is a custom customer relationship management system designed for the visual communication industry. It manages clients, budgets, sales pipelines (deals), products, and production workflows. This full-stack web application offers an intuitive dashboard-style interface, enabling sales teams to track client relationships, create dynamic budgets, manage deals via a visual Kanban board, maintain a product catalog, monitor production, and generate/send budgets via WhatsApp and PDF. The project aims to provide a comprehensive tool for streamlining visual communication business operations.

## Recent Changes (Oct 19, 2025)

### ✅ Campo de Busca de Produtos com Auto-preenchimento de Tipo

**Seleção de Produtos Otimizada:**
- Substituído Select dropdown por Combobox pesquisável (Popover + Command)
- Campo de busca com filtro em tempo real por nome de produto
- Exibe categoria do produto abaixo do nome na lista
- Ícone de check marca o produto selecionado
- Suporta centenas de produtos sem perda de performance

**Auto-preenchimento de Tipo:**
- Tipo (M², Fixo, Serviço) é preenchido automaticamente do produto
- Campo de tipo se torna readonly/disabled após seleção
- Texto auxiliar: "O tipo vem do produto selecionado"
- Impede erros de seleção manual incorreta

**Experiência do Usuário:**
1. Clique em "Buscar produto..." abre popover
2. Digite para filtrar produtos
3. Selecione o produto da lista
4. Tipo é preenchido automaticamente
5. Popover fecha, campos prontos para preenchimento

**Componentes Utilizados:**
- `Popover` + `Command` do Shadcn UI
- Ícones: `ChevronsUpDown`, `Check`
- Estado de popover individual por item

**Arquivos Modificados:**
- `client/src/components/budget-creator.tsx` - Implementação completa

## Recent Changes (Oct 19, 2025)

### ✅ Documentação Completa do Sistema

**Arquivo Criado: DOCUMENTACAO.md**
- Documentação completa de todas as funcionalidades
- Guia detalhado de uso de cada módulo
- Explicação técnica da arquitetura
- Exemplos de código e uso
- Glossário de termos
- Cobertura de 100% das features

**Conteúdo da Documentação:**
- 📊 Dashboard - Métricas e visualizações
- 👥 Clientes - Gestão completa com timeline
- 💰 Orçamentos - Criação, edição, PDF
- 🎯 Pipeline - Kanban de vendas com 7 estágios
- 📦 Produtos - Catálogo com 3 tipos de precificação
- 🏭 Produção - Tracking por status
- ⚙️ Configurações - Empresa, logo, templates
- 📄 PDF - Sistema completo com preview
- 🏗️ Arquitetura - Stack e estrutura
- 🔌 API - Todos os endpoints

**Características:**
- Mais de 1000 linhas de documentação
- Exemplos práticos de uso
- Fluxos completos explicados
- Screenshots conceituais
- Formatação markdown profissional

## Recent Changes (Oct 19, 2025)

### ✅ Customizable HTML PDF Template System with Real-Time Preview

**Complete PDF Template Editor**
- Added `pdfTemplate` field to company settings schema for storing custom HTML templates
- Created default professional HTML/CSS template with full layout control
- Built template editor in Settings page with:
  - Syntax-highlighted textarea for HTML editing
  - Variable documentation showing all available placeholders
  - "Restore Default" button to reset template
  - **"Atualizar Preview" button for real-time preview**
  - **Collapsible preview area with iframe rendering**
- Integrated **html2pdf.js** library for efficient HTML→PDF conversion

**Real-Time Preview System**
- **Mock data system** (`client/src/lib/pdf-preview-data.ts`) with realistic budget example
- **Template compiler** that processes variables, conditionals, and loops
- **Live preview** updates when clicking "Atualizar Preview"
- **Merges form data** with mock data for accurate preview
- **Iframe rendering** shows compiled HTML exactly as it will appear in PDF
- **Collapsible interface** to show/hide preview
- **Toast notifications** for user feedback

**Template Features:**
- Full HTML/CSS control over PDF layout (spacing, colors, boxes, positioning)
- Handlebars-like variable system: `{{companyName}}`, `{{budgetNumber}}`, `{{clientName}}`, etc.
- Support for conditionals: `{{#if variable}}...{{/if}}`
- Support for loops: `{{#each items}}...{{/each}}`
- Professional default template with company branding, responsive tables, modern styling
- Users can customize everything: margins, padding, fonts, colors, section layout

**Technical Implementation:**
- `client/src/lib/default-pdf-template.ts` - Default HTML template with CSS
- `client/src/lib/html-pdf-generator.ts` - Template compiler and PDF generator with 15mm margins
- `client/src/lib/pdf-preview-data.ts` - Mock data for realistic preview
- `client/src/pages/settings.tsx` - Template editor with preview interface
- `client/src/pages/orcamentos.tsx` - Updated to use new HTML PDF generator
- Database migration added `pdf_template` column to `company_settings` table

**PDF Layout Configuration:**
- **15mm margins** on all sides (top, right, bottom, left)
- **Content centered** with max-width of 180mm
- **Logo properly displayed** in header using {{logo}} variable
- Professional spacing and alignment throughout document

**Benefits:**
- **Instant visual feedback** while editing templates
- **Proper margins and centering** for professional PDFs
- **Logo integration** from company settings
- Users have complete control over PDF appearance
- See exactly how PDF will look before saving
- Easier to maintain and customize than programmatic PDF generation
- Better performance with html2pdf.js

## Previous Changes (Oct 18, 2025)

### ✅ Image Crop Tool & Redesigned PDF Layout

**Image Crop Tool for Logo Upload**
- Added `react-image-crop` library for professional logo editing
- New `ImageCropDialog` component with intuitive cropping interface
- Integrated into Settings page - opens automatically after logo upload
- Users can crop logo to desired size before saving
- Cropped image stored as base64 in company settings
- Improved logo quality in PDFs with custom cropping

**Redesigned PDF Layout**
- **Removed black box** from header - cleaner, more professional look
- **Logo increased to 50×40px** - prominently displayed and centered at top
- Simplified header with yellow accent bar
- Centered "ORÇAMENTO" title with elegant typography
- Budget info displayed in single line with bullet separators
- Cleaner overall structure with better visual hierarchy
- Logo-first design emphasizing company branding

**Files Modified:**
- `client/src/components/image-crop-dialog.tsx` - New crop component
- `client/src/pages/settings.tsx` - Integrated crop dialog on upload
- `client/src/lib/pdf-generator.ts` - Redesigned header layout with larger centered logo
- `package.json` - Added react-image-crop dependency

### ✅ Enhanced Budget Configuration & Professional PDF

**8 New Configurable Budget Fields:**
- observations, paymentTerms, warranty, installationIncluded, material, finishing, installationDeadline, validityDays
- Collapsible "Configurações Adicionais" section in budget form
- All fields properly saved/loaded in edit mode
- PDF generator dynamically displays all custom fields

### ✅ Budget Edit & Delete & PDF Fix

**Budget Management:**
- Edit functionality with item loading
- Delete with confirmation dialog
- PDF generation now correctly fetches budget items before rendering

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with React 18 and TypeScript, using Vite for development and bundling. It's a Single Page Application (SPA) utilizing Wouter for routing. UI components are developed with shadcn/ui (Radix UI primitives) and styled with Tailwind CSS, following a custom HSL-based color palette and Material Design influences. State management is handled by TanStack Query for server state and React hooks for local component state, with form handling via React Hook Form and Zod validation. Key design patterns include component composition, separation of concerns, and feature-based file organization.

### Backend Architecture

The backend is developed with Express.js and TypeScript, adhering to a RESTful API design. It uses Node.js and features resource-based endpoints for CRUD operations, with JSON for requests and responses. Express middleware handles logging and error management. The database layer uses Drizzle ORM for type-safe operations with PostgreSQL (Neon Serverless). A schema-first approach with Drizzle Kit for migrations ensures consistency. Data models include Users, Clients, Products, Budgets, Budget Items, Deals, and Production. Shared schema definitions and Zod schemas ensure full-stack type safety and code consistency.

### System Design Choices

The application implements several professional features, including deep data model integration for activities and tasks, a unified deal workspace with multiple tabs (Overview, Budgets, Tasks, Timeline), and composite workflow endpoints for actions like creating budgets from deals or approving budgets to create production records. The Pipeline features drag-and-drop functionality with activity logging and indicators for stale deals. Responsive design is a core principle, with a mobile-first approach including a bottom navigation bar for small screens and optimized layouts across all pages, dynamically adjusting grids, typography, and spacing based on screen size (mobile, tablet, desktop). Budget configuration includes comprehensive fields for observations, payment terms, warranty, installation details, material, finishing, installation deadlines, and validity days. PDF generation is highly professional, dynamically integrating company settings, budget details, client data, technical specifications, and commercial conditions.

## External Dependencies

-   **Database:** Neon Serverless PostgreSQL
-   **UI Components:** Radix UI, Lucide React (icons), date-fns, @hello-pangea/dnd (drag and drop)
-   **Form Validation:** Zod, @hookform/resolvers
-   **Session Management:** connect-pg-simple (PostgreSQL session store)
-   **Third-Party Integrations:** WhatsApp Web API (for sending messages), PDF generation libraries (for budget exports).
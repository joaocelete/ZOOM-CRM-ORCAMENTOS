# Design Guidelines: Zoom Comunicação Visual CRM

## Design Approach

**Selected Approach:** Modern Dashboard Design System with Material Design influences

This CRM system requires a **utility-first, data-focused design** optimized for productivity and efficiency. Drawing from successful SaaS applications like Linear, Notion, and modern admin dashboards, with Material Design principles for information hierarchy and interaction patterns.

**Key Design Principles:**
- Information density without clutter
- Clear visual hierarchy for quick scanning
- Efficient workflows with minimal clicks
- Consistent interaction patterns across modules
- Professional aesthetic suitable for B2B software

---

## Core Design Elements

### A. Color Palette

**Brand & Primary Colors:**
- Primary Yellow: `45 100% 50%` (Zoom brand #FFD200)
- Primary Yellow Hover: `45 100% 45%`
- Primary Dark: `220 25% 15%` (dark backgrounds, headers)
- Primary Slate: `220 15% 25%` (secondary dark elements)

**Semantic Colors:**
- Success: `142 76% 36%` (completed, approved)
- Warning: `38 92% 50%` (pending, follow-up)
- Error: `0 84% 60%` (overdue, rejected)
- Info: `217 91% 60%` (informational states)

**Neutral Palette:**
- Background Light: `220 15% 98%`
- Background Card: `0 0% 100%`
- Border Light: `220 13% 91%`
- Text Primary: `220 25% 15%`
- Text Secondary: `220 9% 46%`
- Text Muted: `220 9% 65%`

**Dark Mode:**
- Background Dark: `220 25% 12%`
- Card Dark: `220 20% 16%`
- Border Dark: `220 15% 25%`
- Text Dark Primary: `220 15% 95%`

---

### B. Typography

**Font Families:**
- Primary: 'Inter', system-ui, sans-serif (UI elements, data)
- Secondary: 'Poppins', sans-serif (headings, emphasis)

**Type Scale:**
- Display (h1): 2.5rem (40px), font-weight 700, Poppins
- Heading 1 (h2): 2rem (32px), font-weight 600, Poppins
- Heading 2 (h3): 1.5rem (24px), font-weight 600, Inter
- Heading 3 (h4): 1.25rem (20px), font-weight 600, Inter
- Body Large: 1rem (16px), font-weight 400, Inter
- Body: 0.875rem (14px), font-weight 400, Inter
- Caption: 0.75rem (12px), font-weight 400, Inter
- Label: 0.75rem (12px), font-weight 500, Inter (uppercase)

**Line Heights:**
- Headings: 1.2
- Body text: 1.5
- Data tables: 1.4

---

### C. Layout System

**Spacing Primitives:**
Use Tailwind units: **1, 2, 3, 4, 6, 8, 12, 16, 20, 24**
- Component padding: p-4 to p-6
- Section spacing: py-8 to py-12
- Card gaps: gap-4 to gap-6
- Form field spacing: space-y-4

**Grid System:**
- Sidebar: 280px fixed width (desktop), collapsible mobile
- Main content: flex-1 with max-w-7xl container
- Cards grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Dashboard metrics: grid-cols-2 lg:grid-cols-4

**Container Widths:**
- Full app: 100vw with sidebar
- Content area: max-w-7xl mx-auto px-6
- Forms: max-w-2xl
- Modals: max-w-4xl

---

### D. Component Library

**Navigation:**
- Sidebar: Fixed left, dark background (220 25% 15%), yellow accent for active items
- Top bar: White background, client search, user profile dropdown
- Breadcrumbs: Text-sm with chevron separators

**Data Display:**
- Tables: Striped rows, hover states, sticky headers, 14px font
- Cards: White background, border, rounded-lg, shadow-sm, p-6
- Kanban columns: Rounded borders, light gray backgrounds, header with count badges
- Status badges: Rounded-full, px-3 py-1, colored backgrounds with opacity

**Forms & Inputs:**
- Text fields: Border, rounded-md, p-3, focus:ring-2 yellow
- Select dropdowns: Custom styled with chevron icon
- Dynamic item containers: Bordered sections with remove button, gap-4 between items
- Add item button: Dashed border, yellow text, hover:bg-yellow-50

**Buttons:**
- Primary: Yellow background, dark text, rounded-md, px-4 py-2, hover:opacity-90
- Secondary: White with border, hover:bg-gray-50
- Danger: Red-600 background, white text
- Icon buttons: p-2, rounded-md, hover:bg-gray-100

**Kanban Cards:**
- White background, shadow-sm, rounded-lg, p-4
- Draggable indicator on hover
- Client name (font-semibold), value (text-lg), status dot
- Footer with actions and timestamp

**Modals & Overlays:**
- Overlay: bg-black/50 backdrop-blur-sm
- Modal: max-w-2xl to max-w-4xl, rounded-xl, shadow-2xl
- Header: border-b, pb-4, with close button
- Actions: Footer with border-t, pt-4, buttons right-aligned

**Dashboard Widgets:**
- Metric cards: Icon (yellow circle bg), label, large number, trend indicator
- Charts: Chart.js with yellow/gray color scheme, rounded bars
- Recent activity: Timeline with dots and connecting lines

---

### E. Animations

**Micro-interactions Only:**
- Button hover: opacity transition 150ms
- Card hover: shadow transition 200ms
- Kanban drag: scale(1.02) + shadow
- Modal entry: opacity + scale from 0.95, 200ms
- Toast notifications: slide-in from top-right

**No Decorative Animations**

---

## Page-Specific Guidelines

**Dashboard:**
- 4-column metrics grid at top
- Sales funnel visualization (horizontal bars)
- Recent activities timeline on right sidebar
- Quick actions floating button (bottom-right)

**Budget Creator:**
- Two-column layout: Client info (left 1/3), Items (right 2/3)
- Dynamic item containers with visual separation
- Sticky footer with totals and actions
- Auto-save indicator in header

**Kanban Pipeline:**
- Horizontal scrolling columns
- Column headers: count + total value
- Cards: compact but readable, key info only
- Filter bar above columns (status, assignee, date range)

**Client Management:**
- Search bar with filters (city, status)
- Table view with sortable columns
- Quick actions on row hover
- Bulk selection for mass operations

---

## Images & Icons

**Icons:**
Use Heroicons (outline for navigation, solid for status)
- Navigation: outline style, 24px
- Buttons: solid style, 20px
- Tables: outline style, 16px

**No Hero Images** - This is a business application, not marketing
**Avatars:** Circle, 40px for users, initials fallback
**Product images:** Square thumbnails, 80px in tables, 200px in details

---

## Accessibility & Interactions

- Focus states: 2px yellow ring offset
- Keyboard navigation: visible focus, logical tab order
- Color contrast: WCAG AAA for text, AA for UI elements
- Touch targets: minimum 44px for mobile
- Dark mode: full support with proper contrast ratios
- Loading states: Skeleton screens for tables, spinner for actions
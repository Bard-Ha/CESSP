# CESSP Design Guidelines

## Design Approach

**Selected Approach**: Hybrid - Custom scientific aesthetic inspired by **Linear's precision + Vercel's technical elegance + NASA/SpaceX mission control aesthetics**

**Rationale**: CESSP is a specialized scientific tool requiring both functional clarity and visual impact. The futuristic lab aesthetic demands custom elements while maintaining professional usability standards for researchers.

**Core Principles**:
- Scientific precision with visual drama
- Information density without clutter
- Futuristic aesthetics serving functionality
- High-contrast readability for data-heavy interfaces

---

## Typography System

**Font Families**:
- **Primary (UI/Body)**: Inter (via Google Fonts) - weights 400, 500, 600
- **Display (Headers)**: Space Grotesk (via Google Fonts) - weights 500, 700
- **Monospace (Code/Data)**: JetBrains Mono - weight 400

**Hierarchy**:
- Hero Headlines: `text-6xl md:text-7xl font-bold tracking-tight` (Space Grotesk)
- Section Titles: `text-3xl md:text-4xl font-bold` (Space Grotesk)
- Card Headers: `text-xl font-semibold` (Inter)
- Body Text: `text-base leading-relaxed` (Inter)
- Labels/Captions: `text-sm font-medium tracking-wide uppercase` (Inter)
- Code/Values: `text-sm font-mono` (JetBrains Mono)

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16** for consistency
- Component padding: `p-6` or `p-8`
- Section spacing: `space-y-8` or `space-y-12`
- Card gaps: `gap-6`
- Container margins: `mx-auto max-w-7xl px-6`

**Grid Structures**:
- Dashboard layout: 12-column grid with `grid-cols-12`
- Data cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Sidebar + Main: `grid-cols-[240px_1fr]` for desktop navigation

**Container Strategy**:
- Full-width sections: `w-full` with inner `max-w-7xl`
- Content areas: `max-w-6xl`
- Reading content: `max-w-3xl`

---

## Component Library

### Hero Section (3D Molecule Display)
- Full viewport height: `h-screen`
- 3D canvas background with React-Three-Fiber
- Centered content overlay with glass-morphism panel
- CTA buttons with backdrop blur: `backdrop-blur-md bg-white/10`
- Particle system overlay (subtle, non-distracting)

### Navigation
- Fixed top bar: `h-16 backdrop-blur-lg`
- Left sidebar for dashboard: `w-60 border-r`
- Icon + label pattern for nav items
- Active state with glow indicator

### Upload Interface
- Large dropzone area: `min-h-[400px] border-2 border-dashed rounded-2xl`
- File format indicators with icons (Heroicons CDN)
- Preview panel with 3D structure viewer
- Progress indicators with animated bars

### Dashboard Cards
- Glass-morphism style: `backdrop-blur-md rounded-xl border`
- Padding: `p-6`
- Shadow: `shadow-2xl`
- Hover elevation: `hover:scale-[1.02] transition-transform`

### Data Visualization Panels
- Full-bleed Plotly charts within card containers
- Legend positioning: bottom or right side
- Interactive tooltips enabled
- Height: `h-[400px]` for primary charts, `h-[300px]` for secondary

### Prediction Results Display
- Metric cards in grid: `grid-cols-2 md:grid-cols-4 gap-4`
- Large value display: `text-4xl font-bold font-mono`
- Unit labels: `text-sm uppercase tracking-wider`
- Uncertainty indicators with visual bars

### Dataset Explorer Table
- Sticky header: `sticky top-0`
- Row hover states with smooth transitions
- Sortable columns with arrow indicators (Heroicons)
- Pagination controls at bottom
- Compact density: `py-3 px-4` for cells

### Monaco Code Editor Integration
- Contained in card: `rounded-lg overflow-hidden`
- Min height: `min-h-[500px]`
- Syntax highlighting for SMILES/structure formats
- Line numbers enabled

### Forms & Inputs
- Input fields: `h-12 px-4 rounded-lg border focus:ring-2`
- Select dropdowns: Match input styling
- Checkboxes/Radio: Custom styled with Heroicons check icons
- Button heights: `h-12` (primary), `h-10` (secondary)

### Buttons
- Primary: Large, bold with glow effect simulation via shadows
- Secondary: Outlined style
- Icon buttons: `w-10 h-10 rounded-lg` with centered icon
- All buttons include backdrop blur when on hero: `backdrop-blur-md`

---

## Animation Strategy

**Minimal, purposeful animations only:**
- Page transitions: Subtle fade-in (200ms)
- Card hover: Scale transform only `hover:scale-[1.02]`
- 3D hero molecule: Slow continuous rotation (30s loop)
- Loading states: Simple spinner or pulse
- No scroll-triggered animations
- No parallax effects

**Critical**: Keep animations under control - this is a scientific tool, not a marketing site.

---

## Icons

**Library**: Heroicons (via CDN - Outline style for navigation, Solid for actions)

**Usage**:
- Navigation items: 20px size
- Action buttons: 16px size
- Status indicators: 12px size
- File format badges: 24px size

---

## Images

### Hero Section
- **3D Molecule Canvas**: React-Three-Fiber rendered molecule (not static image) as background
- Canvas covers full viewport with transparent overlay for UI elements
- No traditional hero image - 3D interactive visualization serves this purpose

### Dataset Cards
- Placeholder molecular structure thumbnails (generated via structure viewer)
- Aspect ratio: `aspect-square` for consistency
- Size: `w-full h-48` for preview cards

### About/Documentation Pages
- Optional scientific imagery (lab equipment, energy storage concepts)
- If used: `rounded-xl` with `aspect-video`

---

## Page Layouts

### Landing Page
- 3D Hero (full viewport)
- Features grid (3 columns)
- Capabilities showcase (2-column split: text + visualization)
- CTA section with upload prompt

### Dashboard
- Left sidebar navigation (fixed)
- Main content area with cards grid
- Top action bar with search/filters
- Results panel (expandable)

### Prediction View
- Split layout: Input (left) + Results (right) on desktop
- Stacked on mobile
- Live prediction status banner at top
- Visualization panel below results

### Dataset Explorer
- Full-width table
- Filter sidebar (collapsible)
- Pagination controls
- Detail modal for selected materials

---

## Key Distinctions

- **Glass-morphism** throughout for cards and overlays
- **Monospace fonts** for all numerical/scientific data
- **Grid-based precision** - everything aligns to 8px grid
- **High contrast** text on panels for readability
- **Functional first** - aesthetics enhance, don't obscure data
- **No decorative gradients** - use for functional purposes only (depth, emphasis)

---

This design creates a **professional scientific platform** with futuristic visual flair while maintaining clarity and usability for researchers working with complex materials data.
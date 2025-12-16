# CESSP - Chemical Energy Storage System Predictor

## Overview

CESSP is a scientific web platform for predicting and discovering energy storage materials using AI-powered predictions. The application enables users to upload material structures (CIF, POSCAR, SMILES, JSON), visualize them in 3D, run predictions with a physics-informed Graph Neural Network backend, explore materials datasets, and generate hypothetical new compounds.

The platform targets both domain experts and non-specialists, providing intuitive interfaces for material property prediction and discovery. It features a futuristic lab aesthetic with 3D molecular visualizations, animated particle backgrounds, and a modern dark/light theme system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom configuration for path aliases (@/, @shared/, @assets/)
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state and data fetching
- **Styling**: Tailwind CSS with CSS variables for theming, supporting dark/light modes
- **UI Components**: shadcn/ui component library (Radix UI primitives with custom styling)
- **3D Visualization**: React Three Fiber with Three.js and Drei helpers for molecular structures
- **Charts**: Plotly.js for scientific data visualization
- **Code Editor**: Monaco Editor for structure file editing

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful JSON API under /api prefix
- **Build**: esbuild for server bundling, Vite for client

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: shared/schema.ts (shared between client and server)
- **Validation**: Zod schemas with drizzle-zod integration
- **Storage Abstraction**: IStorage interface in server/storage.ts with in-memory implementation (MemStorage) that can be swapped for database-backed storage

### Key Design Patterns
- **Shared Types**: Schema definitions in shared/ directory accessible by both client and server
- **API Client**: Centralized fetch wrapper in lib/queryClient.ts with error handling
- **Component Structure**: Feature components in components/, UI primitives in components/ui/
- **Page-Based Routing**: Each route maps to a page component in pages/

### Main Application Pages
1. **Home** - Hero section with 3D molecule visualization and entry points
2. **Material Predictor** - Upload a material formula to predict its properties
3. **Material Finder** - Specify desired properties to find matching materials
4. **Upload** - File upload for CIF, POSCAR, SMILES, JSON formats
5. **Predict** - Advanced prediction interface for uploaded materials
6. **Dataset** - Browse and explore the materials database
7. **Generate** - AI-powered generation of hypothetical materials

## External Dependencies

### Database
- **PostgreSQL**: Primary database (configured via DATABASE_URL environment variable)
- **Drizzle Kit**: Database migrations and schema management

### Frontend Libraries
- **@react-three/fiber** & **@react-three/drei**: 3D rendering for molecular visualizations
- **react-plotly.js**: Scientific charting and data visualization
- **@monaco-editor/react**: Code editor for structure files
- **react-dropzone**: File upload handling
- **react-hook-form**: Form state management with zod validation

### UI Framework
- **Radix UI**: Accessible component primitives (dialog, dropdown, tabs, etc.)
- **class-variance-authority**: Component variant management
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Development server with HMR
- **@replit/vite-plugin-***: Replit-specific development plugins
- **tsx**: TypeScript execution for Node.js

### Fonts (Google Fonts)
- **Inter**: Primary UI/body font
- **Space Grotesk**: Display/header font
- **JetBrains Mono**: Monospace for code/data
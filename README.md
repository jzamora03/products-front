# Products Catalog — Frontend

React 18 + TypeScript frontend for the Products Catalog API. Built with Vite, Axios, and a clean component architecture.

---

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — dev server and bundler
- **Axios** — HTTP client with interceptors
- **CSS Variables** — custom design system, no UI library

---

## Project Structure

```
src/
├── api/
│   └── products.ts        # Axios instance + productsApi + categoriesApi
├── components/
│   ├── CreateProductModal.tsx
│   ├── EditProductModal.tsx
│   └── ConfirmDialog.tsx
├── hooks/
│   ├── useProducts.ts     # Data fetching with loading/error states
│   └── useDebounce.ts     # 300ms debounce for search
├── types/
│   ├── product.ts
│   ├── category.ts
│   ├── pagination.ts
│   └── index.ts           # Barrel export
├── App.tsx
└── App.css
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- The Laravel API running on `http://localhost:8000`

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root of the frontend project:

```env
VITE_API_URL=http://localhost:8000/api
VITE_API_TOKEN=mytoken123
```

### Run Development Server

```bash
npm run dev
```

App available at: `http://localhost:5173`

---

## Features

- **Product table** — name, SKU, price, stock with color-coded badges, category
- **Real-time search** — debounced 300ms, filters by name or SKU
- **Pagination** — 10 products per page, previous/next navigation
- **Create product** — modal form with frontend validation
- **Edit product** — pre-filled modal, validates before submitting
- **Delete product** — confirmation dialog before soft-deleting
- **Loading state** — spinner while fetching
- **Error state** — message when API is unreachable

---

## Design Decisions

**Types in `src/types/`** — all TypeScript interfaces live in their own files, separate from API logic. This makes them reusable across components without circular dependencies.

**Barrel export (`types/index.ts`)** — single import point for all types: `import type { Product, Category } from '../types'`.

**`categoriesApi` separate from `productsApi`** — each resource has its own API object. Easier to extend and test independently.

**Environment variables** — API URL and token come from `.env`, never hardcoded. Swap environments without touching source code.

**`useProducts` hook** — encapsulates all data fetching logic. Components stay clean and focused on rendering.
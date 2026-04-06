# Mathem Solvex - Student Portal (Next.js)

Mathem Solvex is a premium, high-performance web application designed for MCA entrance aspirants (NIMCET, CUET-PG, etc.). It provides a comprehensive library of over 17 years of Previous Year Questions (PYQs) with expert video solutions and a realistic mock test environment.

This project is the **Frontend only**, built with **Next.js 15+ (App Router)** and optimized for SEO and premium UX.

## 🔗 Project Links
- **Backend API:** [MATHEM SOLVEX BACKEND](https://github.com/AVPXM8/Mathem-Solvex-Updated/tree/main/backend)
- **Admin Dashboard:** [MATHEM SOLVEX ADMIN](https://github.com/AVPXM8/Mathem-Solvex-Updated/tree/main/admin)

## 🚀 Core Features
- **Comprehensive PYQ Library:** Search and filter thousands of questions by exam, subject, topic, and year.
- **Premium UX/UI:** Advanced animations, glassmorphism, and a responsive bento-grid layout.
- **Full-Screen Test Environment:** A distraction-free "Exam Mode" with mobile-optimized controls and a question palette.
- **Advanced SEO:** 
  - Dynamic `sitemap.xml` for all question and article routes.
  - JSON-LD Structured Data (Quiz, Article, Organization, WebSite).
  - Breadcrumb navigation with schema.org support.
- **MathJax Integration:** High-quality LaTeX rendering for mathematical formulas across the portal.
- **AI Tutor Integration:** Context-aware AI assistance for solving complex problems.

## 📂 Project Structure (Frontend)
```markdown
student-next/
├── app/                  # Next.js App Router (File-based Routing)
│   ├── (auth)/           # Authentication routes (if applicable)
│   ├── about/            # About Us page
│   ├── articles/         # Blog / Exam News (with [slug] dynamic routing)
│   ├── questions/        # PYQ Library (with [id] dynamic routing)
│   ├── resources/        # PYQ Paper Downloads
│   ├── results/          # Hall of Fame / Star Students
│   ├── test/             # Mock Test Exam Environment
│   ├── globals.css       # Global design tokens & utility classes
│   ├── layout.js         # Root layout with common SEO/Scripts
│   └── page.js           # Homepage entry point
├── components/           # Reusable UI Components
│   ├── Breadcrumb.jsx    # SEO-friendly breadcrumb with JSON-LD
│   ├── MathPreview.jsx   # LaTeX/MathJax renderer component
│   ├── Header.jsx        # Navigation & Branding
│   ├── Footer.jsx        # Site footer
│   └── ...               # Various UI widgets
├── hooks/                # Custom React Hooks
│   ├── useMathJax.js     # Hook for triggering MathJax typesetting
│   └── ...
├── utils/                # Utility functions & helpers
├── api.js                # Axios instance with Base URL config
├── public/               # Static assets (images, icons)
└── next.config.mjs       # Next.js optimization & configuration
```

## 🔄 Data Flow
The frontend communicates with the **Node.js/Express Backend** via a RESTful API:
1. **Dynamic Metadata:** Server-side functions (`generateMetadata`) fetch data from the API during request time to build SEO tags.
2. **Client-Side Hydration:** Components use `api.js` (Axios) to fetch real-time data for search, filters, and exam status.
3. **Sitemap Generation:** The `sitemap.js` file calls a specific backend endpoint `/api/sitemap-urls` to fetch all database IDs for automatic search engine indexing.

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js 18.x or higher
- NPM or PNPM

### 2. Environment Setup
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
```

### 3. Installation
```bash
npm install
```

### 4. Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

### 5. Production Build
```bash
npm run build
npm run start
```

## 📈 SEO & Performance
- **Image Optimization:** Uses `next/image` for automatic WebP conversion and lazy loading.
- **Static Generation:** Critical pages like About and Article lists are statically optimized.
- **Inter-linking:** sidebar widgets and breadcrumbs ensure high link equity across the portal.

---
© 2025 Maarula Classes - Mathem Solvex. All rights reserved.

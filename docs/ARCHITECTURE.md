# CampusHub — Technical Architecture (ARCHITECTURE.md)

## 1. Architectural Overview

CampusHub is structured as a modern web application built on **Next.js (App Router)** and **TypeScript**, styled with **Tailwind CSS**. It follows a modular, layer-separated architecture prioritizing cinematic atmospheric visuals, mobile responsiveness, high performance, maintainability, and data security.

```
┌────────────────────────────────────────────────────────┐
│                   Next.js App Router                   │
│         (Server & Client Components / Layouts)         │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                    Component Layer                     │
│  ┌───────────────┬────────────────┬─────────────────┐  │
│  │ components/ui │ components/    │ components/home │  │
│  │ (Atomic)      │ layout         │ (Cinematic Hub) │  │
│  └───────────────┴────────────────┴─────────────────┘  │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                  Application Utilities                 │
│         lib/ (themes.ts, mockData.ts, utils.ts)        │
│         types/ (Data Contracts & Theme Models)         │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│              Data & Persistence Strategy               │
│  - Phase 1 (Foundation & Prototype): Dynamic Mock Data │
│  - Phase 2 (Planned): Supabase Free Tier (Auth & DB)   │
│    * Row Level Security (RLS) enabled                  │
│    * Isolated anonymous views / sanitized RPCs         │
└────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure & Conventions

```text
CampusHub/
├── app/                  # Next.js App Router pages, layouts, and global styles
│   ├── globals.css       # Global design tokens, keyframes, and reduced-motion rules
│   ├── layout.tsx        # Root HTML wrapper with metadata & viewport
│   └── page.tsx          # Cinematic interactive homepage prototype
├── components/           # Reusable UI component library
│   ├── ui/               # Core atomic primitives (Button, Card, Badge, etc.)
│   ├── layout/           # App chrome & navigation (Header, Footer)
│   ├── shared/           # Compound feature-agnostic components
│   └── home/             # Homepage atmospheric & interactive modules
│       ├── BackgroundAtmosphere.tsx # Multi-layer GPU-friendly night & castle scene
│       ├── HeroBanner.tsx           # Personalized welcome & motto
│       ├── WorldExplorer.tsx        # Interactive constellation trail & trigger
│       ├── AttendanceCard.tsx       # Circular radial attendance & bunk gauge
│       ├── CanteenCard.tsx          # Canteen special discovery preview
│       ├── OwlPostCard.tsx          # Anonymous confession wall preview
│       ├── CommonRoomCard.tsx       # Mini-games & breakroom preview
│       ├── QuoteBanner.tsx          # Dynamic atmospheric scholarly quote banner
│       └── AmbientControls.tsx      # Music toggle, volume, and Chamber theme selector
├── docs/                 # Product specifications, architecture, and guides
│   ├── PROJECT_SPEC.md   # Feature requirements and product roadmap
│   └── ARCHITECTURE.md   # Architectural blueprint and technical design
├── lib/                  # Utilities, formatters, and constants
│   ├── mockData.ts       # Dynamic mock user, navigation, and dashboard datasets
│   ├── themes.ts         # Scalable Chamber theme registry (5 Chambers)
│   └── utils.ts          # Core helpers (e.g., class name combinator)
├── public/               # Static assets (favicons, illustrations, vector icons)
├── types/                # Global TypeScript definitions and domain models
│   └── index.ts          # Central type exports
├── .env.example          # Template for required environment variables
├── PROJECT_RULES.md      # Engineering and aesthetic standards
└── README.md             # Project introduction, setup, and run instructions
```

---

## 3. Design System & Theming Architecture

### 3.1 Aesthetic Concept: Magical Academia
The design avoids generic SaaS tropes (e.g. flat blue cards, oversaturated neon blobs, illegible heavy frosted glass) and instead uses an enchanted scholarly motif:
- **Surface Palette**: Rich Obsidian (`#060b13`), Deep Twilight (`#080e16`), and Warm Ivory Parchment.
- **Accents**: Gilded Amber (`#c69b3f`), Herbology Emerald (`#10b981`), Sapphire Azure (`#38bdf8`), and Ruby Crimson (`#e11d48`).
- **Borders & Elevation**: Subtle illuminated amber/gold borders (`border-amber-500/20`) and soft emerald focus rings.

### 3.2 Common Room Chamber Themes (`lib/themes.ts`)
The architecture supports 5 swappable chambers without rewriting components:
1. **Midnight Castle** (Default Grand Citadel)
2. **Crimson Chamber** (Ruby Flame & Hearth)
3. **Emerald Chamber** (Mystic Emerald & Alchemy)
4. **Azure Chamber** (Celestial Sapphire Observatory)
5. **Golden Chamber** (Harvest Amber & Loyalty)

---

## 4. Performance & Motion Strategy
- **Layered Lightweight Animations**: SVG silhouettes, CSS keyframe transforms, and opacity transitions.
- **Accessibility (`prefers-reduced-motion`)**: All animations automatically scale down to static positions if reduced motion is requested.
- **Tab Invisibility Throttling**: Animation hooks pause when `document.visibilityState === "hidden"`.

---

## 5. Free-Tier & Open-Source Stack
- **Frontend**: Next.js App Router + TypeScript
- **Styling**: Tailwind CSS v4 + Lucide Icons
- **Hosting**: Free tiers (Vercel / Cloudflare Pages / Netlify)
- **Zero Paid APIs**: 100% free-tier compatible

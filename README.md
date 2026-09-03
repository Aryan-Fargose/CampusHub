# 🏰 CampusHub

> **An enchanted, magical-academia inspired student companion web application.**

CampusHub transforms collegiate daily routines into a delightful scholarly adventure — combining academic tracking, campus dining discovery, anonymous student confessions, and recreational mini-games.

---

## 🔮 Highlights & Planned Features

- 📜 **Attendance Oracle**: Effortless attendance tracking with predictive bunking & threshold calculations.
- 🍲 **Canteen Grimoire**: Daily menu discovery, price guides, and crowd trackers for campus canteens.
- 🦉 **The Owl Post**: Safe, anonymous campus confession wall with zero identity exposure.
- ⚔️ **Arcane Breakroom**: Casual mini-games and puzzles designed for quick study breaks.
- 📱 **Mobile-First & Lightweight**: Fast, fluid, and responsive on all devices.
- 🍃 **100% Free & Open-Source**: Engineered to run entirely within free tiers.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server & Client Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Linter**: [ESLint](https://eslint.org/)

---

## 📂 Project Structure

```text
CampusHub/
├── app/                  # App router routes, layouts, and global styles
│   ├── globals.css       # Magical-academia design tokens and base styles
│   ├── layout.tsx        # Root HTML shell & metadata
│   └── page.tsx          # Welcome portal
├── components/           # Component library
│   ├── ui/               # Atomic UI components (Button, Card, Badge, etc.)
│   ├── layout/           # App shell components (Header, Footer, Navigation)
│   └── shared/           # Cross-cutting composite components
├── docs/                 # Documentation & architectural specs
│   ├── PROJECT_SPEC.md   # Feature breakdown and product specification
│   └── ARCHITECTURE.md   # Architectural blueprint and technical design
├── lib/                  # Utilities, formatters, and constants
│   └── utils.ts          # Classname helper and general utilities
├── public/               # Static assets, icons, and illustrations
├── types/                # Shared TypeScript contracts and interfaces
│   └── index.ts          # Core type exports
├── .env.example          # Environment variable template
├── PROJECT_RULES.md      # Development rules and architectural constraints
└── README.md             # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.17.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Local Setup

1. **Clone or navigate to the repository:**
   ```bash
   cd CampusHub
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up local environment variables (optional for development):**
   ```bash
   cp .env.example .env.local
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view CampusHub.

---

## 📜 Development Guidelines

Please review [PROJECT_RULES.md](./PROJECT_RULES.md) before contributing code. All contributions must adhere to:
- Strict TypeScript typing (no `any`).
- Mobile-first responsive styling.
- Minimal dependencies policy.
- Privacy preservation for anonymous content.
- Clean component separation (`components/ui`, `components/layout`, `components/shared`).

---

## 📜 License

MIT License. Designed with ✨ for students everywhere.

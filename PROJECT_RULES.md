# CampusHub Project Rules & Engineering Guidelines

This document defines the strict engineering standards, architectural decisions, and design principles for **CampusHub**. All contributors and AI assistants must follow these rules without exception.

---

## 1. Technical & Code Standards

- **TypeScript Throughout**: 
  - Every file must be written in TypeScript (`.ts` / `.tsx`).
  - Do not use `any`. Use strict types, interfaces, generics, and discriminated unions.
  - Define domain types inside `@/types` and reusable component prop types alongside components.

- **Mobile-First Responsive Design**:
  - Build for mobile viewports (360px–414px) first, then scale up using Tailwind responsive modifiers (`sm:`, `md:`, `lg:`, `xl:`).
  - Ensure touch targets are at least 44x44px.
  - Test layouts across mobile, tablet, and desktop viewports.

- **Modular & Reusable Components**:
  - Place atomic UI elements in `components/ui/` (e.g., `Button`, `Card`, `Badge`, `Modal`).
  - Place composite layout elements in `components/layout/` (e.g., `Header`, `Footer`, `Sidebar`, `Navigation`).
  - Place cross-feature shared components in `components/shared/`.
  - Keep components small, focused, and single-purpose.

- **Zero Unjustified Dependencies**:
  - Keep `package.json` lean and minimal.
  - Do not install third-party libraries for trivial logic (e.g., simple date formatting, class toggling).
  - Any new dependency must have a clear technical justification and must be 100% free and open-source.

- **Avoid Unnecessary Complexity**:
  - Do not over-engineer. Write straightforward, readable code over clever abstractions.
  - Avoid premature optimization and complex state machines until required by actual feature complexity.
  - Prefer native Web APIs and standard React/Next.js idioms.

---

## 2. Visual Identity & Aesthetic Principles

- **Magical-Academia Inspired Identity**:
  - The visual language draws inspiration from vintage collegiate grimoires, enchanted libraries, arcane observatories, and mystical alchemy.
  - Core palette includes midnight ink, obsidian, antique parchment, warm gold/amber accents, deep forest emerald, and arcane indigo.
  
- **Avoid Generic SaaS Tropes**:
  - Do NOT create a generic blue-and-white enterprise dashboard.
  - Do NOT use ungrounded neon purples or cookie-cutter template widgets.
  - Every surface, border, badge, and typography choice should feel purposeful, scholarly, and subtly enchanted.

- **Avoid Excessive Glassmorphism and Random Gradients**:
  - Do not use heavy backdrop blur with low-contrast illegible text.
  - Do not splash arbitrary multi-color rainbow gradients.
  - Use deliberate, refined surface layers with solid or subtle textured backgrounds, clean borders, and restrained lighting accents.

---

## 3. Privacy, Security & Anonymity

- **Public Anonymous Content Must NEVER Expose Private Identity**:
  - For features like campus confessions or anonymous bulletin boards, user identity (user ID, email, IP address, student ID) must never be transmitted to the client, logged in public payloads, or linked to public entries.
  - Client queries for anonymous feeds must only return sanitized public fields.

- **Never Commit Secrets**:
  - Never commit API keys, database credentials, service tokens, or private environment variables into Git.
  - Use `.env.local` for local environment configuration and `.env.example` as a template.

- **Use Environment Variables**:
  - All configurable endpoints, feature flags, and keys must be read through `process.env` / `NEXT_PUBLIC_*` variables.

---

## 4. Development & Workflow Discipline

- **Build & Test One Feature at a Time**:
  - Work incrementally. Focus on a single module (e.g., Attendance, Canteen, Confessions, Games) from schema to UI before moving to the next.
  - Verify correctness and responsive behavior after each change.

- **Meaningful Git Commits**:
  - Keep commits atomic and clearly described using Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`).
  - Do not bundle unrelated refactors with feature implementations.

- **Strictly Free-Tier & Open-Source Stack**:
  - The application must remain fully functional using free-tier services (e.g., Next.js, Vercel/Cloudflare Pages, Supabase free tier, local storage).
  - No paid API dependencies.

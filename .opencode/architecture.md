# Architecture Design

## System Overview

"Dominga y su Sazón" is a **static single-page restaurant landing page** built with Astro.js. The entire site is pre-rendered at build time — zero server-side rendering overhead. The page uses Astro's "islands architecture" to ship mostly static HTML/CSS with exactly one interactive React island (the floating WhatsApp button with scroll-aware visibility). Tailwind CSS v4 provides utility styling with a custom warm color palette mapped to CSS variables. shadcn/ui components (Button, Card, Badge) are used where appropriate for accessible, consistent UI primitives.

The site targets mobile-first users in the Mexican/Salvadoran community in Guadalajara, with all content in Spanish.

## Component Architecture

```
index.astro (root page — single page)
├── Layout.astro (page shell: <html>, <head>, <body>)
│   ├── Head.astro (SEO: meta tags, OG tags, favicon, fonts)
│   ├── Navbar.astro (sticky nav with anchor links — static HTML + CSS scroll-spy)
│   ├── Hero.astro (full-viewport section — static HTML + CSS)
│   ├── About.astro (story section — static HTML + CSS)
│   ├── Menu.astro (menu section — Astro partial hydration island)
│   │   └── MenuSection.astro (React component — renders menu.json data)
│   ├── Contact.astro (contact + map section — static HTML + Google Maps iframe)
│   ├── Footer.astro (copyright + social links)
│   └── WhatsAppButton.astro (React island — floating FAB, scroll-aware)
├── menu.json (data source)
└── types.ts (shared TypeScript types)
```

### Component Responsibilities

| Component | Framework | Hydration | Responsibility |
|-----------|-----------|-----------|----------------|
| `Layout.astro` | Astro | none | Page shell, CSS imports, font loading |
| `Head.astro` | Astro | none | SEO meta, OG tags, canonical URL, favicon |
| `Navbar.astro` | Astro | none | Sticky nav bar with anchor links; scroll-spy via CSS `scroll-padding-top` |
| `Hero.astro` | Astro | none | Full-viewport hero with restaurant name, tagline, CTA buttons, placeholder image |
| `About.astro` | Astro | none | Storytelling section: history, tradition, hours (Sábados y Domingos) |
| `Menu.astro` | Astro → React | `client:load` | **React island** — renders categorized menu cards from JSON data. Client-side category filtering with React state. |
| `MenuSection.astro` | React | `client:load` | Core React component: reads `menu.json`, renders category tabs + menu item cards |
| `Contact.astro` | Astro | none | Contact info cards (phone, hours, address), Google Maps embed, Google Reviews link |
| `Footer.astro` | Astro | none | Copyright, hidden social links component (component exists, visually hidden) |
| `WhatsAppButton.astro` | React | `client:load` | Floating action button — visible only when scrolled past hero, pulse animation |

### Data-Driven Components

- **`MenuSection.astro`** is the only React component. It imports `menu.json` directly at build time (Astro handles JSON imports). The data is passed as props to the React component.
- Category filtering state lives in React (`useState`), toggling between `alimentos`, `bebidas`, and `extras`.
- All other sections are pure static HTML with Tailwind classes — no hydration overhead.

## Data Flow

```
menu.json (static data file)
    │
    ▼
Astro build: import menuData from "../data/menu.json"
    │
    ▼
Passed as prop to <MenuSection client:load menu={menuData} />
    │
    ▼
React renders:
  1. Category tabs (Alimentos, Bebidas, Extras)
  2. Filtered menu items as Card components
  3. Price formatted as "$XX" MXN
    │
    ▼
CSS scroll-spy highlights active nav link based on scroll position
```

**Menu JSON structure** (unchanged from spec):
```typescript
interface MenuItem {
  name: string;
  description?: string;
  price: number;
}

interface MenuData {
  restaurant: string;
  sections: Record<string, MenuItem[]>;
  extras: MenuItem[];
}
```

## Astro Configuration

### `astro.config.mjs`
```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://dominga-sazon.vercel.app',
  integrations: [
    react(),
    tailwindcss(),
  ],
  // No headlessUI needed — using shadcn/ui primitives
});
```

### `tsconfig.json`
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### Tailwind CSS v4 — `src/styles/global.css`

Tailwind v4 uses `@theme` blocks in the CSS file (no separate `tailwind.config.js`). The custom palette is injected as CSS custom properties and mapped in the theme:

```css
@import "tailwindcss";

@theme inline {
  /* Custom color palette — warm, appetizing, traditional cooking */
  --color-dominga-cream: #E8DDD2;
  --color-dominga-parchment: #D6BDAE;
  --color-dominga-sand: #CFAF98;
  --color-dominga-tan: #B9A18F;

  --color-dominga-brown: #6E1405;
  --color-dominga-dark-brown: #3E1208;

  --color-dominga-red: #A32008;
  --color-dominga-brick: #B53012;
  --color-dominga-chili: #C74319;

  --color-dominga-orange: #F09A00;
  --color-dominga-gold: #E6B44A;

  --color-dominga-charcoal: #2F2F2F;
  --color-dominga-black: #1F1F1F;

  --color-dominga-accent: #D83A17;
  --color-dominga-border: #8B1D0D;

  /* Typography */
  --font-display: "Playfair Display", serif;
  --font-body: "Inter", sans-serif;

  /* Animations */
  --animate-fade-in: fadeIn 0.6s ease-out forwards;
  --animate-pulse-slow: pulseSlow 2s ease-in-out infinite;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulseSlow {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
}
```

### Color Usage Map

| Tailwind Token | CSS Variable | Use Case |
|----------------|-------------|----------|
| `bg-dominga-cream` | `#E8DDD2` | Page background, card backgrounds |
| `text-dominga-dark-brown` | `#3E1208` | Primary headings |
| `text-dominga-brown` | `#6E1405` | Body text, secondary headings |
| `text-dominga-charcoal` | `#2F2F2F` | Body text on light backgrounds |
| `bg-dominga-red` | `#A32008` | CTA buttons, accent elements |
| `text-dominga-red` | `#A32008` | Active nav links, price highlights |
| `bg-dominga-orange` | `#F09A00` | Highlight badges, category tabs active state |
| `text-dominga-gold` | `#E6B44A` | Decorative accents, star ratings |
| `border-dominga-border` | `#8B1D0D` | Card borders, section dividers |
| `bg-dominga-black` | `#1F1F1F` | Footer background, dark sections |
| `text-dominga-cream` | `#E8DDD2` | Text on dark backgrounds |

## Directory Structure

```
dominga-sazon/
├── astro.config.mjs              # Astro config with React + Tailwind
├── package.json
├── tsconfig.json
├── tailwind.config.mjs           # (not needed with Tailwind v4 @theme)
├── public/
│   ├── favicon.svg               # Restaurant favicon
│   └── images/
│       ├── hero-placeholder.jpg  # Hero placeholder (replace with real photo)
│       └── logo-placeholder.png  # Logo placeholder
├── src/
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components (Button, Card, Badge)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── badge.tsx
│   │   ├── Head.astro            # SEO head section
│   │   ├── Navbar.astro          # Sticky navigation
│   │   ├── Hero.astro            # Full-viewport hero
│   │   ├── About.astro           # Story section
│   │   ├── Contact.astro         # Contact info + map
│   │   ├── Footer.astro          # Footer + hidden social links
│   │   └── WhatsAppButton.astro  # React island: floating FAB
│   ├── layouts/
│   │   └── Layout.astro          # Page shell (html, head, body, slots)
│   ├── pages/
│   │   └── index.astro           # Single page — all sections
│   ├── data/
│   │   └── menu.json             # Menu data (restaurant sections + extras)
│   ├── lib/
│   │   ├── menu.ts               # Menu data types + price formatter
│   │   └── utils.ts              # cn() utility (clsx + tailwind-merge)
│   ├── styles/
│   │   └── global.css            # Tailwind v4 @theme + custom CSS
│   └── types/
│       └── menu.ts               # TypeScript interfaces for menu data
└── vercel.json                   # Deployment config (if needed)
```

## Responsive Breakpoints Strategy

Mobile-first approach with Tailwind's default breakpoints:

| Breakpoint | Min Width | Target | Strategy |
|-----------|-----------|--------|----------|
| `sm` | 640px | Large phones | Nav collapses to hamburger on <640px |
| `md` | 768px | Tablets | Hero text scales up, grid columns increase |
| `lg` | 1024px | Laptops | Full nav bar, multi-column menu grid |
| `xl` | 1280px | Desktops | Max-width container, larger typography |

### Key Responsive Decisions

- **Navbar**: Hamburger menu on `<sm`, horizontal nav on `≥sm`. Sticky positioning throughout.
- **Hero**: Full viewport height on mobile (`min-h-screen`), slightly reduced on desktop. CTA buttons stack vertically on mobile, horizontal on `md+`.
- **Menu Grid**: 1 column on mobile (`flex-col`), 2 columns on `md+` (`md:grid-cols-2`), 3 columns on `lg+` (`lg:grid-cols-3`).
- **About Section**: Single column on mobile, two-column layout (text + image) on `md+`.
- **Contact Section**: Stacked cards on mobile, grid layout on `lg+`.
- **WhatsApp Button**: Fixed bottom-right on all screens, larger touch target on mobile (`size-14` mobile → `size-12` desktop).

## Image Handling Strategy

- **Placeholders**: All images use placeholder files in `public/images/` for now. Clearly named so they can be replaced with real food photography.
- **Hero image**: Static `<img>` with `loading="eager"` (above the fold).
- **Decorative images**: `loading="lazy"` with `decoding="async"`.
- **Google Maps**: Embedded iframe via `<iframe>` in `Contact.astro` — no optimization needed.
- **Format**: JPEG for photos (smaller file size), SVG for logo/icon.
- **Future**: When real photos arrive, convert to WebP/AVIF and add `srcset` for responsive images.

## Performance Strategy

| Aspect | Strategy |
|--------|----------|
| **Rendering** | Full static site generation (SSG) — all pages pre-built at deploy time. Zero runtime JS for page content. |
| **Hydration** | Only `MenuSection` and `WhatsAppButton` are React islands (`client:load`). Everything else is static HTML. |
| **CSS** | Tailwind v4 with `@theme` — minimal CSS output via purge/unused class removal. No CSS framework bloat. |
| **Fonts** | Google Fonts loaded via `<link>` in `<Head>`. `display=swap` to prevent FOIT. Preconnect to `fonts.gstatic.com`. |
| **Images** | Placeholder images sized appropriately. Real photos should use `astro:img` for automatic optimization. |
| **Maps** | Google Maps iframe loaded lazily (`loading="lazy"`) to defer heavy third-party script. |
| **Bundle** | Target <50KB JS total. Only two React islands means minimal client-side bundle. |
| **Lighthouse targets** | Performance: 95+, Accessibility: 95+, Best Practices: 100, SEO: 100 |

## Security Considerations

| Concern | Mitigation |
|---------|------------|
| **External links** | WhatsApp link, Google Maps, Google Reviews all use `rel="noopener noreferrer"` and `target="_blank"` |
| **Google Maps embed** | Uses `sandbox` attribute to restrict iframe capabilities |
| **Phone links** | `tel:` protocol — safe, no external resource loading |
| **No user input** | No forms, no user input handling — eliminates XSS vector |
| **Content** | All content is static — no CMS, no database, no API endpoints |
| **Dependencies** | Pin dependency versions, audit with `npm audit` before deployment |

## State Management

This is a static site with minimal interactivity. State is handled locally within React islands:

| Island | State | Strategy |
|--------|-------|----------|
| `MenuSection` | Active category filter | `useState<string>` — toggles between "Alimentos", "Bebidas", "Extras" |
| `WhatsAppButton` | Visibility (show/hide) | `useState<boolean>` — hidden until scrolled past hero threshold |
| `Navbar` | Mobile menu open/close | `useState<boolean>` — hamburger toggle on mobile |

**No global state needed.** No Zustand, Redux, or Context. All state is local to its component.

## API Design

Not applicable — this is a fully static site. No API endpoints, no GraphQL, no server functions.

Data is loaded at build time:
```ts
// In MenuSection.astro (React island)
import menuData from "../data/menu.json";
// menuData is typed as MenuData via src/types/menu.ts
```

## Deployment (Vercel)

- **Framework preset**: Astro (auto-detected from `astro.config.mjs`)
- **Build command**: `astro build`
- **Output directory**: `dist`
- **Environment variables**: None required (all data is static)
- **Custom domain**: Configurable in Vercel dashboard
- **Preview deployments**: Enabled by default on Git push

### `vercel.json` (if manual config needed)
```json
{
  "buildCommand": "astro build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

## Decisions Log

| Decision | Rationale |
|----------|-----------|
| Astro.js over Next.js | Static site with no dynamic routes — Astro ships less JS and is purpose-built for content sites |
| React plugin (not Vue/Svelte) | shadcn/ui components are React-based; spec mandates React |
| Tailwind v4 `@theme` over config file | Tailwind v4's CSS-first config is cleaner for Astro; no need for separate config file |
| shadcn/ui over raw Tailwind | Accessible, consistent primitives (Button, Card, Badge) reduce custom CSS and improve UX |
| Menu as React island | Needs client-side category filtering; Astro's `client:load` hydration is lightweight |
| WhatsApp button as React island | Needs scroll-aware visibility logic; CSS-only solution would be brittle |
| Static JSON over CMS | Menu changes are infrequent; JSON is simpler, faster, and requires no infrastructure |
| Google Maps iframe over API | No need for custom map styling; embed is sufficient and zero-config |
| Mobile-first breakpoints | Restaurant site used on phones; mobile experience is primary |
| `client:load` over `client:visible` | Menu section is above the fold; load immediately. WhatsApp button uses `client:visible` for lazy init. |
| No dark mode | Restaurant branding is warm/light; dark mode adds complexity with no user benefit |
| CSS scroll-spy over JS scroll-spy | Simpler, no JS overhead for nav highlighting; CSS `scroll-padding-top` handles sticky nav offset |
| Two React islands total | Minimal hydration keeps JS bundle tiny; everything else is static HTML |

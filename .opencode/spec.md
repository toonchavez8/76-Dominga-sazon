# Project Specification

## Overview
- **Project:** Dominga y su Sazon
- **Type:** Restaurant Landing Page
- **Description:** A beautiful, fast single-page landing page for "Dominga y Sazon" — a restaurant showcasing the menu with prices, contact information, location via Google Maps, and an About Us section. Designed to be warm, appetizing, and mobile-first.

## Tech Stack
- **Frontend:** Astro.js (with React plugin for interactive components)
- **Styling:** shadcn/ui + Tailwind CSS
- **TypeScript:** Yes
- **Deployment:** Vercel
- **CI/CD:** No

## Architecture
Astro will be the core framework, leveraging its "islands architecture" where the majority of the page is static HTML (fast loading) with interactive React islands for dynamic bits (WhatsApp button, menu filtering if needed). Tailwind CSS handles the utility styling, and shadcn/ui provides accessible, well-designed components (cards, buttons, navigation, etc.).

The site will be a **single-page scrollable layout** with smooth anchor navigation between sections.

## Pages/Routes
Single page with the following sections (anchor links):

1. **Hero** — Full-width hero with restaurant name, tagline, logo, and a CTA ("View Menu" / "Contact Us")
2. **About** — Story of Dominga y su Sazon, the food, the tradition
3. **Menu** — Menu categories with items, descriptions, and prices (organized by category: appetizers, mains, desserts, drinks, etc.)
4. **Contact** — Contact info, phone number, hours, Google Maps embed, Google Reviews
5. **Footer** — Logo, social links, copyright

## Features

### Core Features
- **Responsive design** — Mobile-first, looks great on all devices
- **Smooth scroll navigation** — Sticky nav bar with anchor links
- **Menu section** — Categorized menu with prices, organized in cards or a grid
- **Hero section** — Eye-catching with placeholder images (to be replaced with real food photos)
- **About section** — Warm, storytelling layout with placeholder imagery
- **Contact section** — Phone (click-to-call), address, hours, embedded Google Map
- **WhatsApp button** — Floating action button for direct messaging
- **Google Reviews** — Link or embed to restaurant's Google Reviews
- **Placeholder images** — Easy-to-replace placeholders for food photos and logo

### Integrations
- **Google Maps** — Embedded map showing restaurant location
- **Google Reviews** — Link or embed to reviews
- **WhatsApp** — Floating chat button with pre-filled message
- **Click-to-call** — Phone number links for mobile users
- **Social media links** — Instagram, Facebook, etc. (as provided)

## Data Model
Not applicable — this is a static site. Menu data will be stored in a simple JSON/TS file for easy editing.

### Menu Data Structure
```typescript
interface MenuItem {
  name: string;
  description: string;
  price: string;
  category: string;
  image?: string;
}

interface MenuCategory {
  name: string;
  items: MenuItem[];
}
```

## Design Direction
- **Warm, inviting, and appetizing** — earthy tones, rich food photography
- **Clean, modern layout** — shadcn/ui components with custom styling
- **Typography** — Elegant headings, readable body text
- **Color palette** — Warm colors (terracotta, cream, deep greens, gold accents)
- **Mobile-first** — Prioritize mobile experience

## Agent Dispatch Plan

### Phase 1 — Scaffolding (dispatch in parallel)
1. **@architect** — Finalize architecture: Astro project structure, component hierarchy, directory layout
2. **@frontend** — Set up Astro project with React plugin, Tailwind, shadcn/ui, build all sections (Hero, Menu, About, Contact, Footer)
3. **@devops** — Set up Vercel deployment configuration (vercel.json, environment variables)

### Phase 2 — Polish (after scaffolding)
4. **@reviewer** — Review all code for quality, performance, and accessibility
5. **@tester** — Set up basic testing (component tests, Lighthouse CI checks)

### Skills to Check
- Verify `shadcn` skill is available ✅
- Check if `tailwind-patterns` skill applies to Astro ✅
- Check for Astro-specific skill — install from marketplace if needed

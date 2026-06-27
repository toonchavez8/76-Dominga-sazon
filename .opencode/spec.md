# Project Specification

## Overview
- **Project:** Dominga y su Sazón
- **Type:** Restaurant Landing Page
- **Description:** A beautiful, fast single-page landing page for "Dominga y su Sazón" — a Salvadoran/Mexican home-cooked restaurant. Showcasing the menu with prices, contact information, location in El Fortín, Guadalajara Jalisco, and an About Us section. Designed to be warm, appetizing, and mobile-first.
- **Language:** Spanish (oriented to Mexican community)

## Tech Stack
- **Frontend:** Astro.js (with React plugin for interactive components)
- **Styling:** shadcn/ui + Tailwind CSS
- **TypeScript:** Yes
- **Deployment:** Vercel
- **CI/CD:** No

## Architecture
Astro will be the core framework, leveraging its "islands architecture" where the majority of the page is static HTML (fast loading) with interactive React islands for dynamic bits (WhatsApp button, menu filtering if needed). Tailwind CSS handles the utility styling, and shadcn/ui provides accessible, well-designed components (cards, buttons, navigation, etc.).

The site will be a **single-page scrollable layout** with smooth anchor navigation between sections.

## Color Palette (Custom CSS Variables)
```css
/* Warm, appetizing palette inspired by traditional cooking */
--dominga-cream: #E8DDD2;
--dominga-parchment: #D6BDAE;
--dominga-sand: #CFAF98;
--dominga-tan: #B9A18F;

--dominga-brown: #6E1405;
--dominga-dark-brown: #3E1208;

--dominga-red: #A32008;
--dominga-brick: #B53012;
--dominga-chili: #C74319;

--dominga-orange: #F09A00;
--dominga-gold: #E6B44A;

--dominga-charcoal: #2F2F2F;
--dominga-black: #1F1F1F;

--dominga-accent: #D83A17;
--dominga-border: #8B1D0D;
```

## Pages/Routes
Single page with the following sections (anchor links):

1. **Hero** — Full-width hero with restaurant name, tagline "Pupusas, tacos de barbacoa y otros antojitos", logo, and CTA buttons ("Ver Menú" / "Contáctanos")
2. **About** — Story of Dominga y su Sazón, the food, the tradition, hours (Sábados y Domingas)
3. **Menu** — Menu categories with items, descriptions, and prices
4. **Contact** — Contact info, phone, hours, address, Google Maps embed, Google Reviews
5. **Footer** — Social links (hidden component), copyright

## Features

### Core Features
- **Responsive design** — Mobile-first, looks great on all devices
- **Smooth scroll navigation** — Sticky nav bar with anchor links
- **Menu section** — Categorized menu with prices, organized in cards
- **Hero section** — Eye-catching with placeholder images
- **About section** — Warm, storytelling layout
- **Contact section** — Phone (click-to-call), address, hours, embedded Google Map
- **WhatsApp button** — Floating action button for direct messaging
- **Google Reviews** — Link to reviews
- **Placeholder images** — Easy-to-replace placeholders

### Integrations
- **Google Maps** — Embedded map showing restaurant location (El Fortín, Guadalajara, Jalisco)
- **Google Reviews** — Link to reviews
- **WhatsApp** — Floating chat button (+52 1 33 2262 6550)
- **Click-to-call** — Phone number links
- **Social media** — Hidden component, ready to enable later

## Menu Data (menu.json)
```json
{
  "restaurant": "Dominga y su Sazón",
  "sections": {
    "alimentos": [
      { "name": "Pupusa", "description": "Chicharrón Frijol y Queso", "price": 35 },
      { "name": "Pupusa Cargada", "price": 45 },
      { "name": "Tacos de Barbacoa", "price": 22 },
      { "name": "Tacos con Queso", "price": 26 },
      { "name": "Volteado", "price": 32 },
      { "name": "Consome", "price": 10 }
    ],
    "bebidas": [
      { "name": "Café de Olla", "price": 25 },
      { "name": "Agua de 1/2 lt.", "price": 25 },
      { "name": "Agua de 1 lt.", "price": 45 },
      { "name": "Agua Natural", "price": 20 },
      { "name": "Coca-Cola", "price": 30 },
      { "name": "Coca-Cola 0", "price": 35 }
    ]
  },
  "extras": [
    { "name": "Salsa Macha", "price": 100 }
  ]
}
```

## Restaurant Details
- **Name:** Dominga y su Sazón
- **Location:** El Fortín, Guadalajara, Jalisco, México
- **Hours:** Sábados y Domingos (to be confirmed from Google Maps)
- **Phone:** +52 1 33 2262 6550
- **Google Maps:** https://maps.app.goo.gl/3KHw8nktGdRja7h39

## Design Direction
- **Warm, inviting, and appetizing** — earthy tones, rich food photography
- **Clean, modern layout** — shadcn/ui components with custom styling
- **Typography** — Elegant headings, readable body text
- **Color palette** — Custom warm palette (terracotta, cream, chili red, gold accents)
- **Mobile-first** — Prioritize mobile experience
- **Spanish language** — All content in Spanish

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
- Check for `imagegen-frontend-web` skill for future image generation

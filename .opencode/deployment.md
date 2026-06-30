# Deployment Guide

## Platform: Vercel

### Static Site
This is an Astro.js static site. All content is pre-rendered at build time. No serverless functions or dynamic rendering required.

## Setup Steps

### Option A — Vercel Dashboard (Recommended)

1. Push code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [vercel.com/new](https://vercel.com/new) and import your repository
3. Vercel will auto-detect Astro — confirm the settings:
   - **Framework Preset:** Astro
   - **Build Command:** `astro build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Click **Deploy**

### Option B — Vercel CLI

```bash
# Install the Vercel CLI
npm i -g vercel

# Login to your Vercel account
vercel login

# Link the project (first time only)
vercel link --project 76-dominga-sazon --scope toonchavez8

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Option C — Git Integration (CI/CD)

1. Connect your Git repository to Vercel via the dashboard
2. Every push to `main` triggers a production deploy
3. Every PR creates a preview deployment automatically

## Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `NODE_ENV` | Set to `production` by Vercel automatically | No |
| `VERCEL` | Vercel environment variable (auto-set) | No |

> **Note:** This is a static site with no backend, so no secret environment variables are needed.

## CI/CD Pipeline

**No custom CI/CD pipeline is needed.** Vercel handles all build and deployment automatically:

- **Preview deployments** — Every push to a feature branch creates a unique preview URL
- **Production deployments** — Every push to `main` (or `master`) deploys to production
- **Custom domains** — Configure in Vercel dashboard → Settings → Domains
- **Branch overrides** — Configure in Vercel dashboard → Settings → Git

### Vercel Build Configuration

| Setting | Value |
|---------|-------|
| Framework | Astro |
| Build Command | `astro build` |
| Output Directory | `dist` |
| Dev Command | `astro dev` |
| Install Command | `npm install` |
| Node Version | 18.x (default) |

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start local development server (localhost:4321) |
| `npm run build` | Build static site to `dist/` |
| `npm run preview` | Preview the built site locally |
| `vercel` | Deploy to preview URL |
| `vercel --prod` | Deploy to production |
| `vercel link` | Link project to Vercel |
| `vercel env pull` | Download environment variables locally |

## Project Structure (Deployment-Relevant)

```
dominga-sazon/
├── dist/                 ← Build output (Vercel serves this)
├── public/               ← Static assets (copied to / at build)
├── src/                  ← Astro source files
│   ├── components/       ← Reusable components
│   ├── layouts/          ← Page layouts
│   └── pages/            ← Route pages
├── vercel.json           ← Vercel configuration
├── astro.config.mjs      ← Astro configuration
├── package.json          ← Dependencies & scripts
└── tsconfig.json         ← TypeScript config
```

## Performance Optimizations (Already Configured)

- **Edge caching** — Static assets cached for 1 year (`immutable`)
- **Security headers** — X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
- **Astro islands** — Only interactive React components hydrate on the client
- **Zero JavaScript by default** — Most pages ship as pure HTML

## Troubleshooting

### Build Fails on Vercel
- **Issue:** `astro build` fails in production
- **Fix:** Check the Vercel build logs. Ensure all dependencies are in `package.json` (not just `devDependencies`). Run `npm install && npm run build` locally to verify.

### Assets Not Loading
- **Issue:** Images or CSS not found after deploy
- **Fix:** Static files in `public/` are copied to the root of `dist/`. Use absolute paths (`/images/photo.jpg`) not relative paths.

### SPA Fallback 404s
- **Issue:** Direct links to routes return 404
- **Fix:** The `rewrites` in `vercel.json` handles this by redirecting all paths to `index.html`.

### Slow First Load
- **Issue:** Page feels slow on first visit
- **Fix:** Vercel's edge network handles this. Ensure images are optimized and use `loading="lazy"` on below-fold images.

### Can't Connect Git Repository
- **Issue:** Vercel doesn't detect the project
- **Fix:** Ensure `vercel.json` exists at the project root and `package.json` has the `astro` dependency.

### Local Dev vs Production Mismatch
- **Issue:** Works locally but broken on Vercel
- **Fix:** Run `npm run build && npm run preview` locally to simulate production. Check for dev-only dependencies that should be in `dependencies`.

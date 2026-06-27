# Next.js Starter Template

## When to Use
Minimal Next.js project for simple apps, landing pages, or when the user wants a lightweight start.

## Template Contents

### package.json
```json
{
  "name": "[project-name]",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5"
  }
}
```

### src/app/layout.tsx
```tsx
export const metadata = {
  title: "[Project Name]",
  description: "[Project description]",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### src/app/page.tsx
```tsx
export default function Home() {
  return (
    <main>
      <h1>Welcome to [Project Name]</h1>
    </main>
  );
}
```

## Agent Instructions

When using this template:
1. Copy the template structure to the project root
2. Replace `[Project Name]` with the actual project name
3. Add dependencies as needed (Tailwind, shadcn, etc.)
4. Initialize with `npm install`

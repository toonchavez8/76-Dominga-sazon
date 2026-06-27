# Next.js + Prismic CMS Template

## When to Use
Use this template when the user wants a Next.js project with Prismic CMS for content management.

## Template Contents

### package.json (dependencies section)
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@prismicio/client": "^7.0.0",
    "@prismicio/next": "^1.0.0",
    "@prismicio/react": "^2.0.0"
  }
}
```

### prisma/schema.prisma (if using Prisma alongside)
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### lib/slicepick.ts
```ts
import { createClient } from "@prismicio/client";

const repositoryName = process.env.NEXT_PUBLIC_PRISMIC_REPOSITORY_NAME || "your-repo";

export const client = createClient(repositoryName);

export async function getSliceZone() {
  const page = await client.getByID("page", {
    filters: [["my.page.slug", "home"]],
  });

  return page;
}
```

### src/app/layout.tsx
```tsx
import { PrismicPreview } from "@prismicio/next";
import { repositoryName } from "@/prismicio";

export const metadata = {
  title: "[Project Name] | Powered by Prismic",
  description: "[Project description]",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <PrismicPreview client={client} />
      </body>
    </html>
  );
}
```

## Agent Instructions

When the architect or frontend agent uses this template:
1. Copy the template structure to the project root
2. Replace `[Project Name]` with the actual project name
3. Set up Prismic repository via their dashboard
4. Add `.env.local` with:
   ```
   NEXT_PUBLIC_PRISMIC_REPOSITORY_NAME=your-repo-name
   PRISMIC_API_TOKEN=your-token
   ```
5. Install with `npm install`
6. Run `npx shadcn@latest init` if shadcn is in the stack

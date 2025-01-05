# Next.js 14 + Auth.js Dashboard

This is a dashboard starter template for the [NextJS](https://nextjs.org) 14 app router using supabase based on [shadcn-ui](https://ui.shadcn.com).

## Denpendencies

- Next.js 14
- NextAuth.js v5 + Prisma Adapter
- Shadcn
- Zustand
- SWR

## Folder and file Structure

The folder and file structure is based on nextjs app router [next.js project structure](https://nextjs.org/docs/getting-started/project-structure).

```txt
.
├── app/                        # App Router
│   └── api/
│       ├── auth/               # Public API for authentication
│       └── v1/                 # APIs that require authentication
├── components/                 # React components
├── config/                     # Configuration for site
├── context/                    # Context
├── docs/                       # Documents
├── hooks/                      # Hooks
├── lib/                        # Utility functions
├── public/                     # Static assets to be served
│   └── [locales]/              # Internationalization
├── queries/                    # API
├── screenshots/                # Screenshots
├── store/                      # State
├── supabase/                   # Supabase CLI
├── types/                      # Type definitions
└── package.json                # Project dependencies and scripts
```

## Getting Started

Clone the repository.

```shell
git clone https://github.com/w3labkr/nextjs14-supabase-dashboard.git .
```

```shell
cd nextjs14-supabase-dashboard
```

Install all modules listed as dependencies.

```shell
npm install
```

Start the development server.

```shell
npm run dev
```

## License

This software license under the [MIT License](LICENSE).

# Next.js 14 + Auth.js Dashboard

This is a dashboard starter template for the [NextJS](https://nextjs.org) 14 app router based on [Auth.js](https://authjs.dev) v5.

## Denpendencies

- Next.js 14
- Auth.js v5 + Prisma Adapter
- Shadcn
- Prisma
- Zustand
- React Query

## Folder and file Structure

The folder and file structure is based on nextjs app router [next.js project structure](https://nextjs.org/docs/getting-started/project-structure).

```txt
.
├── app/                        # App Router
│   └── api/
│       ├── auth/               # Authentication
│       └── v1/                 # Public APIs
├── components/                 # React components
├── config/                     # Configuration for site
├── context/                    # Context
├── docs/                       # Documents
├── hooks/                      # Hooks
├── lib/                        # Utility functions
├── prisma/                     # Prisma Schema Location and Configuration
├── public/                     # Static assets to be served
│   └── [locales]/              # Internationalization
├── queries/                    # API
├── schemas/                    # Schema validation
├── store/                      # State
├── types/                      # Type definitions
└── package.json
```

## Getting Started

Clone the repository to the current directory.

```shell
git clone https://github.com/w3labkr/nextjs14-supabase-dashboard.git .
```

Install all modules listed as dependencies.

```shell
npm install
```

Copy of the `.env.example` if the `.env` doesn't exist.

```shell
cp .env.example .env
```

Create an SQL migration file and execute it.

```shell
npx prisma migrate dev --name init
```

Start the development server.

```shell
npm run dev
```

## License

This software license under the [MIT License](LICENSE).

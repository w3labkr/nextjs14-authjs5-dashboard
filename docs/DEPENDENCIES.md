# DEPENDENCIES

## Next.js

Automatic Installation

```shell
$ npx create-next-app@14.2.20 .

✔ Would you like to use TypeScript? Yes
✔ Would you like to use ESLint? Yes
✔ Would you like to use Tailwind CSS? Yes
✔ Would you like to use `src/` directory? No
✔ Would you like to use App Router? (recommended) Yes
✔ Would you like to customize the default import alias (@/*)? No

$ node -v > .nvmrc
```

## Shadcn

Run the init command to create a new Next.js project or to setup an existing one:

```shell
npx shadcn@latest init -d
```

Use the add command to add components and dependencies to your project.

```shell
npx shadcn@latest add -a
```

This will add/install all shadcn components (overwrite if present).

```shell
npx shadcn@latest add -a -y -o
```

Add `tanstack/react-table` dependency:

```shell
npm install @tanstack/react-table
```

Add the Toaster component. Edit `app/layout.tsx`:

```javascript
import { Toaster } from '@/components/ui/sonner'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
```

## Tailwindcss

Install Tailwind CSS

```shell
npm install -D tailwindcss@3 postcss autoprefixer
```

Add Tailwind to your PostCSS configuration. `postcss.config.js`:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
```

[Get started with Tailwind CSS](https://tailwindcss.com/docs/installation/using-postcss)

## Auth.js

Installing Auth.js

```shell
npm install next-auth@beta
```

Setup Environment

```shell
npx auth secret
```

Installing Prisma Adapter

```shell
npm install @prisma/client @auth/prisma-adapter
npm install prisma --save-dev
npm install tsx --save-dev
```

If you're not using a Prisma Postgres database, you won't need the @prisma/extension-accelerate package.

```shell
npm install @prisma/extension-accelerate
```

Apply schema to database.

```shell
npx prisma migrate dev --name init
```

The easiest way to explore and manipulate your data in all of your Prisma projects.

```shell
npx prisma studio
```

## Nodemailer

Send e-mails with Node.JS.

```shell
npm install nodemailer
npm install --save-dev @types/nodemailer
```

## Zustand

Bear necessities for state management in React

```shell
npm i zustand
```

## React Query

Powerful asynchronous state management, server-state utilities and data fetching for the web. TS/JS, React Query, Solid Query, Svelte Query and Vue Query.

```shell
npm i @tanstack/react-query
```

## Browserslist

Share target browsers between different front-end tools, like Autoprefixer, Stylelint and babel-preset-env.

```shell
npm install browserslist
```

Edit `package.json`:

```json
{
  "browserslist": [
    "defaults and fully supports es6-module",
    "maintained node versions"
  ],
}
```

## bcrypt.js

Optimized bcrypt in plain JavaScript with zero dependencies.

```shell
npm i bcryptjs @types/bcryptjs
```

## jose (JSON Web Token)

JWA, JWS, JWE, JWT, JWK, JWKS for Node.js, Browser, Cloudflare Workers, Deno, Bun, and other Web-interoperable runtimes.

```shell
npm i jose
```

## Day.js

Day.js 2kB immutable date-time library alternative to Moment.js with the same modern API.

```shell
npm i dayjs
```

## cookies-next

Getting, setting and removing cookies on both client and server with next.js

```shell
npm i cookies-next@4.3.0
```

## React Icons

svg react icons of popular icon packs

```shell
npm i react-icons
```

## qs

A querystring parser with nesting support

```shell
npm i qs @types/qs
```

## ESLint

ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.

```shell
npm install --save-dev eslint eslint-plugin-react eslint-plugin-react-hooks
npm install --save-dev eslint-plugin-import eslint-import-resolver-typescript
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install --save-dev @next/eslint-plugin-next
```

Find and fix problems in your JavaScript code.

```shell
npx eslint ./app
npx eslint --fix ./{app,components,config,context,hooks,lib,queries,store,types}
```

## Prettier

Prettier is an opinionated code formatter.

```shell
npm install --save-dev prettier eslint-plugin-prettier eslint-config-prettier
npm install --save-dev eslint-plugin-tailwindcss prettier-plugin-tailwindcss
npm install --save-dev prettier-plugin-prisma
```

To format a file in-place.

```shell
npx prettier --check "./app/**/*.{ts,tsx}"
npx prettier --write "./{app,components,config,context,hooks,lib,queries,store,types}/**/*.{ts,tsx}"
```

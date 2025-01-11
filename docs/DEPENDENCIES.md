# DEPENDENCIES

## Next.js

Automatic Installation

```shell
$ npx create-next-app@14.2.20 .

✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like to use `src/` directory? … No
✔ Would you like to use App Router? (recommended) … Yes
✔ Would you like to customize the default import alias (@/*)? … No
```

```shell
node -v > .nvmrc
```

## Shadcn

Run the init command to create a new Next.js project or to setup an existing one:

```shell
npx shadcn@latest init -d
```

You can now start adding components to your project.

```shell
npx shadcn@latest add -a
```

Add the Toaster component. Edit `app/layout.tsx`:

```javascript
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

## NextAuth.js

Installing Auth.js

```shell
npm uninstall next-auth@beta
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
```

Apply Schema

```shell
npm exec prisma migrate dev
```

The easiest way to explore and manipulate your data in all of your Prisma projects.

```shell
npx prisma studio
```

## Zustand

Bear necessities for state management in React

```shell
npm i zustand
```

## SWR

React Hooks for Data Fetching.

```shell
npm i swr
```

## Serve

Static file serving and directory listing

```shell
npm install --global serve
```

Edit `.package.json`

```json
"scripts": {
  "serve": "serve -l 4000 build/"
}
```

Run the script

```shell
npm run serve
```

## Nodemailer

Send e-mails with Node.JS.

```shell
npm install nodemailer
npm install --save-dev @types/nodemailer
```

## bcrypt.js

Optimized bcrypt in plain JavaScript with zero dependencies.

```shell
npm i bcryptjs @types/bcryptjs
```

## jsonwebtoken

JsonWebToken implementation for node.js.

```shell
npm install jsonwebtoken @types/jsonwebtoken
```

## Day.js

Day.js 2kB immutable date-time library alternative to Moment.js with the same modern API.

```shell
npm i dayjs
```

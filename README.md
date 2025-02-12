# nextjs14-authjs5-dashboard

This is a dashboard starter template for the [NextJS](https://nextjs.org) 14 app router based on [Auth.js](https://authjs.dev) v5.

## Screenshots

![screenshot](./screenshot.png)

## Table of Contents

- [nextjs14-authjs5-dashboard](#nextjs14-authjs5-dashboard)
  - [Screenshots](#screenshots)
  - [Table of Contents](#table-of-contents)
  - [Denpendencies](#denpendencies)
  - [Folder and file Structure](#folder-and-file-structure)
  - [Getting Started](#getting-started)
  - [Documents](#documents)
  - [Examples](#examples)
    - [ApiResponse](#apiresponse)
    - [http](#http)
    - [bcrypt](#bcrypt)
    - [JWT](#jwt)
    - [CSRF](#csrf)
    - [Nodemailer](#nodemailer)
    - [dayjs](#dayjs)
    - [LucideIcon](#lucideicon)
    - [Math](#math)
    - [Utils](#utils)
  - [License](#license)

## Denpendencies

- Next.js 14
- Auth.js v5 + Prisma Adapter
- Tailwindcss
- Shadcn
- Prisma
- Zustand
- React Query

## Folder and file Structure

The folder and file structure is based on nextjs app router [next.js project structure](https://nextjs.org/docs/getting-started/project-structure).

```txt
.
├── actions/                    # Server Actions
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
├── schemas/                    # Schema validations
├── screenshots/                # Screenshots
├── store/                      # State
├── types/                      # Type definitions
└── package.json
```

## Getting Started

Clone the repository to the current directory.

```shell
git clone https://github.com/w3labkr/nextjs14-authjs5-dashboard.git .
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

## Documents

- [DEPENDENCIES](./docs/DEPENDENCIES.md)
- [GIT](./docs/GIT.md)
- [PRISMA](./docs/PRISMA.md)

## Examples

### ApiResponse

success

```javascript
import { ApiResponse } from '@/lib/http'

export async function POST(req) {
  return ApiResponse.json({ user: null })
}

// output
// { status: 'success', success: true, message: 'OK', data: { user: null } }
```

fail

```javascript
import { ApiResponse } from '@/lib/http'

export async function POST(req) {
  return ApiResponse.json({ user: null }, { status: 400 })
}

// output
// { status: 'fail', success: false, message: 'Bad Request', data: { user: null } }
```

### http

```javascript
import { 
  STATUS_CODES,
  STATUS_TEXTS,
  STATUS_CODE_TO_TEXT,
  STATUS_TEXT_TO_CODE
} from '@/lib/http'

STATUS_CODES.OK // 200
STATUS_TEXTS.OK // "OK"
STATUS_CODE_TO_TEXT["200"] // "OK"
STATUS_TEXT_TO_CODE["OK"] // "200"
```

### bcrypt

```javascript
import { generateHash, compareHash } from '@/lib/bcrypt'

const hashed = await generateHash('hash')

if (await compareHash('hash', hashed)) {
  // isMatch
}
```

### JWT

```typescript
import { 
  decodeJwt,
  verifyJwt,
  jwtSign,
  generateRecoveryToken,
  generateAccessToken,
  generateRefreshToken,
  generateTokenExpiresAt,
  isTokenExpired
} from '@/lib/jose'

decodeJwt(jwt: string)
verifyJwt(jwt: string | Uint8Array, options?: JWTVerifyOptions)
jwtSign(sub: string, exp: number | string | Date = '1h', payload?: JWTPayload)
generateRecoveryToken(sub: string, payload?: JWTPayload)
generateAccessToken(sub: string)
generateRefreshToken(sub: string, jwt?: string | null)
generateTokenExpiresAt(expiresIn: number = 60 * 60)
isTokenExpired(
  expiresAt: number, 
  options?: { expiresIn?: number; expiresBefore?: number }
)
```

### CSRF

Route Handlers

```javascript
import { verifyCSRFToken } from '@/lib/csrf'

export async function POST(req) {
  const { csrfToken, ...body } = await req.json()

  if (!verifyCSRFToken(csrfToken)) {
    return new Response('Unauthorized', { status: 401 })
  }
}
```

Client Side

```javascript
'use client'

import { useCSRFToken } from '@/hooks/use-csrf-token'

export function Component() {
  const { csrfToken } = useCSRFToken()

  async function onSubmit() {
    const res = await fetch('/api', {
      method: 'POST',
      body: JSON.stringify({ csrfToken }),
    })
  }

  return <button onClick={onSubmit}>Submit</button>
}
```

### Nodemailer

Sendmail

```javascript
import { transporter, sender } from '@/lib/nodemailer'

try {
  const info = await transporter.sendMail({
    from: `"${sender?.name}" <${sender?.email}>`,
    to: 'me@example.com',
    subject: `[${sender?.name}] Reset Password`,
    text: 'Hello World!',
    html: '<h2>Hello World!<h2>',
  })
} catch (e) {
  console.log(e)
}
```

### dayjs

The time zone and localized format are set.

```javascript
import dayjs from '@/lib/dayjs'

dayjs().toISOString()
```

### LucideIcon

```javascript
import { LucideIcon } from '@/lib/lucide-icon'

<LucideIcon name="Heart"/>
```

### Math

```typescript
import {
  getRandom,
  getRandomArbitrary,
  getRandomInt,
  getRandomIntInclusive
} from '@/lib/math'

getRandom()
getRandomArbitrary(min: number, max: number)
getRandomInt(min: number, max: number)
getRandomIntInclusive(min: number, max: number)
```

### Utils

```typescript
import {
  cn,
  uuidv4,
  sleep,
  fetcher,
  absoluteUrl,
  relativeUrl
} from '@/lib/utils'

cn(...inputs: ClassValue[])
uuidv4()
sleep(ms: number)
fetcher(input: RequestInfo | URL, init?: RequestInit)
absoluteUrl(url: string | URL, base?: string | URL)
relativeUrl(url: string | URL, base?: string | URL)
```

## License

This software license under the [MIT License](LICENSE).

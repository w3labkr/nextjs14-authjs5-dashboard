# PRISMA

## Table of Contents

- [PRISMA](#prisma)
  - [Table of Contents](#table-of-contents)
  - [Development environments](#development-environments)
  - [Production and testing environments](#production-and-testing-environments)
  - [Seeding your database](#seeding-your-database)
  - [Format](#format)
  - [Troubleshooting](#troubleshooting)

## Development environments

(DANGER) `migrate dev` is a development command and should never be used in a production environment.

```shell
npx prisma migrate dev
```

(WARNING) `migrate reset` is a development command and should never be used in a production environment.

```shell
npx prisma migrate reset
```

The `--create-only` command allows you to create a migration without applying it:

```shell
npx prisma migrate dev --create-only
```

To apply the edited migration, run `prisma migrate dev` again.

## Production and testing environments

(Note) `migrate deploy` should generally be part of an automated CI/CD pipeline, and we do not recommend running this command locally to deploy changes to a production database.

```shell
npx prisma migrate deploy
```

## Seeding your database

Create a new file called seed.ts in the prisma directory.

```shell
touch prisma/seed.ts
```

Edit `package.json`:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  },
}
```

Seed your database with the initial data you defined in the `seed.ts` file.

```shell
npx prisma db seed
```

## Format

Formats the Prisma schema file, which includes validating, formatting, and persisting the schema.

```shell
npx prisma format
```

## Troubleshooting

ERROR: must be a member of the role whose process is being terminated or member of `pg_signal_backend`

```sql
SELECT current_user, session_user;
GRANT pg_signal_backend TO postgres;
```

This quickly shows how to connect your Prisma application to Supabase Postgres.

```sql
-- Create custom user
CREATE USER "prisma" WITH password 'custom_password' bypassrls createdb;

-- extend prisma's privileges to postgres (necessary to view changes in Dashboard)
GRANT "prisma" TO "postgres";

-- Grant it necessary permissions over the relevant schemas (public)
GRANT usage ON schema public TO prisma;
GRANT CREATE ON schema public TO prisma;
GRANT ALL ON ALL tables IN schema public TO prisma;
GRANT ALL ON ALL routines IN schema public TO prisma;
GRANT ALL ON ALL sequences IN schema public TO prisma;
ALTER DEFAULT privileges FOR role postgres IN schema public GRANT ALL ON tables TO prisma;
ALTER DEFAULT privileges FOR role postgres IN schema public GRANT ALL ON routines TO prisma;
ALTER DEFAULT privileges FOR role postgres IN schema public GRANT ALL ON sequences TO prisma;

-- Alter prisma password if needed
ALTER USER "postgres" WITH password 'new_password';
```

- [Prisma](https://supabase.com/docs/guides/database/prisma)
- [Troubleshooting prisma errors](https://supabase.com/docs/guides/database/prisma/prisma-troubleshooting)

# PRISMA

## Format

Formats the Prisma schema file, which includes validating, formatting, and persisting the schema.

```shell
npx prisma format
```

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

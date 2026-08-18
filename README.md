# Ugly T-Shirt Exchange

A small Next.js application for creating an ugly T-shirt exchange group,
collecting participants and sizes, and assigning each participant a recipient.

## Local development

The application uses PostgreSQL through Prisma. Copy `.env.example` to `.env`
and replace both connection strings with credentials for a development database.

```bash
npm install
npx prisma migrate deploy
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel with Neon

1. Create a free Neon project and copy both connection strings from its
   **Connect** dialog:
   - The pooled connection string (hostname contains `-pooler`) becomes
     `DATABASE_URL`.
   - The direct connection string becomes `DIRECT_URL`.
2. Import this GitHub repository into Vercel.
3. Before deploying, add `DATABASE_URL` and `DIRECT_URL` under **Environment
   Variables** and paste the corresponding Neon values.
4. Deploy. The `vercel-build` script generates Prisma Client, applies the
   database migration, and builds the Next.js application.

Do not commit either connection string. They contain the database password.

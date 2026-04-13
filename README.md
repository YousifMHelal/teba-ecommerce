# Teba — E-Commerce Web App

A full-featured single-vendor e-commerce store built with the modern Next.js stack.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL (Vercel Postgres / Neon) |
| ORM | Prisma |
| Auth | NextAuth.js v5 (Google + Email/Password) |
| State | Zustand |
| Media | Cloudinary |
| Validation | Zod |
| Deployment | Vercel |

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
# Fill in your values
```

### 3. Set up the database
```bash
npm dlx prisma migrate dev
npm dlx prisma db seed
```

### 4. Run the development server
```bash
npm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
teba/
├── prisma/               # Schema, migrations, seed
├── public/assets/        # Static files
└── src/
    ├── app/              # Next.js App Router pages
    │   ├── (auth)/       # Login, register
    │   ├── (store)/      # Shop, product, cart, search
    │   ├── (account)/    # Checkout, profile, orders
    │   ├── (admin)/      # Admin dashboard
    │   └── api/          # NextAuth + Cloudinary upload
    ├── components/       # UI components by domain
    ├── lib/              # Auth, Prisma, Cloudinary, actions
    ├── hooks/            # Custom React hooks
    ├── store/            # Zustand stores (cart, ui)
    └── types/            # TypeScript interfaces
```

## Development Phases

- [x] Phase 1 — Project Setup
- [x] Phase 2 — Database & Prisma
- [x] Phase 3 — Authentication (Google OAuth + Email/Password, JWT, middleware, RTL Arabic UI)
- [x] Phase 4 — Product Catalog (Cloudinary, Algolia, Server Actions, RTL UI)
- [ ] Phase 5 — Cart (Zustand)
- [ ] Phase 6 — Checkout & Orders
- [ ] Phase 7 — User Account
- [ ] Phase 8 — Admin Dashboard
- [ ] Phase 9 — Polish & Deploy

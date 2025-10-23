# Postly - Modern Blogging Platform

A modern full-stack blogging platform built with cutting-edge technologies.

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: tRPC, Drizzle ORM, PostgreSQL
- **State Management**: React Query, Zustand
- **Validation**: Zod
- **Styling**: class-variance-authority, clsx, tailwind-merge

## Features

✅ Complete blog post CRUD operations
✅ Category system with many-to-many relationships
✅ Fast client-side category filtering
✅ Beautiful responsive UI design
✅ Type-safe API with tRPC
✅ Modern database with Drizzle ORM  

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up your database URL in `.env`:
```bash
DATABASE_URL="postgresql://user:password@host:port/dbname"
```

3. Generate and push database schema:
```bash
npm run db:generate
npm run db:push
```

4. Start the development server:
```bash
npm run dev
```

## Next Steps

- Implement backend CRUD for posts and categories
- Build frontend pages (listing, view, create)
- Add user authentication and authorization
- Create admin dashboard
- Implement comment system
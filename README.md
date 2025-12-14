# E-commerce Next.js Application

A modern e-commerce application built with Next.js, TypeScript, Tailwind CSS, and PostgreSQL.

## Screenshots

<div align="center">
  <img src="./public/read_me1%20(1).png" alt="Screenshot 1" width="800"/>
  <img src="./public/read_me1%20(2).png" alt="Screenshot 2" width="800"/>
  <img src="./public/read_me1%20(3).png" alt="Screenshot 3" width="800"/>
</div>

## Features

- 🛍️ Product listing with category filtering
- 🛒 Shopping cart with persistent storage
- 💳 Visa/Mastercard payment integration (Stripe)
- 🎨 Modern UI with Tailwind CSS
- 🌙 Dark mode support
- 📱 Responsive design
- ⚡ Server-side rendering with Next.js
- 🗄️ PostgreSQL database
- 🔄 State management with Zustand

## Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Environment variables configured

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Database Setup

1. Create a PostgreSQL database:

```sql
CREATE DATABASE ecommerce_db;
```

2. Set up your environment variables by copying `.env.example` to `.env`:

```bash
cp .env.example .env
```

3. Update `.env` with your database connection string:

```
DATABASE_URL=postgresql://username:password@localhost:5432/ecommerce_db
```

4. Generate Prisma Client:

```bash
pnpm db:generate
```

5. Push the schema to your database (or run migrations):

```bash
pnpm db:push
```

Or for production, use migrations:

```bash
pnpm db:migrate
```

6. (Optional) Open Prisma Studio to view/edit your database:

```bash
pnpm db:studio
```

7. Seed the database with sample products:

```bash
pnpm db:seed
```

**Note:** Make sure to copy images from `E-commerce2/frontend/public/images` to `E-commerce/public/images` before seeding, or the seed script will use the image paths that should exist.

### 3. Run Development Server

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
E-commerce/
├── src/
│   ├── app/              # Next.js app router
│   │   ├── api/          # API routes
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   ├── components/       # React components
│   │   ├── cart/         # Cart components
│   │   ├── footer/       # Footer component
│   │   ├── header/       # Header components
│   │   ├── hero/         # Hero section
│   │   ├── main/         # Product listing
│   │   └── scroll/       # Scroll components
│   ├── lib/              # Utilities
│   │   ├── db/           # Database utilities
│   │   └── env.ts        # Environment config
│   ├── store/            # Zustand stores
│   ├── types/            # TypeScript types
│   └── styles/           # Global styles
```

## Database Schema

The application uses Prisma ORM with two main models:

- **Product**: Stores product information
- **ProductImage**: Stores product images with relationships

See `prisma/schema.prisma` for the complete schema.

## API Routes

- `GET /api/products` - Get all products (optional `?category=men|women` filter)
- `GET /api/products/[id]` - Get a single product by ID
- `POST /api/payments/create-intent` - Create Stripe payment intent

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (required)
- `STRIPE_SECRET_KEY` - Stripe secret key for payment processing (required for payments)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (required for payments)
- `NEXT_PUBLIC_API_URL` - API base URL (optional, defaults to localhost:3000)
- `NEXT_PUBLIC_SHOW_LOGGER` - Enable/disable logger (optional)

### Payment Setup

See [PAYMENT_SETUP_AR.md](./PAYMENT_SETUP_AR.md) for detailed instructions on setting up Stripe payments (in Arabic).

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **PostgreSQL** - Database
- **Prisma** - ORM and database toolkit
- **Zustand** - State management
- **Swiper** - Image slider
- **React Icons** - Icons
- **next-themes** - Theme management

## Development

```bash
# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Type check
pnpm typecheck
```

## Notes

- Make sure your PostgreSQL database is running before starting the application
- Run `pnpm db:generate` after cloning the project to generate Prisma Client
- Run `pnpm db:push` to sync your database schema
- Product images should be stored in the `public/images` directory or configured to use external URLs
- The cart state is persisted in localStorage using Zustand's persist middleware
- Use `pnpm db:studio` to open Prisma Studio for database management

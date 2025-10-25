# Postly

A modern, full-stack blogging platform built with Next.js 15, TypeScript, and tRPC. Postly provides a comprehensive solution for creating, managing, and publishing blog content with a focus on performance, type safety, and user experience.

## Features

### Content Management
- Rich text editor with WYSIWYG functionality
- Auto-expanding editor that grows with content
- Markdown support with live preview
- Image upload and management
- Draft saving and restoration
- Post categorization and tagging
- SEO-friendly URLs and metadata

### User Interface
- Responsive design for all devices
- Dark mode support with system preference detection
- Modern, clean interface with smooth animations
- Mobile-first navigation with hamburger menu
- Search and filter functionality
- Pagination for large content sets

### Technical Features
- Type-safe API with tRPC
- Server-side rendering with Next.js 15
- Database integration with Drizzle ORM
- Real-time data synchronization
- Error handling and loading states
- Keyboard shortcuts for power users
- Auto-save functionality

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Query** - Data fetching and caching

### Backend
- **tRPC** - End-to-end typesafe APIs
- **Drizzle ORM** - TypeScript ORM
- **Zod** - Schema validation
- **Next.js API Routes** - Serverless functions

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Vercel Analytics** - Performance monitoring

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Database (PostgreSQL recommended)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/postly.git
cd postly
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="your-database-url"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. Set up the database
```bash
npm run db:push
```

5. Start the development server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
postly/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── posts/            # Post-related pages
│   ├── categories/       # Category pages
│   └── globals.css       # Global styles
├── components/           # Reusable UI components
│   ├── rich-text-editor.tsx
│   ├── navigation.tsx
│   └── blog-card.tsx
├── src/
│   ├── server/trpc/      # tRPC server configuration
│   ├── utils/            # Utility functions
│   ├── hooks/            # Custom React hooks
│   ├── store/            # State management
│   └── types/            # TypeScript type definitions
├── lib/                  # Library functions
└── public/              # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open database studio

## API Routes

### Posts
- `GET /api/trpc/posts.getAll` - Get all posts
- `GET /api/trpc/posts.getBySlug` - Get post by slug
- `POST /api/trpc/posts.create` - Create new post
- `PUT /api/trpc/posts.update` - Update existing post
- `DELETE /api/trpc/posts.delete` - Delete post

### Categories
- `GET /api/trpc/categories.getAll` - Get all categories
- `POST /api/trpc/categories.create` - Create new category
- `PUT /api/trpc/categories.update` - Update category
- `DELETE /api/trpc/categories.delete` - Delete category

## Configuration

### Database
The application uses Drizzle ORM for database operations. Configure your database connection in the `.env` file and run migrations using the provided scripts.

### Authentication
Authentication is handled through NextAuth.js. Configure your authentication providers in the NextAuth configuration file.

### Styling
The application uses Tailwind CSS for styling. Custom styles are defined in `app/globals.css` and component-specific styles use Tailwind utility classes.

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Other Platforms
The application can be deployed to any platform that supports Node.js applications:
- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

## Performance

- Server-side rendering for improved SEO
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Efficient data fetching with tRPC
- Caching strategies for better performance

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review existing issues and discussions
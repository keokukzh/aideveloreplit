# AI Development Instructions

## Architecture Overview

This is a **monolithic full-stack TypeScript application** with three main components:
- **Client**: React + Vite frontend (`client/`)
- **Server**: Express.js backend (`server/`)  
- **Cloudflare Worker**: Edge functions (`cloudflare/`)
- **Shared**: Common schemas and types (`shared/`)

The project builds to a single Express server that serves both API routes and static client assets in production.

## Key Path Aliases
```typescript
"@": "./client/src"          // Frontend components/utils
"@shared": "./shared"        // Database schemas & shared types
"@assets": "./attached_assets" // Static images/assets
```

## Database & Schema Patterns

- **ORM**: Drizzle ORM with PostgreSQL (Neon serverless)
- **Schema Location**: `shared/schema.ts` - contains all table definitions
- **Migrations**: Run `npm run db:push` to sync schema changes
- **Validation**: Zod schemas auto-generated from Drizzle tables using `createInsertSchema()`

Key tables: `users`, `leads`, `contacts`, `agentConfigs`, `chatSessions`, `chatMessages`

## Development Workflow

```bash
npm run dev     # Starts Express server with Vite dev middleware
npm run build   # Builds client + bundles server for production
npm run start   # Production server
npm run check   # TypeScript compilation check
```

**Important**: Single-port architecture - Express serves both API (`/api/*`) and client routes on port 5000.

## API Implementation Patterns

### Response Structure
All API endpoints follow consistent JSON response patterns:
```typescript
// Success responses
{ success: true, data: any }
// Error responses  
{ success: false, message: string }
```

### Validation Pattern
Routes use inline Zod schema validation:
```typescript
const schema = z.object({ field: z.string().min(1, "Required") });
const result = schema.safeParse(req.body);
if (!result.success) {
  return res.status(400).json({ success: false, message: "Validation error" });
}
```

### Demo Data Strategy
Dashboard endpoints create demo data on-the-fly for immediate testing when no user data exists.

### Stripe Integration
- Uses EUR currency for German market
- Amounts converted to cents: `Math.round(amount * 100)`
- Payment intents include module metadata

## Frontend Patterns

### Component Structure
- **UI Components**: `client/src/components/ui/` - shadcn/ui components with custom styling
- **Feature Components**: Organized by domain (`landing/`, `products/`, `dashboard/`)
- **Pages**: Route components in `client/src/pages/`

### Styling System
- **Framework**: Tailwind CSS with custom design tokens
- **Utilities**: `cn()` function in `lib/utils.ts` for conditional classes
- **Animation**: Custom hover effects with `hover-elevate` and `active-elevate-2` classes
- **Theme**: HSL color variables with CSS custom properties
- **Elevation System**: Uses `--elevate-1` (0.03 opacity) and `--elevate-2` (0.08 opacity) for layered interactions

### State Management
- **Router**: Wouter (lightweight React router)
- **Data Fetching**: TanStack Query (`@tanstack/react-query`)
- **Forms**: React Hook Form with Zod resolvers

## Backend Architecture Details

### Server Structure
- **Entry Point**: `server/index.ts` with Express app + HTTP server
- **Vite Integration**: `server/vite.ts` handles dev middleware and prod static serving
- **Storage Layer**: `server/storage.ts` provides typed database interface abstraction

### Dev/Prod Serving Strategy
- **Development**: Vite middleware with HMR via `setupVite()`
- **Production**: Static file serving from `dist/public` via `serveStatic()`
- **Template Handling**: Development reloads `index.html` from disk with cache-busting

### OpenAI Integration
- **Service**: `server/services/openai.ts` with timeout configuration (30s)
- **Model**: Uses `gpt-5` (latest as of Aug 2025)
- **Pattern**: Structured `ChatResponse` interface with action types
- **Knowledge Base**: Typed configuration for business context

## Widget Architecture

The project includes an embeddable chat widget (`server/widget.js`) designed for cross-domain deployment. Key considerations:
- Permissive CORS configuration for embedding
- Separate endpoint handling for widget vs. main app
- Session management for widget interactions

## Development Environment

- **Replit Integration**: Configured with `@replit/vite-plugin-*` for Replit-specific features
- **TypeScript**: Strict configuration across all modules
- **Testing**: Vitest setup (though minimal test coverage currently)

## Common Gotchas

1. **Single Entry Point**: All requests go through the Express server - there's no separate API server
2. **Widget CORS**: Widget functionality requires permissive CORS; be careful with credential handling
3. **Database URL**: Must set `DATABASE_URL` environment variable for Drizzle
4. **Build Process**: Client builds first, then server bundles with esbuild
5. **Path Resolution**: Use absolute imports with the configured aliases, not relative paths
6. **Vite Dev Cache**: Template includes nanoid cache-busting in development
7. **Storage Interface**: Use `IStorage` interface methods, not direct database queries

## File Organization Conventions

- Keep shared types/schemas in `shared/`
- UI components follow shadcn/ui patterns with custom variants
- Business logic components in feature-specific directories
- API routes organized by domain in single `routes.ts` file
- Database operations centralized in `server/storage.ts`
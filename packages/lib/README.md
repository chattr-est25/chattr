# Lib Package

Shared library package containing internal utilities, helpers, middleware, and common functionality used across all services.

## 📦 Purpose

This package provides reusable code shared by multiple services:

- **Logger Setup** - Structured logging with Pino
- **Helper Functions** - Common utilities
- **Middleware** - Shared Elysia middleware
- **Type Definitions** - Common types used across services
- **Error Handling** - Centralized error utilities

## 📁 Structure

```
packages/lib/
├── src/
│   ├── logger.ts           # Logger setup and configuration
│   ├── helpers/            # Utility functions
│   ├── middleware/         # Shared middleware
│   ├── types.ts            # Shared type definitions
│   ├── errors.ts           # Error handling utilities
│   └── index.ts            # Export public API
└── package.json
```

## 🔧 Quick Start

```typescript
import { logger, errorHandler } from "lib";
import type { CommonType } from "lib";

export const app = new Elysia()
  .use(errorHandler)
  .get("/users/:id", ({ params }) => {
    logger.info("Fetching user", { userId: params.id });
  });
```

## 📖 Usage in Services

Services import from this package through workspace dependencies:

```json
{
  "dependencies": {
    "lib": "workspace:*"
  }
}
```

## 🚀 Development

### Adding New Utilities

1. Create file in appropriate subdirectory (`helpers/`, `middleware/`, etc.)
2. Export from `src/index.ts`

## 🎯 Best Practices

1. **Keep it general** - Only add utilities used by multiple services
2. **Well documented** - Add JSDoc comments to exported functions
3. **Type safe** - Use TypeScript types, no `any`
4. **Testable** - Utilities should be pure and testable

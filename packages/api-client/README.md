# API Client Package

Type-safe API client for inter-service communication. Uses Elysia Eden to provide end-to-end type safety across all microservices without duplicating types.

## 📦 Purpose

This package provides:

- **Type-Safe Clients** - Automatically generated from service schemas
- **Zero Runtime Overhead** - Types are stripped at compile time
- **Single Source of Truth** - Types derived from service definitions

## 📁 Structure

```
packages/api-client/
├── src/
│   ├── index.ts              # Main exports
│   ├── gateway.ts            # Gateway service client
│   ├── user.ts               # User service client
│   └── chat.ts               # Chat service client
├── package.json
└── tsconfig.json
```

## 💡 Usage

### Basic Usage

```typescript
import { api } from "api-client";

// Call user service endpoints - fully typed!
const user = await api.user.profile.get({ userId: "123" });

// Create new user
const newUser = await api.user.register.post({
  email: "user@example.com",
  password: "secure-password",
});

// Send message
const msg = await api.chat.messages.post({
  conversationId: "conv-123",
  text: "Hello!",
});
```

### In Services

```json
{
  "dependencies": {
    "api-client": "workspace:*"
  }
}
```

## 🚀 Adding New Service Clients

1. **Create service client file** - `src/new-service.ts`

```typescript
import { eden } from "@elysiajs/eden";
import type { App } from "services/new-service";

export const newServiceClient = eden<App>(process.env.NEW_SERVICE_URL);
```

2. **Export from main** - Update `src/index.ts`

```typescript
export { newServiceClient } from "./new-service";
```

## 📝 Notes

- All client calls are async (return Promises)
- Types are fully inferred from service definitions
- No runtime overhead - types erased at compile time
- Supports all HTTP methods: GET, POST, PUT, PATCH, DELETE

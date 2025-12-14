# Gateway Service

The API Gateway service serves as the central entry point for all client requests. It routes requests to appropriate microservices, aggregates responses, and handles cross-cutting concerns like CORS, security, and request timing.

## Quick Start

### Prerequisites

- Bun installed (see root README)
- Dependencies installed (`bun install` from root)

### Setup

1. **Copy environment configuration**

   ```bash
   cp .env.sample .env
   ```

2. **Start development server**

   ```bash
   bun run dev
   ```

   The gateway will be available at `http://localhost:3000`

## Available Commands

```bash
bun run dev          # Start in development mode with hot-reload
bun run build        # Build standalone binary for production
bun run start        # Run the compiled binary
```

## Service Features

- **Request Routing** - Routes requests to appropriate microservices
- **CORS Support** - Configured via Elysia CORS middleware
- **Security Headers** - Applied via Elysia Helmet
- **Performance Monitoring** - Request timing via server-timing middleware
- **OpenAPI Documentation** - Auto-generated API docs at `/swagger`
- **Health Checks** - Service health endpoint

## Environment Variables

Key variables in `.env`:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## API Documentation

Auto-generated OpenAPI documentation is available at `http://localhost:3000/swagger`

## Monitoring

Monitor service health via:

```bash
curl http://localhost:3000/health
```

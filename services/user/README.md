# User Service

User management service that handles authentication, user profiles, and account management.

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

## Available Commands

```bash
bun run dev          # Start in development mode with hot-reload
bun run build        # Build standalone binary for production
bun run start        # Run the compiled binary
```

## Service Features

- **User Authentication** - Login, registration, and session management
- **User Profiles** - Create and manage user profiles
- **Account Management** - Update user information and preferences
- **Authorization** - Permission and role-based access control

## Main Endpoints

- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /users/:id` - Get user profile
- `PUT /users/:id` - Update user profile
- `DELETE /users/:id` - Delete user account
- `GET /health` - Service health check

## Environment Variables

Key variables in `.env`:

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

## Building for Production

```bash
bun run build
```

This creates a standalone binary at `services/user/server`. Run it with:

```bash
./services/user/server
```

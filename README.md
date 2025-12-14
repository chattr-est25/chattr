# Chattr

A modern, scalable microservices architecture built with **Bun**, **Elysia**, and **TypeScript**. Chattr is a real-time communication platform with a modular service-oriented design.

## 🚀 Quick Start

### Prerequisites

- **Bun** (v1.3.3 or later) - [Install Bun](https://bun.sh)
- **Git**

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd chattr
   ```

2. **Install Bun** (if not already installed)

   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

3. **Install dependencies**

   ```bash
   bun install
   ```

4. **Setup environment variables**

   Each service requires its own `.env` file. Copy the sample files:

   ```bash
   # Gateway Service
   cp services/gateway/.env.sample services/gateway/.env

   # Chat Service
   cp services/chat/.env.sample services/chat/.env

   # User Service
   cp services/user/.env.sample services/user/.env
   ```

   Then update the `.env` files with your configuration values.

5. **Start development servers**

   ```bash
   bun run dev
   ```

   This starts all services in development mode with hot reloading.

## 📋 Project Structure

```
chattr/
├── services/                 # Microservices
│   ├── gateway/             # API Gateway - Routes & orchestrates requests
│   ├── chat/                # Chat Service - Real-time messaging
│   └── user/                # User Service - User management & authentication
│
├── packages/                # Shared packages & utilities
│   ├── config/              # Shared configurations (TypeScript, Biome)
│   ├── lib/                 # Internal utilities & helpers
│   └── api-client/          # Type-safe API client (Eden)
│
└── [config files]
    ├── package.json         # Workspace root configuration
    ├── turbo.json           # Turbo build system config
    ├── biome.jsonc          # Code quality & formatting
    └── commitlint.config.ts # Git commit linting
```

## 🏗️ Architecture

### Service Overview

**Gateway Service** (`services/gateway`)

- Central API entry point
- Request routing and orchestration
- OpenAPI documentation aggregation
- CORS and security middleware
- Health checks

**Chat Service** (`services/chat`)

- Real-time messaging functionality
- Message storage and retrieval
- Chat room management
- WebSocket support

**User Service** (`services/user`)

- User authentication and authorization
- User profile management
- Registration and login
- Permission management

### Shared Packages

**Config Package** (`packages/config`)

- TypeScript configurations
- Biome linting & formatting rules
- Shared development configurations

**Lib Package** (`packages/lib`)

- Logging utilities (via elysia-logger)
- Common helper functions
- Shared middleware
- Error handling utilities

**API Client Package** (`packages/api-client`)

- Type-safe API client using Elysia Eden
- Automatically generated from service types
- End-to-end type safety across services

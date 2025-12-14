# Chat Service

Real-time messaging service that handles chat messages, conversations, and chat room management.

## 📦 Quick Setup

### 1. Environment Configuration

```bash
cp .env.sample .env
```

Edit `.env` with your configuration:

- `PORT` - Server port (default: 3002)
- `NODE_ENV` - Environment (development/production)

### 2. Install Dependencies

```bash
bun install
```

### 3. Start Development

```bash
bun run dev
```

## 🎯 What This Service Does

- **Message Management** - Send, receive, and store chat messages
- **Chat Rooms** - Create and manage chat rooms/conversations
- **Message History** - Retrieve chat history and message threads
- **OpenAPI Documentation** - Auto-generated API docs at `/swagger`

## 🛠️ Available Commands

```bash
bun run dev              # Start with hot-reload
bun run build            # Build for production
bun run start            # Run the compiled binary
bun run typecheck        # Type check the service
```

## 📡 API Endpoints

- Message sending endpoints
- Chat room management endpoints
- Message history retrieval endpoints
- Health checks at `/health`
- OpenAPI documentation at `/swagger`

# SFL Gateway

API Gateway for the Survivor Fantasy League microservices architecture.

## Overview

The SFL Gateway serves as the single entry point for all client requests to the Survivor Fantasy League backend services. It provides:

- **Request Routing**: Routes requests to appropriate microservices
- **Authentication**: Handles JWT token validation and forwarding
- **CORS Management**: Configured CORS policies for frontend integration
- **Security**: Implements security headers and request validation
- **Logging**: Centralized request logging and monitoring

## Architecture

```
Frontend → SFL Gateway → Microservices
                      ├── Auth Service
                      ├── Game Service (future)
                      └── Leaderboard Service (future)
```

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Environment Configuration:**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Development:**

   ```bash
   npm run dev
   ```

4. **Production:**
   ```bash
   npm run build
   npm start
   ```

## Configuration

### Environment Variables

- `PORT`: Gateway server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `AUTH_SERVICE_URL`: URL of the auth service (default: http://localhost:3001)
- `JWT_SECRET`: Secret for JWT token verification
- `CORS_ORIGIN`: Allowed CORS origin for frontend

## API Routes

### Gateway Health

- `GET /health` - Gateway health check

### Auth Service (Proxied)

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth initiation
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/change-password` - Change user password
- `GET /api/auth/protected` - Protected route example

All auth routes are proxied to the auth service with the `/api/auth` prefix removed.

## Development

### Project Structure

```
src/
├── config/           # Configuration management
├── middleware/       # Express middleware
├── proxy/           # Service proxy configurations
├── routes/          # Route definitions
└── index.ts         # Main application entry
```

### Adding New Services

1. **Add service configuration** in `src/config/index.ts`
2. **Create proxy configuration** in `src/proxy/index.ts`
3. **Add routes** in `src/routes/index.ts`

Example:

```typescript
// In proxy/index.ts
export const gameServiceProxy = createProxyMiddleware({
  target: config.gameServiceUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/api/game': '',
  },
});

// In routes/index.ts
router.use('/game/*', verifyToken, gameServiceProxy);
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

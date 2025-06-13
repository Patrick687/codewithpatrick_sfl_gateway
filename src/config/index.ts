import dotenv from 'dotenv';

// Load environment variables based on NODE_ENV
const env = process.env.NODE_ENV || 'dev';
console.log(`Loading environment variables for: ${env}`);

// Map NODE_ENV values to actual env file names
const getEnvFile = (environment: string): string => {
  switch (environment) {
    case 'dev':
    case 'development':
      return '.env.dev';
    case 'test':
      return '.env.test';
    case 'docker':
      return '.env.docker';
    case 'production':
    case 'prod':
      return '.env.prod';
    default:
      return '.env.dev'; // default to dev
  }
};

const envFile = getEnvFile(env);
console.log(`Using environment file: ${envFile}`);

// Try to load the specific env file
const result = dotenv.config({ path: envFile });
if (result.error) {
  console.warn(`Could not load ${envFile}, falling back to .env`);
  dotenv.config(); // fallback to .env
}

// Utility functions for required environment variables
function requireString(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue;
  if (!value) {
    throw new Error(`Required environment variable ${name} is not set`);
  }
  return value;
}

function requireInt(name: string, defaultValue?: number): number {
  const value = process.env[name];
  if (!value && defaultValue === undefined) {
    throw new Error(`Required environment variable ${name} is not set`);
  }
  const parsed = parseInt(value || String(defaultValue), 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${name} must be a valid integer, got: ${value}`);
  }
  return parsed;
}




export const config = {
  port: requireInt('PORT', 3000),
  nodeEnv: requireString('NODE_ENV'),

  // Service URLs
  authServiceUrl: requireString('AUTH_SERVICE_URL', 'http://localhost:3001'),
  leagueServiceUrl: requireString('LEAGUE_SERVICE_URL', 'http://localhost:3002'),

  // JWT Configuration
  jwtSecret: requireString('JWT_SECRET'),

  // CORS Configuration
  corsOrigin: requireString('CORS_ORIGIN', 'http://localhost:3000'),

  // Rate Limiting
  rateLimitWindowMs: requireInt('RATE_LIMIT_WINDOW_MS', 900000),
  rateLimitMaxRequests: requireInt('RATE_LIMIT_MAX_REQUESTS', 100),
} as const;

export default config;

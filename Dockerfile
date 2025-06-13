# Base stage
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# Development stage
FROM base AS development
ENV NODE_ENV=docker
RUN npm install
COPY . .
EXPOSE 3000
EXPOSE 9230
CMD ["npm", "run", "dev:docker"]

# Production dependencies stage
FROM base AS production-deps
ENV NODE_ENV=production
RUN npm ci --only=production && npm cache clean --force

# Build stage
FROM base AS build
ENV NODE_ENV=production
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./
EXPOSE 3000
USER node
CMD ["npm", "start"]
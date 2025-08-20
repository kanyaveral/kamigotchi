# Use Node.js 22 as specified in package.json engines
FROM node:22-alpine AS base

# Install pnpm
RUN corepack enable

# Set working directory
WORKDIR /app

# Copy package.json files and pnpm configuration
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/client/package.json ./packages/client/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the client application
WORKDIR /app/packages/client
RUN pnpm run build:prod

# Production stage - serve the built app
FROM nginx:alpine AS production

# Copy built files to nginx
COPY --from=base /app/packages/client/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

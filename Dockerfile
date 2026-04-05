# Stage 1: Install dependencies
FROM node:18-bookworm AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Use legacy-peer-deps to fix the eslint version conflict
# No need for apk add libc6-compat on bookworm as it's already included
RUN npm install --legacy-peer-deps

# Stage 2: Build the application
FROM node:18-bookworm AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED 1

# Build the Next.js app
RUN npm run build

# Stage 3: Run the production server
FROM node:18-bookworm AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create user (same as before)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone output from the builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# Bind to all network interfaces so Docker can reach it
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

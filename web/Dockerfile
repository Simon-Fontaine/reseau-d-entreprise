# =============================================================================
# Multi-stage Dockerfile for Next.js with custom server (Socket.IO)
# =============================================================================

FROM node:22-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

# -----------------------------------------------------------------------------
# Dependencies (all)
# -----------------------------------------------------------------------------
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# -----------------------------------------------------------------------------
# Dependencies (production only)
# -----------------------------------------------------------------------------
FROM base AS deps-prod
RUN apk add --no-cache libc6-compat python3 make g++
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# -----------------------------------------------------------------------------
# Builder
# -----------------------------------------------------------------------------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build
# Compile server.ts, db/schema.ts, and db/migrate.ts to JavaScript
RUN npx tsc server.ts db/schema.ts db/migrate.ts --outDir dist --esModuleInterop --module NodeNext --moduleResolution NodeNext --skipLibCheck --target ES2022

# -----------------------------------------------------------------------------
# Runner (Production)
# -----------------------------------------------------------------------------
FROM base AS runner
RUN apk add --no-cache libc6-compat curl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy Next.js standalone build
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy compiled server and drizzle migrations
COPY --from=builder --chown=nextjs:nodejs /app/dist ./
COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle

# Copy entrypoint script
COPY --from=builder --chown=nextjs:nodejs /app/docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Production deps for server.ts (drizzle-orm, socket.io, pg, etc.)
COPY --from=deps-prod /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV RUN_MIGRATIONS="false"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

ENTRYPOINT ["./docker-entrypoint.sh"]

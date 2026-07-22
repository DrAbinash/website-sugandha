# ============================================================================
#  Dockerfile — Care Diagnostics website (Dr. Sugandha Priyadarshini)
#  Optimised for Synology Container Manager.
#  Uses npm instead of bun for Prisma compatibility in Docker.
# ============================================================================

# ---------- Stage 1: deps ----------
FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* bun.lock* ./
COPY prisma ./prisma
RUN npm install

# ---------- Stage 2: builder ----------
FROM node:20-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ---------- Stage 2b: prisma CLI (isolated) ----------
# The Next.js standalone output only bundles @prisma/client, NOT the `prisma`
# CLI that docker-entrypoint.sh runs to create the SQLite tables on a fresh
# volume. Installing it on its own brings along its full dependency tree
# (@prisma/config → effect, c12, …) so `prisma db push` actually works at
# runtime. Without this, db push silently fails, the SiteSetting table is
# never created, and saving admin settings returns a 500.
# Keep this version in sync with `prisma` / `@prisma/client` in package.json.
FROM node:20-slim AS prisma-cli
WORKDIR /prisma-cli
RUN npm init -y >/dev/null 2>&1 \
    && npm install prisma@6.19.3 --no-audit --no-fund

# ---------- Stage 3: runner ----------
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV DATABASE_URL="file:/app/data/care_diagnostics.db"

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

# ── CRITICAL: copy standalone server + static assets + public folder ──
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Prisma — generated client (queries) + CLI (runtime `db push`)
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=prisma-cli --chown=nextjs:nodejs /prisma-cli/node_modules ./prisma-cli/node_modules
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

USER nextjs
EXPOSE 3000
CMD ["./docker-entrypoint.sh"]

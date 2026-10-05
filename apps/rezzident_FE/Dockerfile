# ── Stage 1: Base ──────────────────────────────────────────
# Build context is the REPO ROOT so Docker can access:
#   - pnpm-lock.yaml (shared lockfile)
#   - packages/*     (workspace deps: design-tokens, shared-types, utils, api-client)
# ──────────────────────────────────────────────────────────
FROM node:26.9-alpine AS base
# corepack was removed from Node 25+ bundles; install pnpm directly
RUN npm install -g pnpm@9.15.0 && pnpm -v

# ── Stage 2: Install dependencies ──────────────────────────
FROM base AS deps
WORKDIR /app

# Copy workspace manifests first — changes here bust the layer cache
# but source-code changes further down do not.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Stub every workspace package.json so pnpm can resolve the graph
# without copying all source code yet.
COPY packages/design-tokens/package.json  ./packages/design-tokens/
COPY packages/shared-types/package.json   ./packages/shared-types/
COPY packages/utils/package.json          ./packages/utils/
COPY packages/api-client/package.json     ./packages/api-client/
COPY apps/rezzident_FE/package.json       ./apps/rezzident_FE/

RUN pnpm install --frozen-lockfile

# ── Stage 3: Dev (hot-reload) ──────────────────────────────
# Used by docker-compose.override.yml for local development.
# Source code is volume-mounted at runtime — node_modules come
# from the deps layer above so the host's node_modules are NOT used.
# Vite listens on 0.0.0.0 (--host) so it's reachable from the host.
FROM deps AS dev
WORKDIR /app
EXPOSE 5173
ENV CHOKIDAR_USEPOLLING=true
CMD ["pnpm", "--filter", "rezzident-fe", "dev", "--host"]

# ── Stage 4: Build ─────────────────────────────────────────
FROM deps AS build
WORKDIR /app

# Now copy full source (workspace packages + FE app)
COPY packages/ ./packages/
COPY apps/rezzident_FE/ ./apps/rezzident_FE/

# VITE_ env vars must be baked in at build time — Vite embeds them
# into the JS bundle during `vite build`. Pass them as build ARGs.
ARG VITE_API_BASE_URL=""
ARG VITE_CDN_URL=""
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_CDN_URL=$VITE_CDN_URL

# turbo build respects the dependsOn graph — builds packages/* first,
# then rezzident-fe. Output lands in apps/rezzident_FE/dist/
RUN pnpm turbo run build --filter=rezzident-fe...

# ── Stage 4: Runner ────────────────────────────────────────
# Serve the static SPA dist/ with `serve`.
# -s (single-page app mode) falls back to index.html for unknown routes
# so client-side routing works correctly.
# nginx handles this in production on EC2 — this is for Docker/local only.
FROM node:26.9-alpine AS runner

RUN npm install -g serve@14

WORKDIR /app

# Copy dist owned by the built-in non-root 'node' user (uid 1000)
COPY --from=build --chown=node:node /app/apps/rezzident_FE/dist ./dist

EXPOSE 3000

# Run as non-root — node:alpine ships with a 'node' user for exactly this purpose
USER node

CMD ["serve", "-s", "dist", "-l", "3000"]

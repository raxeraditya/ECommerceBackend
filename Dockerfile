# ==========================================
# STAGE 1: The Builder
# ==========================================
FROM oven/bun:1-alpine AS builder
WORKDIR /app

# Install everything (including dev dependencies) to build the app
COPY package.json bun.lock* ./
RUN bun install --target=bun

COPY . .
RUN DATABASE_URL="file:/tmp/dev.db" bun run prisma generate
RUN bun run build

# ==========================================
# STAGE 2: The Final Pure Runner
# ==========================================
FROM oven/bun:1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PRISMA_CLI_BINARY_TARGETS=linux-musl

# 1. Copy ONLY the package.json (leaving the lockfile behind)
COPY package.json ./

# 2. Install production dependencies and wipe the installation cache instantly
RUN bun install --production --target=bun && rm -rf ~/.bun/install/cache

# 3. Copy the compiled NestJS code and generated Prisma files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated/prisma ./src/generated/prisma
COPY --from=builder /app/prisma ./prisma

USER bun
EXPOSE 3000

CMD ["bun", "run", "dist/main.js"]
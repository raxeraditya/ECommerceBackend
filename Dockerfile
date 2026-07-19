# ==========================================================
# STAGE 1: The Builder (The messy workshop)
# ==========================================================
FROM oven/bun:1-alpine AS builder
WORKDIR /app

# Copy package manifests and lock files
COPY package.json bun.lockb* ./
COPY prisma ./prisma/

# Install EVERYTHING (including devDependencies so tsc can run)
RUN bun install --frozen-lockfile

# Copy the actual TypeScript source code
COPY . .

# Generate the Prisma client native to the Linux environment
RUN bunx prisma generate

# Compile TypeScript into plain JavaScript inside the /app/dist directory
RUN bun run build

# Remove development dependencies so ONLY production packages remain
RUN bun install --production


# ==========================================================
# STAGE 2: The Runner (The clean retail store)
# ==========================================================
FROM oven/bun:1-alpine AS runner
WORKDIR /app

# Setup low-privilege security identity
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# ONLY pull the hyper-optimized artifacts we actually need from the workshop
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./src/generated

# Fast file ownership adjustment
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000

# Boot the clean, compiled JavaScript app using Bun
CMD ["bun", "run", "dist/main.js"]
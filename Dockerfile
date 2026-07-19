# ---------- Builder ----------
FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./
COPY prisma ./prisma

RUN bun install
RUN bunx prisma generate
RUN bun install --production
RUN rm -rf /root/.bun/install/cache

COPY . .

# ---------- Runner ----------
FROM oven/bun:1-alpine

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only what is needed
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# 👇 ADD THIS: Copy your existing dev.db file from the builder stage
COPY --from=builder /app/dev.db ./dev.db

# Give appuser ownership of the /app directory (including the new dev.db)
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

CMD ["bun", "src/main.ts"]
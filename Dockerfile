# 1. Base Image: Official Alpine Bun 1.x image
FROM oven/bun:1-alpine

# 2. Set working directory
WORKDIR /app

# 3. Create non-root system user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 4. Copy package manifests FIRST
COPY package.json bun.lockb* ./

# 5. Copy prisma directory so 'postinstall' hook finds schema.prisma
COPY prisma ./prisma/

# 6. Install dependencies (Triggers 'bunx prisma generate')
RUN bun install

# 7. Copy the rest of the source code
COPY --chown=appuser:appgroup . ./

# 8. Switch to non-root execution identity
USER appuser

# 9. Expose port
EXPOSE 3000

# 10. Start command
CMD ["bun", "src/main.ts"]
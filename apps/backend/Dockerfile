FROM node:20-alpine AS builder

WORKDIR /app

# Copy monorepo dependencies
COPY package*.json ./
COPY packages/shared-types ./packages/shared-types
COPY apps/backend ./apps/backend

# Install & Build
RUN npm ci
RUN npm --prefix packages/shared-types run build
RUN npm --prefix apps/backend run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma
COPY --from=builder /app/apps/backend/package*.json ./apps/backend/

EXPOSE 5000

CMD ["node", "apps/backend/dist/server.js"]

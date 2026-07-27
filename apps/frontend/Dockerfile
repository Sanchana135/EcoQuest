FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY packages/shared-types ./packages/shared-types
COPY apps/frontend ./apps/frontend

RUN npm ci
RUN npm --prefix packages/shared-types run build
RUN npm --prefix apps/frontend run build

FROM nginx:alpine AS runner

COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

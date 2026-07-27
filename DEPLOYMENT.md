# EcoQuest Production Deployment Guide

## Overview
EcoQuest is a production-ready, enterprise-grade gamified environmental education platform built with Node.js/Express, TypeScript, Prisma ORM, and React Vite.

---

## 1. Quick Start with Docker Compose
The fastest way to deploy EcoQuest in production is using Docker Compose:

```bash
# Clone repository and enter directory
cd ecoquest

# Build and launch all services
docker-compose up --build -d
```

The services will be accessible at:
- **Frontend Web App**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:5000/api/v1`
- **OpenAPI Documentation**: `http://localhost:5000/api/v1/docs`
- **Health Check Endpoint**: `http://localhost:5000/api/v1/health`

---

## 2. Environment Variables Configuration
Copy `.env.example` to `.env` in `apps/backend/.env`:

```env
PORT=5000
NODE_ENV=production
DATABASE_URL=file:./dev.db
JWT_SECRET=super_secret_production_jwt_key_ecoquest_2026
CORS_ORIGIN=http://localhost:3000
```

---

## 3. Manual Build & Deployment

### Step A: Build Monorepo Workspaces
```bash
# Install dependencies
npm ci

# Sync Prisma Schema
npm --prefix apps/backend run prisma:push -- --accept-data-loss

# Build shared types, Express backend, and React frontend
npm run build
```

### Step B: Launch Backend Server
```bash
npm --prefix apps/backend start
```

---

## 4. Security & Production Features
- **HTTP Security Headers**: Enforced via security middleware (`X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`).
- **Rate Limiting**: Protected against brute-force attacks via `express-rate-limit`.
- **Database Health Check**: Integrated query-level monitoring at `/api/v1/health`.
- **OpenAPI Specification**: Interactive documentation available at `/api/v1/docs`.

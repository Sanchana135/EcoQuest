"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("./config/env");
const errorHandler_1 = require("./common/middleware/errorHandler");
const securityHeaders_1 = require("./common/middleware/securityHeaders");
const requestLogger_1 = require("./common/middleware/requestLogger");
const swagger_1 = require("./docs/swagger");
const db_1 = require("./database/db");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const users_routes_1 = __importDefault(require("./modules/users/users.routes"));
const classes_routes_1 = __importDefault(require("./modules/classes/classes.routes"));
const modules_routes_1 = __importDefault(require("./modules/modules/modules.routes"));
const quizzes_routes_1 = __importDefault(require("./modules/quizzes/quizzes.routes"));
const gamification_routes_1 = __importDefault(require("./modules/gamification/gamification.routes"));
const ai_routes_1 = __importDefault(require("./modules/ai/ai.routes"));
const notifications_routes_1 = __importDefault(require("./modules/notifications/notifications.routes"));
const certificates_routes_1 = __importDefault(require("./modules/certificates/certificates.routes"));
const reports_routes_1 = __importDefault(require("./modules/reports/reports.routes"));
const app = (0, express_1.default)();
// Security & Logging Middleware
app.use(securityHeaders_1.securityHeaders);
app.use(requestLogger_1.requestLogger);
app.use((0, cors_1.default)({ origin: env_1.config.corsOrigin, credentials: true }));
app.use(express_1.default.json({ limit: '10mb' }));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: { success: false, error: { code: 'TOO_MANY_REQUESTS', message: 'Too many requests, please try again later.' } },
});
app.use(limiter);
// Enhanced Production Health Check
app.get('/api/v1/health', async (req, res) => {
    let dbStatus = 'healthy';
    try {
        await db_1.db.$queryRaw `SELECT 1`;
    }
    catch (e) {
        dbStatus = 'degraded';
    }
    res.json({
        success: true,
        data: {
            status: 'healthy',
            database: dbStatus,
            version: '1.0.0',
            environment: env_1.config.nodeEnv,
            uptimeSeconds: Math.floor(process.uptime()),
            memoryUsage: process.memoryUsage(),
        },
        meta: { timestamp: new Date().toISOString() },
    });
});
// OpenAPI Documentation JSON Endpoint
app.get('/api/v1/docs', (req, res) => {
    res.json(swagger_1.openApiSpec);
});
// API v1 Routes
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/users', users_routes_1.default);
app.use('/api/v1/classes', classes_routes_1.default);
app.use('/api/v1/modules', modules_routes_1.default);
app.use('/api/v1/quizzes', quizzes_routes_1.default);
app.use('/api/v1/gamification', gamification_routes_1.default);
app.use('/api/v1/ai', ai_routes_1.default);
app.use('/api/v1/notifications', notifications_routes_1.default);
app.use('/api/v1/certificates', certificates_routes_1.default);
app.use('/api/v1/reports', reports_routes_1.default);
// Central Error Handler
app.use(errorHandler_1.errorHandler);
exports.default = app;

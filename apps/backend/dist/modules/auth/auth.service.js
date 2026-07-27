"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../../database/db");
const env_1 = require("../../config/env");
const errorHandler_1 = require("../../common/middleware/errorHandler");
class AuthService {
    static generateTokens(user) {
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, env_1.config.jwtSecret, { expiresIn: '1h' });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, env_1.config.jwtRefreshSecret, { expiresIn: '7d' });
        return { accessToken, refreshToken };
    }
    static async login(email, passwordHashOrPlain) {
        const user = await db_1.db.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new errorHandler_1.AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
        }
        const isValidPassword = await bcryptjs_1.default.compare(passwordHashOrPlain, user.passwordHash);
        if (!isValidPassword) {
            throw new errorHandler_1.AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
        }
        const tokens = this.generateTokens(user);
        return {
            tokens,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                avatarUrl: user.avatarUrl,
                level: user.level,
                xp: user.xp,
                streakDays: user.streakDays,
                createdAt: user.createdAt.toISOString(),
            },
        };
    }
    static async register(data) {
        const existing = await db_1.db.user.findUnique({ where: { email: data.email } });
        if (existing) {
            throw new errorHandler_1.AppError('User with this email already exists', 400, 'USER_EXISTS');
        }
        const passwordHash = await bcryptjs_1.default.hash(data.password, 10);
        const user = await db_1.db.user.create({
            data: {
                email: data.email,
                passwordHash,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role || 'STUDENT',
            },
        });
        const tokens = this.generateTokens(user);
        return {
            tokens,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                avatarUrl: user.avatarUrl,
                level: user.level,
                xp: user.xp,
                streakDays: user.streakDays,
                createdAt: user.createdAt.toISOString(),
            },
        };
    }
    static async getUserProfile(userId) {
        const user = await db_1.db.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404, 'NOT_FOUND');
        }
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            avatarUrl: user.avatarUrl,
            level: user.level,
            xp: user.xp,
            streakDays: user.streakDays,
            createdAt: user.createdAt.toISOString(),
        };
    }
}
exports.AuthService = AuthService;

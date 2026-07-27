"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
class AuthController {
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ success: false, error: { code: 'MISSING_FIELDS', message: 'Email and password are required' } });
            }
            const result = await auth_service_1.AuthService.login(email, password);
            return res.json({
                success: true,
                data: result,
                meta: { timestamp: new Date().toISOString() },
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async register(req, res, next) {
        try {
            const { email, password, firstName, lastName, role } = req.body;
            if (!email || !password || !firstName || !lastName) {
                return res.status(400).json({ success: false, error: { code: 'MISSING_FIELDS', message: 'All required registration fields must be provided' } });
            }
            const result = await auth_service_1.AuthService.register({ email, password, firstName, lastName, role });
            return res.status(201).json({
                success: true,
                data: result,
                meta: { timestamp: new Date().toISOString() },
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async me(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
            }
            const profile = await auth_service_1.AuthService.getUserProfile(req.user.id);
            return res.json({
                success: true,
                data: profile,
                meta: { timestamp: new Date().toISOString() },
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.AuthController = AuthController;

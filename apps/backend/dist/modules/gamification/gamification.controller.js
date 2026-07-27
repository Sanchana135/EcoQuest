"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamificationController = void 0;
const gamification_service_1 = require("./gamification.service");
class GamificationController {
    static async getOverview(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
            }
            const data = await gamification_service_1.GamificationService.getStudentOverview(req.user.id);
            return res.json({
                success: true,
                data,
                meta: { timestamp: new Date().toISOString() },
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async getLeaderboard(req, res, next) {
        try {
            const { period } = req.query;
            const leaderboard = await gamification_service_1.GamificationService.getLeaderboard(period);
            return res.json({
                success: true,
                data: leaderboard,
                meta: { total: leaderboard.length, timestamp: new Date().toISOString() },
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.GamificationController = GamificationController;

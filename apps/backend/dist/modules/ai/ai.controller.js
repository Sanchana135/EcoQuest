"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const ai_service_1 = require("./ai.service");
class AiController {
    static async chat(req, res, next) {
        try {
            const { prompt } = req.body;
            if (!req.user) {
                return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
            }
            if (!prompt || typeof prompt !== 'string') {
                return res.status(400).json({ success: false, error: { code: 'INVALID_PROMPT', message: 'Prompt is required' } });
            }
            const result = await ai_service_1.AiService.processUserPrompt(req.user.id, prompt);
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
    static async getRecommendations(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
            }
            const data = await ai_service_1.AiService.getRecommendations(req.user.id);
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
    static async getDailyTip(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
            }
            const data = await ai_service_1.AiService.getDailyEcoTip(req.user.id);
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
    static async getPerformanceAnalysis(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
            }
            const data = await ai_service_1.AiService.getPerformanceAnalysis(req.user.id);
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
}
exports.AiController = AiController;

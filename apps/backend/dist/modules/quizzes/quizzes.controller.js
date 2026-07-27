"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizzesController = void 0;
const quizzes_service_1 = require("./quizzes.service");
class QuizzesController {
    static async list(req, res, next) {
        try {
            const quizzes = await quizzes_service_1.QuizzesService.listAll();
            return res.json({
                success: true,
                data: quizzes,
                meta: { total: quizzes.length, timestamp: new Date().toISOString() },
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const quiz = await quizzes_service_1.QuizzesService.getById(id);
            return res.json({
                success: true,
                data: quiz,
                meta: { timestamp: new Date().toISOString() },
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async submit(req, res, next) {
        try {
            const { id } = req.params;
            const { answers } = req.body;
            if (!req.user) {
                return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
            }
            if (!answers || !Array.isArray(answers)) {
                return res.status(400).json({ success: false, error: { code: 'INVALID_SUBMISSION', message: 'Answers must be an array' } });
            }
            const result = await quizzes_service_1.QuizzesService.submitAttempt(req.user.id, id, answers);
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
    static async myAttempts(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
            }
            const attempts = await quizzes_service_1.QuizzesService.getStudentAttempts(req.user.id);
            return res.json({
                success: true,
                data: attempts,
                meta: { total: attempts.length, timestamp: new Date().toISOString() },
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.QuizzesController = QuizzesController;

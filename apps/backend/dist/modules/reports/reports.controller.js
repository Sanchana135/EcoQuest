"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const reports_service_1 = require("./reports.service");
class ReportsController {
    static async getStudentReport(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
            }
            const data = await reports_service_1.ReportsService.getStudentReport(req.user.id);
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
    static async getTeacherReport(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
            }
            const data = await reports_service_1.ReportsService.getTeacherReport(req.user.id);
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
    static async getParentReport(req, res, next) {
        try {
            const studentId = req.query.studentId;
            const data = await reports_service_1.ReportsService.getParentReport(studentId);
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
    static async getAdminAnalytics(req, res, next) {
        try {
            const data = await reports_service_1.ReportsService.getAdminAnalytics();
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
exports.ReportsController = ReportsController;

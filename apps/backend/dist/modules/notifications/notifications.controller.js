"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsController = void 0;
const notifications_service_1 = require("./notifications.service");
class NotificationsController {
    static async list(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
            }
            const data = await notifications_service_1.NotificationsService.getUserNotifications(req.user.id);
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
    static async markRead(req, res, next) {
        try {
            const { id } = req.params;
            if (!req.user) {
                return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
            }
            await notifications_service_1.NotificationsService.markAsRead(id, req.user.id);
            return res.json({
                success: true,
                data: { message: 'Notification marked as read' },
                meta: { timestamp: new Date().toISOString() },
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async markAllRead(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
            }
            await notifications_service_1.NotificationsService.markAllAsRead(req.user.id);
            return res.json({
                success: true,
                data: { message: 'All notifications marked as read' },
                meta: { timestamp: new Date().toISOString() },
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.NotificationsController = NotificationsController;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const db_1 = require("../../database/db");
class NotificationsService {
    static async createNotification(userId, title, message, type = 'INFO') {
        return db_1.db.notification.create({
            data: {
                userId,
                title,
                message,
                type,
            },
        });
    }
    static async getUserNotifications(userId) {
        const notifications = await db_1.db.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
        const unreadCount = await db_1.db.notification.count({
            where: { userId, isRead: false },
        });
        return {
            notifications: notifications.map((n) => ({
                id: n.id,
                title: n.title,
                message: n.message,
                type: n.type,
                isRead: n.isRead,
                createdAt: n.createdAt.toISOString(),
            })),
            unreadCount,
        };
    }
    static async markAsRead(id, userId) {
        return db_1.db.notification.updateMany({
            where: { id, userId },
            data: { isRead: true },
        });
    }
    static async markAllAsRead(userId) {
        return db_1.db.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    }
}
exports.NotificationsService = NotificationsService;

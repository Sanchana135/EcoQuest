import { db } from '../../database/db';

export class NotificationsService {
  static async createNotification(userId: string, title: string, message: string, type: string = 'INFO') {
    return db.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    });
  }

  static async getUserNotifications(userId: string) {
    const notifications = await db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const unreadCount = await db.notification.count({
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

  static async markAsRead(id: string, userId: string) {
    return db.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  static async markAllAsRead(userId: string) {
    return db.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}

import { db } from '../../database/db';

export class UsersService {
  static async listUsers() {
    return db.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        level: true,
        xp: true,
        streakDays: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

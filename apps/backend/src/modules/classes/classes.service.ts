import { db } from '../../database/db';

export class ClassesService {
  static async listForTenant() {
    return db.class.findMany({
      include: {
        teacher: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        _count: {
          select: { enrollments: true },
        },
      },
    });
  }
}

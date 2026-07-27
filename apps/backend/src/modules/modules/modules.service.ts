import { db } from '../../database/db';

export class ModulesService {
  static async getAll(category?: string) {
    const where = category ? { category } : {};
    return db.module.findMany({
      where,
      include: {
        _count: {
          select: { lessons: true, quizzes: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getById(id: string) {
    return db.module.findUnique({
      where: { id },
      include: {
        lessons: {
          orderBy: { orderIndex: 'asc' },
        },
        quizzes: {
          include: {
            questions: true,
          },
        },
      },
    });
  }

  static async create(data: {
    title: string;
    description: string;
    category: string;
    imageUrl?: string;
  }) {
    return db.module.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        imageUrl: data.imageUrl,
        isPublished: true,
      },
    });
  }

  static async addLesson(moduleId: string, data: {
    title: string;
    content: string;
    imageUrl?: string;
    videoUrl?: string;
    orderIndex?: number;
  }) {
    return db.lesson.create({
      data: {
        moduleId,
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        orderIndex: data.orderIndex || 1,
      },
    });
  }
}

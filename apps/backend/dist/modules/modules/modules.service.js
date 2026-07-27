"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModulesService = void 0;
const db_1 = require("../../database/db");
class ModulesService {
    static async getAll(category) {
        const where = category ? { category } : {};
        return db_1.db.module.findMany({
            where,
            include: {
                _count: {
                    select: { lessons: true, quizzes: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    static async getById(id) {
        return db_1.db.module.findUnique({
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
    static async create(data) {
        return db_1.db.module.create({
            data: {
                title: data.title,
                description: data.description,
                category: data.category,
                imageUrl: data.imageUrl,
                isPublished: true,
            },
        });
    }
    static async addLesson(moduleId, data) {
        return db_1.db.lesson.create({
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
exports.ModulesService = ModulesService;

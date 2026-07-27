"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const db_1 = require("../../database/db");
class UsersService {
    static async listUsers() {
        return db_1.db.user.findMany({
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
exports.UsersService = UsersService;

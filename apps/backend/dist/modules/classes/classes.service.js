"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassesService = void 0;
const db_1 = require("../../database/db");
class ClassesService {
    static async listForTenant() {
        return db_1.db.class.findMany({
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
exports.ClassesService = ClassesService;
